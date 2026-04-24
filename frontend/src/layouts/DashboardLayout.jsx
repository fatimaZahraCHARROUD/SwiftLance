import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Hautpage from "../components/Hautpage"; // T-akked l-H kbira!

function DashboardLayout() {
  return (
    <div className="flex h-screen bg-[#0f1016]">
      {/* 1. Sidebar fixed l-issar */}
      <Sidebar />


      {/* 2. L-jiha dyal l-imin (TopBar + Content) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HNA FIN KHASS Y-KOUN HAUTPAGE */}
        <Hautpage />

        {/* L-vestiaires dyal l-pages */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
       </div>
    </div>
  );
}

export default DashboardLayout;