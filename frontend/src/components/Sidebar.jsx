import React from 'react';
import { NavLink, useNavigate } from "react-router-dom"; 
import styles from './Sidebar.module.css';
import { 
  Bell, 
  LayoutDashboard, 
  StickyNote, 
  CheckSquare, 
  Wallet, 
  Calendar, 
  Users, 
  Briefcase,
  LogOut 
} from 'lucide-react'; 

function Sidebar() {
  const navigate = useNavigate(); 
  const projects = [{ id: 1, progress: 40 }, { id: 2, progress: 100 }];
  const pendingProjectsCount = projects.filter(p => p.progress < 100).length;

  const getStyle = ({ isActive }) => 
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.headerSection}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">S</div>
          <h2 className="text-xl font-bold text-white tracking-tight">SwiftLance</h2>
        </div>
        
        <div className={styles.notificationBox}>
          <Bell size={20} />
          {pendingProjectsCount > 0 && <span className={styles.badge}>{pendingProjectsCount}</span>}
        </div>
      </div>
      
      <nav className="flex flex-col flex-1">
        <NavLink to="/app" end className={getStyle}>
          <LayoutDashboard size={20} /> <span>Analytics</span>
        </NavLink>
        
        <NavLink to="/app/note" className={getStyle}>
          <StickyNote size={20} /> <span>Notes</span>
        </NavLink>

        <NavLink to="/app/tasks" className={getStyle}>
          <CheckSquare size={20} /> <span>Tasks</span>
        </NavLink>

        <NavLink to="/app/paiment" className={getStyle}>
          <Wallet size={20} /> <span>Payment</span>
        </NavLink>

        <NavLink to="/app/planning" className={getStyle}>
          <Calendar size={20} /> <span>Planning</span>
        </NavLink>

        <NavLink to="/app/clients" className={getStyle}>
          <Users size={20} /> <span>Customers</span>
        </NavLink>

        <NavLink to="/app/projects" className={getStyle}>
          <Briefcase size={20} /> <span>Projects</span>
        </NavLink>
      </nav>

      <div className="pt-6 border-t border-white/5">
        <button onClick={() => navigate('/login')} className={styles.logoutBtn}>
           <LogOut size={20} /> Se déconnecter
        </button>
      </div>
    </div>
  );
}

export default Sidebar;