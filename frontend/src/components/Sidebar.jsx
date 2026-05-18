import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom"; 
import styles from './Sidebar.module.css';
import {
  LayoutDashboard, StickyNote, CheckSquare,
  Wallet, Calendar, Users, Briefcase,
  LogOut, ChevronLeft, ChevronRight,
  Folder
} from 'lucide-react';

function Sidebar({ isCollapsed, setIsCollapsed }) {  
  const navigate = useNavigate();
 
  const getStyle = ({ isActive }) => {
    let base = styles.link; 
    if (isActive) base += ` ${styles.active}`; 
    if (isCollapsed) base += ` ${styles.collapsedLink}`; 
    return base;
  };

  // 2. FONCTION : Gère la déconnexion de l'utilisateur
  const logout = () => {
    localStorage.removeItem("token"); // Supprime le jeton de sécurité du navigateur
    navigate('/');                     // Redirige l'utilisateur vers la page de connexion/accueil
  }

  return (
    // Conteneur principal : applique une classe différente si la barre est repliée (isCollapsed)
    <div className={`${styles.sidebarContainer} ${isCollapsed ? styles.collapsedSidebar : ''}`}>
      
      {/* Bouton de bascule : Permet d'ouvrir ou de fermer la Sidebar au clic */}
      <button 
        className={styles.toggleBtn} 
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {/* L'icône flèche change de sens selon l'état d'ouverture */}
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* SECTION EN-TÊTE : Affiche le Logo et le nom de l'application */}
      <div className={styles.headerSection}>
        <div className="flex items-center gap-3">
          {/* Le carré bleu avec la lettre "S" (Logo de SwiftLance) */}
          <div className="min-w-[35px] h-[35px] bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            S
          </div>
          {/* Le texte "SwiftLance" ne s'affiche que si la barre n'est pas repliée */}
          {!isCollapsed && <h2 className="text-xl font-bold text-white tracking-tight">SwiftLance</h2>}
        </div>
      </div>
      
      {/* SECTION NAVIGATION : Liste de tous les liens vers les différentes pages */}
      <nav className="flex flex-col flex-1 mt-4 overflow-y-auto">        
        {/* Lien : Analytics (Tableau de bord) */}
        <NavLink to="/app" end className={getStyle} title="Analytics">
          <LayoutDashboard size={20} /> {!isCollapsed && <span>Analytics</span>}
        </NavLink>
        
        {/* Lien : Notes */}
        <NavLink to="/app/note" className={getStyle} title="Notes">
          <StickyNote size={20} /> {!isCollapsed && <span>Notes</span>}
        </NavLink>

        {/* Lien : Tasks (Tâches) */}
        <NavLink to="/app/tasks" className={getStyle} title="Tasks">
          <CheckSquare size={20} /> {!isCollapsed && <span>Tasks</span>}
        </NavLink>

        {/* Lien : Payment (Paiements) */}
        <NavLink to="/app/paiment" className={getStyle} title="Payment">
          <Wallet size={20} /> {!isCollapsed && <span>Payment</span>}
        </NavLink>

        {/* Lien : Planning (Calendrier) */}
        <NavLink to="/app/planning" className={getStyle} title="Planning">
          <Calendar size={20} /> {!isCollapsed && <span>Planning</span>}
        </NavLink>

        {/* Lien : Customers (Clients) */}
        <NavLink to="/app/clients" className={getStyle} title="Customers">
          <Users size={20} /> {!isCollapsed && <span>Customers</span>}
        </NavLink>

        {/* Lien : Projects (Projets) */}
        <NavLink to="/app/projects" className={getStyle} title="Projects">
          <Briefcase size={20} /> {!isCollapsed && <span>Projects</span>}
        </NavLink>

        {/* Lien : Files (Fichiers) */}
        <NavLink to="/app/files" className={getStyle} title="Files">
          <Folder size={20} /> {!isCollapsed && <span>Files</span>}
        </NavLink>
      </nav>

      {/* SECTION PIED DE PAGE : Bouton de déconnexion */}
      <div className={`pt-6 border-t border-white/5 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button onClick={logout} className={styles.logoutBtn}>
           <LogOut size={20} /> {/* Le texte disparait si la barre est repliée pour ne laisser que l'icône */}
           {!isCollapsed && <span>Se déconnecter</span>}
        </button>
      </div>

    </div>
  );
}

export default Sidebar;