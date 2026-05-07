import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Hautpage from "../components/Hautpage"; // T-akked l-H kbira!

function DashboardLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#0f1016]">
      {/* 1. Sidebar fixed l-issar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      {/* 2. L-jiha dyal l-imin (TopBar + Content) */}
      <div className="flex-1 flex flex-col overflow-hidden"  style={{
          marginLeft: isCollapsed ? "90px" : "270px"
        }}>
        
        {/* HNA FIN KHASS Y-KOUN HAUTPAGE */}
        <Hautpage />

        {/* L-vestiaires dyal l-pages */}
      <main
        className="flex-1 overflow-y-auto p-4 bg-white transition-all duration-300"
       
      >          <Outlet />
        </main>

       </div>
      </div>
  );
}

export default DashboardLayout;