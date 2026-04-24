import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom"; 
import styles from './Sidebar.module.css';
import { 
  LayoutDashboard, StickyNote, CheckSquare, 
  Wallet, Calendar, Users, Briefcase, LogOut,
  ChevronLeft, ChevronRight 
} from 'lucide-react'; 

function Sidebar() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getStyle = ({ isActive }) => {
    let base = styles.link;
    if (isActive) base += ` ${styles.active}`;
    if (isCollapsed) base += ` ${styles.collapsedLink}`;
    return base;
  };

  return (
    <div className={`${styles.sidebarContainer} ${isCollapsed ? styles.collapsedSidebar : ''}`}>
      <button 
        className={styles.toggleBtn} 
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Header Section: Safi nqiya ghir l-Logo */}
      <div className={styles.headerSection}>
        <div className="flex items-center gap-3">
          <div className="min-w-[35px] h-[35px] bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            S
          </div>
          {!isCollapsed && <h2 className="text-xl font-bold text-white tracking-tight">SwiftLance</h2>}
        </div>
      </div>
      
      {/* Navigation: NavLink dyal Notification t-7eyed mn hna */}
      <nav className="flex flex-col flex-1 mt-4">
        <NavLink to="/app" end className={getStyle} title="Analytics">
          <LayoutDashboard size={20} /> {!isCollapsed && <span>Analytics</span>}
        </NavLink>
        
        <NavLink to="/app/note" className={getStyle} title="Notes">
          <StickyNote size={20} /> {!isCollapsed && <span>Notes</span>}
        </NavLink>

        <NavLink to="/app/tasks" className={getStyle} title="Tasks">
          <CheckSquare size={20} /> {!isCollapsed && <span>Tasks</span>}
        </NavLink>

        <NavLink to="/app/paiment" className={getStyle} title="Payment">
          <Wallet size={20} /> {!isCollapsed && <span>Payment</span>}
        </NavLink>

        <NavLink to="/app/planning" className={getStyle} title="Planning">
          <Calendar size={20} /> {!isCollapsed && <span>Planning</span>}
        </NavLink>

        <NavLink to="/app/clients" className={getStyle} title="Customers">
          <Users size={20} /> {!isCollapsed && <span>Customers</span>}
        </NavLink>

        <NavLink to="/app/projects" className={getStyle} title="Projects">
          <Briefcase size={20} /> {!isCollapsed && <span>Projects</span>}
        </NavLink>
      </nav>

      {/* Footer Section */}
      <div className={`pt-6 border-t border-white/5 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button onClick={() => navigate('/login')} className={styles.logoutBtn}>
           <LogOut size={20} /> {!isCollapsed && <span>Se déconnecter</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;