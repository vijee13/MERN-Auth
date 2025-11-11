import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

// --------------------------- REGISTER ---------------------------
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Set token cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ----------------- Send Welcome Email -----------------
    try {
      await transporter.sendMail({
        from: `"MERN Auth" <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: "🎉 Welcome to MERN Authentication!",
        html: `
          <h2>Hi ${name},</h2>
          <p>Welcome to MERN Authentication App! 🎉</p>
          <p>Your account was successfully created with email: <b>${email}</b></p>
          <p>Start exploring our platform and enjoy seamless authentication.</p>
          <br/>
          <p>— MERN Auth Team</p>
        `,
      });
      console.log(`✅ Welcome email sent to ${email}`);
    } catch (mailError) {
      console.error("⚠️ Failed to send welcome email:", mailError.message);
    }

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Register error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

// --------------------------- LOGIN ---------------------------
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Set JWT token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("❌ Login error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

// --------------------------- LOGOUT ---------------------------
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("❌ Logout error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

// --------------------------- EMAIL VERIFICATION ---------------------------
export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId; // populated by userAuth middleware

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Login again" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({ success: false, message: "Account already verified" });
    }

    // ✅ Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // ✅ Send OTP via email
    await transporter.sendMail({
      from: `"MERN Auth" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "🔐 Verify Your Account",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2 style="color:#333">Email Verification</h2>
          <p>Your OTP for verifying your account is:</p>
          <h1 style="letter-spacing:5px;color:#4f46e5">${otp}</h1>
          <p>This code will expire in <strong>24 hours</strong>.</p>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      `,
    });

    console.log(`📩 Verification OTP sent to ${user.email}: ${otp}`);

    return res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("❌ Verification OTP error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// ✅ Verify email OTP
export const verifyEmail = async (req, res) => {
  try {
    const userId = req.userId; // populated by userAuth middleware
    const { otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ success: false, message: "Missing details" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // ✅ Mark verified
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res.status(200).json({ success: true, message: "Email verified successfully 🎉" });
  } catch (error) {
    console.error("❌ Verify email error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};
// --------------------------- PASSWORD RESET ---------------------------
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ success: false, message: "Email is required" });

  try {
    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    await transporter.sendMail({
      from: `"MERN Auth" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "🔐 Password Reset OTP",
      text: `Your OTP is ${otp}. It is valid for 15 minutes.`,
    });

    return res
      .status(200)
      .json({ success: true, message: "Password reset OTP sent" });
  } catch (error) {
    console.error("❌ Send reset OTP error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

// --------------------------- AUTH CHECK (PROTECTED) ---------------------------
export const isAuthenticated = (req, res) => {
  try {
    // userAuth middleware should have attached req.userId
    if (!req.userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Token missing or invalid" });
    }

    return res.status(200).json({
      success: true,
      message: "User is authenticated",
      userId: req.userId,
    });
  } catch (error) {
    console.error("❌ Auth check error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};
