import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.userId; // ✅ read from middleware

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID missing" });
    }

    const user = await userModel.findById(userId).select("name isAccountVerified");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
