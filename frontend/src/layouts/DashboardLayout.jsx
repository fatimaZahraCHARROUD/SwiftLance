import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // T-akked men had l-path!!

const DashboardLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar dyalk */}
      <Sidebar />

      {/* Muhtawa l-safahat */}
      <div style={{ flex: 1, padding: '20px', backgroundColor: '#f4f4f4' }}>
        <Outlet /> 
      </div>
    </div>
  );
};

// HAD L-STER HUWA L-MUHEM:
export default DashboardLayout;