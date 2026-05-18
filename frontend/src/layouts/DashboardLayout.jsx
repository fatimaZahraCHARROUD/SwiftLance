import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Hautpage from "../components/Hautpage"; 

function DashboardLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#0f1016]">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <div className="flex-1 flex flex-col overflow-hidden"  style={{
          marginLeft: isCollapsed ? "90px" : "270px"
        }}>
        
        <Hautpage />

      <main
        className="flex-1 overflow-y-auto p-4 bg-white transition-all duration-300"
       
      >          <Outlet />
        </main>

       </div>
      </div>
  );
}

export default DashboardLayout;