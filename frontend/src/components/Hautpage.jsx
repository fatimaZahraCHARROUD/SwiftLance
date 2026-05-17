import React, { useEffect, useState } from 'react';
import { Settings, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

function Hautpage() {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    role: "developer",
  });

  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const savedName = localStorage.getItem("userName") || "";
    const savedEmail = localStorage.getItem("userEmail") || "";
    const savedRole = localStorage.getItem("userRole") || "developer";

    setUserData({
      fullName: savedName,
      email: savedEmail,
      role: savedRole,
    });

    // Logic du compteur : filtre uniquement les projets imminents (J-2 ou moins)
    const fetchUrgentCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const projects = await response.json();

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        const urgentOnes = projects.filter(project => {
          // 1. التشييك على الـ Status بجميع الحالات: إذا كان المشروع ديجا Done ما يتحسبش ف الـ Badge
          const currentStatus = project.status ? project.status.toLowerCase().trim() : '';
          if (currentStatus === 'done' || currentStatus === 'completed') {
            return false; 
          }

          // 2. قراءة التاريخ الصحيح من الـ Database (التوافق بين deadline و endDate)
          const projectDeadline = project.deadline || project.endDate;
          if (!projectDeadline) return false;

          const pDate = new Date(projectDeadline);
          const pDay = new Date(pDate.getFullYear(), pDate.getMonth(), pDate.getDate()).getTime();
          const diffDays = Math.floor((pDay - today) / (1000 * 60 * 60 * 24));
          
          // Strictement entre 0 et 2 jours restants (les projets dépassés avec diffDays < 0 sont exclus)
          return diffDays >= 0 && diffDays <= 2; 
        });

        setNotificationCount(urgentOnes.length);
      } catch (err) {
        console.error("Error fetching notification count", err);
      }
    };

    fetchUrgentCount();
  }, []);

  return (
    <div className="h-20 bg-[#ffffff] flex items-center justify-between px-8">

      <div></div>

      <div className="flex items-center gap-3">

        {/* --- Bell Icon with Red Counter --- */}
        <Link
          to="/app/notification"
          className="relative p-2.5 bg-[#1a1c26] border border-white/5 rounded-full text-gray-400 hover:text-white transition"
        >
          <Bell size={20} />
          
          {/* Badge rouge dynamique */}
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white border-2 border-white">
              {notificationCount}
            </span>
          )}
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