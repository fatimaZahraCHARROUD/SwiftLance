import React, { useState, useEffect } from 'react';
// Importation des icônes depuis la bibliothèque 'lucide-react'
import { Clock, Calendar } from 'lucide-react';

export default function SwiftLanceDeadlines() {
    // 1. LES ÉTATS (STATES)
    const [urgentProjects, setUrgentProjects] = useState([]); // Tableau contenant les projets qui se terminent bientôt
    const [loading, setLoading] = useState(true);        // État de chargement de la page (activé par défaut)

    // 2. EFFET AU MONTAGE (Se lance uniquement à l'ouverture de la page)
    useEffect(() => {
        const fetchAndFilter = async () => {
            try {
                // Appel API pour récupérer tous les projets depuis le backend
                const response = await fetch('http://localhost:5000/api/projects', {
                    // Envoi du token d'authentification pour sécuriser la requête
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const data = await response.json(); // Conversion de la réponse brute du serveur en objet JSON
                
                // Récupération de la date d'aujourd'hui mise à minuit (00:00:00) pour un calcul précis des jours
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

                // FILTRAGE : On trie la liste des projets pour ne garder que ceux qui sont urgents
                const filtered = data.filter(project => {
                    
                    // Étape A : Exclure les projets déjà terminés
                    const currentStatus = project.status ? project.status.toLowerCase().trim() : '';
                    if (currentStatus === 'done' || currentStatus === 'completed') {
                        return false; // On l'ignore, pas besoin d'alerte s'il est fini
                    }

                    // Étape B : Vérifier s'il y a bien une date limite (deadline/endDate)
                    const projectDeadline = project.endDate;
                    if (!projectDeadline) return false; // S'il n'y a pas de date, on l'ignore
                    
                    // Étape C : Convertir la date du projet à minuit pour comparer équitablement avec 'today'
                    const pDate = new Date(projectDeadline);
                    const pDay = new Date(pDate.getFullYear(), pDate.getMonth(), pDate.getDate()).getTime();
                    
                    // Étape D : Calculer la différence de temps en millisecondes, puis la convertir en nombre de jours
                    const diffTime = pDay - today;
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                    // Étape E : Condition d'urgence (Le projet doit expirer aujourd'hui, demain ou après-demain : entre 0 et 2 jours)
                    return diffDays >= 0 && diffDays <= 2; 
                });

                setUrgentProjects(filtered); // On enregistre les projets filtrés dans l'état
                setLoading(false);            // Fin du chargement
            } catch (err) {
                console.error("Error:", err);  // Affichage d'une erreur en console si le serveur crash
                setLoading(false);
            }
        };
        fetchAndFilter();
    }, []); // Le tableau vide [] assure que l'API n'est appelée qu'une seule fois au chargement

    // 3. FONCTION COMPLÉMENTAIRE : Calcule précisément le texte et la couleur du badge à afficher
    const getRemainingInfo = (projectDate) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const pDate = new Date(projectDate);
        const pDay = new Date(pDate.getFullYear(), pDate.getMonth(), pDate.getDate()).getTime();
        
        const diffTime = pDay - today;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Si la différence est de 0 jour, c'est pour aujourd'hui (Alerte Rouge)
        if (diffDays === 0) return { label: 'Due Today', days: 0, color: 'red' };
        // Sinon, c'est pour très bientôt (Alerte Orange)
        return { label: 'Upcoming', days: diffDays, color: 'orange' };
    };

    // 4. RENDU VISUEL (INTERFACE UTILISATEUR)
    return (
        <div className="p-8 bg-white min-h-screen font-sans">
            
            {/* Section En-tête : Titre de la page et compteur de tâches urgentes */}
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-[#1e222d] tracking-tight">Critical Deadlines</h1>
                    <p className="text-gray-400 font-medium mt-2">Managing projects based on time priority (Less than 2 days).</p>
                </div>
                <div className="text-right pb-1">
                    <span className="text-3xl font-black text-gray-900">{urgentProjects.length}</span>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Urgent Tasks</p>
                </div>
            </header>

            {/* Conteneur principal des cartes ou des messages d'état */}
            <div className="grid gap-6">
                {/* Condition 1 : Si la page charge encore, afficher un texte d'attente */}
                {loading ? (
                    <div className="p-10 text-center text-gray-400 font-bold italic">Loading your deadlines...</div>
                ) : urgentProjects.length > 0 ? (
                    // Condition 2 : Si on a des projets urgents, on boucle dessus avec .map pour créer les cartes
                    urgentProjects.map((project) => {
                        const projectDeadline = project.deadline || project.endDate;
                        const info = getRemainingInfo(projectDeadline); // Extraction des infos de temps (Due Today / Jours restants)
                        const isDueToday = info.label === 'Due Today';  // Variable booléenne pour savoir si c'est pour aujourd'hui

                        return (
                            <div key={project._id} className="group bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                                {/* Barre colorée à gauche : Rouge si c'est pour aujourd'hui, Orange si c'est pour bientôt */}
                                <div className={`absolute top-0 left-0 h-full w-2 ${isDueToday ? 'bg-red-500' : 'bg-orange-400'}`}></div>
                                
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 ml-4">
                                    <div className="flex gap-5 items-start">
                                        {/* Icône d'horloge stylisée (clignote doucement si le projet est à rendre aujourd'hui) */}
                                        <div className={`p-4 rounded-2xl ${isDueToday ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                                            <Clock size={28} className={isDueToday ? "animate-pulse" : ""} />
                                        </div>
                                        <div>
                                            {/* Titre et description du projet */}
                                            <h3 className="font-extrabold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {project.title}
                                            </h3>
                                            <p className="text-sm text-gray-400 font-medium line-clamp-1">{project.description}</p>
                                            
                                            {/* Affichage de la date limite au format lisible (ex: DD/MM/YYYY) */}
                                            <div className="flex items-center gap-4 mt-3">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                                                    <Calendar size={14} className="text-blue-500" />
                                                    {projectDeadline ? new Date(projectDeadline).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Section droite de la carte : Affiche dynamiquement le temps restant et le statut actuel */}
                                    <div className="flex flex-col items-end gap-3">
                                        <p className={`text-lg font-black ${isDueToday ? 'text-red-500' : 'text-orange-500'}`}>
                                            {isDueToday ? 'Due Today' : `${info.days} Days Left`}
                                        </p>
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{project.status}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    // Condition 3 : Si aucun projet n'est urgent (Bravo ! Tout est sous contrôle)
                    <div className="bg-green-50 border border-green-100 p-12 rounded-[3rem] text-center">
                        <h2 className="text-2xl font-black text-green-800">All caught up!</h2>
                        <p className="text-green-600/70 font-medium mt-2">No projects are due within 2 days.</p>
                    </div>
                )}
            </div>
        </div>
    );
}