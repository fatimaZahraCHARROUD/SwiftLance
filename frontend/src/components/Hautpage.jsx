import React, { useEffect, useState } from 'react';
// Importation des icônes depuis la bibliothèque 'lucide-react'
import { Settings, Bell } from 'lucide-react';
// Importation du composant Link pour la navigation sans recharger la page
import { Link } from 'react-router-dom';

function Hautpage() {
  // 1. ÉTAT (STATE) : Stocke les informations de l'utilisateur connecté (Nom, Email, Rôle)
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    role: "developer",
  });

  // 2. ÉTAT (STATE) : Stocke le nombre de projets urgents pour l'icône de notification (badge rouge)
  const [notificationCount, setNotificationCount] = useState(0);

  // 3. EFFET AU MONTAGE (Se lance uniquement à l'ouverture de la page)
  useEffect(() => {
    // Étape A : Récupération des informations de l'utilisateur enregistrées dans le navigateur
    const savedName = localStorage.getItem("userName") || "";
    const savedEmail = localStorage.getItem("userEmail") || "";
    const savedRole = localStorage.getItem("userRole") || "developer";

    // Mise à jour de l'état avec les données récupérées du Local Storage
    setUserData({
      fullName: savedName,
      email: savedEmail,
      role: savedRole,
    });

    // Étape B : Fonction interne pour récupérer les projets et compter ceux qui sont urgents
    const fetchUrgentCount = async () => {
      try {
        // Appel API vers le backend pour récupérer la liste complète des projets
        const response = await fetch('http://localhost:5000/api/projects', {
          // Envoi du token d'authentification dans les en-têtes (Headers)
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const projects = await response.json(); // Conversion de la réponse en objet JSON

        // Récupération de la date du jour ajustée à minuit (00:00:00) pour un calcul de jours précis
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        // FILTRAGE : On trie les projets pour ne garder que ceux qui arrivent à échéance sous 2 jours
        const urgentOnes = projects.filter(project => {
          
          // 1. Vérification du statut : Si le projet est terminé (Done ou Completed), on ne le compte pas
          const currentStatus = project.status ? project.status.toLowerCase().trim() : '';
          if (currentStatus === 'done' || currentStatus === 'completed') {
            return false; 
          }

          // 2. Récupération de la date de fin (prend en compte la clé "deadline" ou "endDate" selon la base de données)
          const projectDeadline = project.deadline || project.endDate;
          if (!projectDeadline) return false; // S'il n'y a pas de date, on ignore le projet

          // Conversion de la date limite à minuit
          const pDate = new Date(projectDeadline);
          const pDay = new Date(pDate.getFullYear(), pDate.getMonth(), pDate.getDate()).getTime();
          
          // Calcul de la différence en jours entre la date limite et aujourd'hui
          const diffDays = Math.floor((pDay - today) / (1000 * 60 * 60 * 24));
          
          // Le projet est gardé uniquement s'il reste entre 0 et 2 jours (les projets déjà dépassés sont exclus)
          return diffDays >= 0 && diffDays <= 2; 
        });

        // Mise à jour du compteur avec le nombre de projets filtrés trouvés
        setNotificationCount(urgentOnes.length);
      } catch (err) {
        console.error("Error fetching notification count", err); // Affichage d'une erreur si l'API échoue
      }
    };

    fetchUrgentCount(); // Déclenchement de la fonction de récupération
  }, []); // Exécution unique au chargement grâce au tableau de dépendances vide []

  // 4. RENDU VISUEL (INTERFACE UTILISATEUR)
  return (
    <div className="h-20 bg-[#ffffff] flex items-center justify-between px-8">

      {/* Espaceur vide à gauche pour pousser le reste du contenu à droite grâce au justify-between */}
      <div></div>

      {/* Conteneur de droite (Notifications, Paramètres et Profil) */}
      <div className="flex items-center gap-3">

        {/* --- Icône de Cloche avec son compteur rouge --- */}
        <Link
          to="/app/notification"
          className="relative p-2.5 bg-[#1a1c26] border border-white/5 rounded-full text-gray-400 hover:text-white transition"
        >
          <Bell size={20} />
          
          {/* Rendu conditionnel : Le badge rouge s'affiche uniquement si le compteur est supérieur à 0 */}
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white border-2 border-white">
              {notificationCount}
            </span>
          )}
        </Link>

        {/* --- Icône des Paramètres (Settings) --- */}
        <Link
          to="/app/settings"
          className="p-2.5 bg-[#1a1c26] border border-white/5 rounded-full text-gray-400 hover:text-white transition"
        >
          <Settings size={20} />
        </Link>

        {/* --- Encadré des Informations du Profil --- */}
        <div className="flex items-center gap-3 ml-2 bg-[#1a1c26] border border-white/5 p-1 pr-4 rounded-full">
          {/* Bulle Avatar : Prend la première lettre du nom en majuscule, ou "U" par défaut */}
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-sm text-white">
            {userData.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {/* Textes : Nom complet et Adresse Email de l'utilisateur */}
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