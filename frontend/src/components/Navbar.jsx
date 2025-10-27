// src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clears token and user info from context/localStorage
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-3 flex justify-between items-center">
      <Link to="/dashboard" className="size-15 text-center text-l text-white text-sm p-[0.4rem] mr-1 rounded bg-gray-400/25 md:w-32 md:text-2xl">
        Invoice Genie
      </Link>
      <div className="space-x-1 md:space-x-4 flex items-center">
        {user ? (
          <>
            <Link
              to="/dashboard"
              className="p-[1vh] text-center bg-gray-700 w-[26vw] text-sm rounded hover:bg-gray-600 md:w-[12vw] md:h-[6vh] md:py-[1.3vh]"
            >
              Dashboard
            </Link>
            <Link
              to="/invoices"
              className="p-[1vh] text-center bg-gray-700 w-[26vw] text-sm rounded hover:bg-gray-600 md:w-[12vw] md:h-[6vh] md:py-[1.3vh]"
            >
              Invoices
            </Link>

            <Link
              to="/profile"
              className="p-[1vh] text-center bg-gray-700 w-[20vw] text-sm rounded hover:bg-gray-600 md:w-[12vw] md:h-[6vh] md:py-[1.3vh]"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-center bg-red-600 rounded hover:bg-red-700"
              className="p-[1vh] text-center bg-red-600 w-[24vw] text-sm rounded md:w-[12vw] md:h-[6vh] md:py-[1.3vh]"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700 hover:text-black"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-3 py-1 text-white bg-green-600 rounded hover:bg-green-700 hover:text-black"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
