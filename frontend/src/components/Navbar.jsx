import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUpload,
  FiList,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiUser,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="glass-navbar backdrop-blur-lg bg-white/5 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            >
              Code Review Assistant
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {user && (
                <>
                  <Link
                    to="/upload"
                    className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    <FiUpload className="mr-2" />
                    Upload
                  </Link>
                  <Link
                    to="/reports"
                    className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    <FiList className="mr-2" />
                    Reports
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="relative ml-3">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-300 text-sm">
                      {(() => {
                        // Safe fallback if user or email is undefined
                        if (!user) return "Welcome";
                        if (user.name) return `Welcome, ${user.name}`;
                        if (user.email && typeof user.email === "string")
                          return `Welcome, ${user.email.split("@")[0]}`;
                        return "Welcome";
                      })()}
                    </span>
                    <div className="relative">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors duration-200"
                      >
                        <FiLogOut className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/signin"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    <FiLogIn className="inline-block mr-1" /> Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    <FiUserPlus className="inline-block mr-1" /> Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <Link
                  to="/upload"
                  className="flex items-center text-gray-300 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiUpload className="mr-2" />
                  Upload
                </Link>
                <Link
                  to="/reports"
                  className="flex items-center text-gray-300 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiList className="mr-2" />
                  Reports
                </Link>
                <div className="border-t border-white/10 my-2"></div>
                <div className="px-3 py-2 text-sm text-gray-400">
                  {user && user.email
                    ? `Signed in as ${user.email}`
                    : "Signed in"}
                </div>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left flex items-center text-gray-300 hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                >
                  <FiLogOut className="mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="flex items-center text-gray-300 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiLogIn className="mr-2" />
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-base font-medium mt-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiUserPlus className="mr-2" />
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// Add these styles to your global CSS
const styles = `
  .glass-navbar {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    background-color: rgba(17, 24, 39, 0.7);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .mobile-menu-enter {
    animation: fadeIn 0.2s ease-out forwards;
  }
`;

// Add the styles to the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
