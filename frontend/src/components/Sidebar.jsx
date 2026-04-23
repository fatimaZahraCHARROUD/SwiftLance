import React, { useState } from 'react';
import { Link } from "react-router-dom";

function Sidebar({ onSubTabChange }) {
 
  
  
  const projects = [
    { id: 1, progress: 40 },
    { id: 2, progress: 100 }
  ];
  const hasPending = projects.some(p => p.progress < 100);

  return (
    <div className="w-64 fixed h-screen bg-[#3327db] text-white p-6 shadow-2xl transition-all">
      <h2 className="text-2xl font-bold mb-10 tracking-wider">SwiftLance</h2>
      
   <nav className="space-y-4">
  {/* ✅ Path dial dashboard index huwa ghi /app */}
  <Link to="/app" className="...">dashboard</Link> 
  
  <Link to="/app/note" className="...">notes</Link>
  <Link to="/app/tasks" className="...">tasks</Link>
  <Link to="/app/paiment" className="...">paiment</Link>
  <Link to="/app/planning" className="...">planning</Link>
  <Link to="/app/clients" className="...">Clients</Link>
  <Link to="/app/projects" className="...">Projects</Link>
</nav>
    </div>
  );
}

export default Sidebar;