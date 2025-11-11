import React, { useContext, useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import { Menu, X } from "lucide-react"; // ✅ lightweight icons for mobile menu

axios.defaults.withCredentials = true;

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, setUserData, setIsLoggedin, api } = useContext(AppContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false); // desktop dropdown
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // mobile menu
  const menuRef = useRef(null);

  // ✅ Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Send verification OTP
  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(
        api(`/api/auth/send-verify-otp`),
        {},
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/email-verify");
        setIsMenuOpen(false);
        setIsMobileMenuOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.info("Please login to verify your email");
        navigate("/login");
        return;
      }
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  // ✅ Logout (POST)
  const logout = async () => {
    try {
      const { data } = await axios.post(api(`/api/auth/logout`));
      if (data.success) {
        toast.success("Logged out successfully");
        setIsLoggedin(false);
        setUserData(null);
        setIsMenuOpen(false);
        setIsMobileMenuOpen(false);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 fixed top-0 left-0 bg-gradient-to-r from-blue-100 to-purple-300 backdrop-blur-md  shadow-lg z-50 text-white">
      {/* ✅ Logo */}
      <img
        src={logo}
        alt="Logo"
        className="w-28 sm:w-36 cursor-pointer bg-transparent object-contain select-none brightness-100 contrast-150 drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
        onClick={() => navigate("/")}
      />

      {/* ✅ Desktop Menu */}
      <div className="hidden sm:flex items-center space-x-6">
        {userData ? (
          <div className="relative" ref={menuRef}>
            {/* Avatar */}
            <div
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="w-9 h-9 flex justify-center items-center rounded-full bg-black text-white font-semibold cursor-pointer select-none"
            >
              {userData.name?.[0]?.toUpperCase() || "U"}
            </div>

            {/* Dropdown */}
            {isMenuOpen && (
              <div className="absolute top-12 right-0 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-200 w-44 animate-fade-in">
                <ul className="list-none m-0 p-1 text-sm">
                  {!userData.isAccountVerified && (
                    <li
                      onClick={sendVerificationOtp}
                      className="py-2 px-4 hover:bg-gray-100 cursor-pointer rounded-md"
                    >
                      Verify Email
                    </li>
                  )}
                  <li
                    onClick={logout}
                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer rounded-md text-red-600 font-medium"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 rounded-full px-9 py-3 text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition-colors shadow-md"
          >
            Login
          </button>
        )}
      </div>

      {/* ✅ Mobile Menu Icon */}
      <div className="sm:hidden flex items-center">
        {isMobileMenuOpen ? (
          <X
            className="w-6 h-6 text-white cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        ) : (
          <Menu
            className="w-6 h-6 text-white cursor-pointer"
            onClick={() => setIsMobileMenuOpen(true)}
          />
        )}
      </div>

      {/* ✅ Mobile Menu (Slide-down) */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-slate-900/95 text-indigo-100 shadow-2xl rounded-b-lg border-t border-white/10 animate-slide-down sm:hidden z-40 backdrop-blur-md">
          <ul className="flex flex-col text-sm font-medium p-4 space-y-2">
            {userData ? (
              <>
                <li className="flex items-center justify-between pb-3 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 flex justify-center items-center rounded-full bg-white/20 text-white font-semibold border border-white/20">
                      {userData.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="text-indigo-100 font-semibold">
                      {userData.name || "User"}
                    </span>
                  </div>
                </li>
                {!userData.isAccountVerified && (
                  <li
                    onClick={sendVerificationOtp}
                    className="py-2 hover:bg-indigo-800/60 rounded-md cursor-pointer"
                  >
                    Verify Email
                  </li>
                )}
                <li
                  onClick={logout}
                  className="py-2 text-red-300 hover:bg-indigo-800/60 rounded-md cursor-pointer"
                >
                  Logout
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full text-center rounded-full px-6 py-2 text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-md"
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
