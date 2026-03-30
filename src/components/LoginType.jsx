import React from "react";
import img from "../assets/logo.webp";
import { useNavigate } from "react-router";
const LoginType = () => {
  const handleNavigation = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-300">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-3xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src={img}
            alt="LMS"
            className="w-20 mx-auto mb-3"
          />
          <h1 className="text-2xl font-bold">
            Welcome to Library Hub
          </h1>
          <p className="text-gray-500 text-sm">
            Select your login type
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Member */}
          <div
            onClick={() => handleNavigation("login/member")}
            className="cursor-pointer bg-blue-50 hover:bg-blue-100 p-6 rounded-xl shadow transition duration-300 text-center"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Member"
              className="w-16 mx-auto mb-4"
            />
            <h2 className="text-lg font-semibold">
              Login as Member
            </h2>
          </div>

          {/* Admin */}
          <div
            onClick={() => handleNavigation("login/admin")}
            className="cursor-pointer bg-green-50 hover:bg-green-100 p-6 rounded-xl shadow transition duration-300 text-center"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
              alt="Admin"
              className="w-16 mx-auto mb-4"
            />
            <h2 className="text-lg font-semibold">
              Login as Admin
            </h2>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a href="/signup"  className="text-blue-600 cursor-pointer hover:underline">
            Apply Now
          </a>
        </div>

      </div>
    </div>
  );
};

export default LoginType;