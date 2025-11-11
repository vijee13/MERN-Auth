import React, { useContext, useEffect, useRef } from "react";

import axios from "axios";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar.jsx";

axios.defaults.withCredentials = true; // ✅ Ensure cookies are sent

const EmailVerify = () => {
  const { api, isLoggedin, userData, getUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  // ✅ Handle OTP input focus automatically
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // ✅ Handle backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // ✅ Handle paste event
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  // ✅ Submit OTP verification
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const otpArray = inputRefs.current.map((input) => input.value);
      const otp = otpArray.join("");

      if (!otp || otp.length !== 6) {
        return toast.warn("Please enter the 6-digit OTP");
      }

      const { data } = await axios.post(api(`/api/auth/verify-email`), { otp });

      if (data.success) {
        toast.success("Email verified successfully 🎉");
        await getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  // ✅ Redirect verified users to home
  useEffect(() => {
    if (isLoggedin && userData?.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedin, userData]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-transparent pt-24">
      <Navbar/>
      {/* Logo */}
      

      {/* Card */}
      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-sm text-indigo-100"
      >
        <h1 className="text-2xl font-semibold text-center text-white mb-2">
          Email Verification
        </h1>
        <p className="text-center text-indigo-300 mb-8">
          Enter the 6-digit code sent to your registered email.
        </p>

        {/* OTP Input */}
        <div
          className="flex justify-between mb-8"
          onPaste={handlePaste}
        >
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-800 hover:from-indigo-600 hover:to-indigo-900 text-white font-medium rounded-full transition-all"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
