import React, { useEffect, useState } from 'react';
import { Settings, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

function Hautpage() {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    role: "developer",
  });

  useEffect(() => {
    const savedName = localStorage.getItem("userName") || "";
    const savedEmail = localStorage.getItem("userEmail") || "";
    const savedRole = localStorage.getItem("userRole") || "developer";

    setUserData({
      fullName: savedName,
      email: savedEmail,
      role: savedRole,
    });
  }, []);

  return (
    <div className="h-20 bg-[#ffffff] flex items-center justify-between px-8">

      <div></div>

      <div className="flex items-center gap-3">

        <Link
          to="/app/notification"
          className="p-2.5 bg-[#1a1c26] border border-white/5 rounded-full text-gray-400 hover:text-white transition"
        >
          <Bell size={20} />
        </Link>

        <Link
          to="/app/settings"
          className="p-2.5 bg-[#1a1c26] border border-white/5 rounded-full text-gray-400 hover:text-white transition"
        >
          <Settings size={20} />
        </Link>

        {/* Profile Info */}
        <div className="flex items-center gap-3 ml-2 bg-[#1a1c26] border border-white/5 p-1 pr-4 rounded-full">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-sm text-white">
            {userData.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">
              {userData.fullName}
            </span>

            <span className="text-[10px] text-gray-400">
              {userData.email}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Hautpage;