import React, { useState, useEffect } from "react";
// Importation des icônes depuis la bibliothèque lucide-react pour habiller le formulaire
import { User, Mail, Briefcase, CheckCircle, AlertCircle } from "lucide-react";

export default function Settings() {
  // 1. ÉTAT (STATE) : Stocke les valeurs saisies dans le formulaire (Nom, Email, Rôle)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "developer", // "developer" est la valeur choisie par défaut
  });

  // 2. ÉTATS (STATES) : Gèrent l'affichage et le comportement de l'interface
  const [loading, setLoading] = useState(false); // Bloque le bouton et change son texte pendant l'envoi
  const [message, setMessage] = useState("");   // Stocke le texte du message de notification (Succès ou Erreur)
  const [isError, setIsError] = useState(false);  // Indique si le message est une erreur (pour changer la couleur en rouge)

  // 3. EFFET AU MONTAGE (Exécuté uniquement à l'ouverture de la page)
  useEffect(() => {
    // Récupération des données de l'utilisateur stockées dans le navigateur (Local Storage)
    const savedName = localStorage.getItem("userName") || "";
    const savedEmail = localStorage.getItem("userEmail") || "";
    const savedRole = localStorage.getItem("userRole") || "developer";

    // Remplissage automatique du formulaire avec les données récupérées
    setFormData({
      fullName: savedName,
      email: savedEmail,
      role: savedRole,
    });
  }, []); // Le tableau de dépendances vide [] fait que l'effet ne s'exécute qu'une seule fois

  // 4. FONCTION : S'exécute à chaque fois que l'utilisateur écrit un caractère dans un champ
  const handleChange = (e) => {
    setFormData({
      ...formData, // On garde intactes les autres données du formulaire
      [e.target.name]: e.target.value, // On met à jour uniquement le champ qui est en train de changer
    });
  };

  // 5. FONCTION : Déclenchée lors du clic sur le bouton "Save Changes" (Soumission)
  const handleUpdateProfile = async (e) => {
    e.preventDefault(); // Empêche le rechargement automatique de la page
    setLoading(true);     // Active l'état de chargement (le bouton affichera "Saving changes...")
    setMessage("");      // Efface les anciens messages de l'écran
    setIsError(false);   // Réinitialise l'état d'erreur

    try {
      // Récupération du jeton de sécurité (Token) pour prouver au serveur qu'on est connecté
      const token = localStorage.getItem("token");

      // Envoi de la requête HTTP PUT vers l'API Backend pour modifier le profil
      const response = await fetch(
        "http://localhost:5000/api/users/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Envoi du token dans les en-têtes
          },
          body: JSON.stringify({ // Transformation de l'objet JavaScript en texte JSON pour le réseau
            fullName: formData.fullName,
            email: formData.email,
            role: formData.role,
          }),
        }
      );

      const data = await response.json(); // Transformation de la réponse texte du serveur en objet JS

      // CAS D'ERREUR : Si le serveur renvoie un problème (ex: email déjà utilisé)
      if (!response.ok) {
        setMessage(data.message || "Update failed"); // Affiche le message d'erreur du serveur
        setIsError(true);                            // Change la couleur de l'alerte en rouge
        setLoading(false);                           // Arrête le chargement du bouton
        return;                                      // Arrête immédiatement la fonction ici
      }

      // CAS DE SUCCÈS : Si le serveur confirme que la modification est enregistrée
      // On met à jour les nouvelles données dans le Local Storage du navigateur
      localStorage.setItem("userName", data.fullName);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userRole", data.role || "developer");

      setMessage("Profile updated successfully ✅"); // Message de confirmation vert
      window.location.reload();                      // Recharge la page pour actualiser le site (ex: le nom dans la barre de navigation)
    } catch (error) {
      // En cas de coupure internet ou si le serveur est complètement éteint
      setMessage("Server error ❌");
      setIsError(true);
    }

    setLoading(false); // Désactive le chargement à la fin de l'action
  };

  return (
    <div className="min-h-screen bg-white font-sans pb-16 pt-12">
      <div className="w-full max-w-2xl px-12 mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          
          {/* Section d'en-tête (Titre et description de la page) */}
          <div className="mb-8">
            <h1 className="text-2xl font-[900] text-[#1B2559] tracking-tight">
              Profile Settings
            </h1>
            <p className="text-[#A3AED0] font-medium text-sm">
              Manage your personal information and account options.
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            
            {/* Section Avatar (Prend la première lettre du nom pour créer une image de profil) */}
            <div className="flex flex-col items-center justify-center pb-4 border-b border-slate-100">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-50 shadow-sm">
                <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-black">
                  {formData.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </div>
            </div>

            {/* Champ : Nom Complet */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange} // Applique la fonction de suivi de saisie
                  placeholder="Enter your full name"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all text-sm text-slate-900 font-semibold placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Champ : Adresse Email */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange} // Applique la fonction de suivi de saisie
                  placeholder="Enter your email"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all text-sm text-slate-900 font-semibold placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Champ : Rôle Professionnel (Menu déroulant) */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Professional Role
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange} // Applique la fonction de suivi de saisie
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all text-sm text-slate-900 font-semibold"
                >
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="project_manager">Project Manager</option>
                  <option value="marketer">Marketer</option>
                  <option value="agency_owner">Agency Owner</option>
                </select>
              </div>
            </div>

            {/* Affichage conditionnel des Alertes (S'affiche uniquement s'il y a un message) */}
            {message && (
              <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${
                isError ? "bg-red-50 text-red-900 border border-red-100" : "bg-emerald-50 text-emerald-900 border border-emerald-100"
              }`}>
                {/* Icône dynamique : Alerte si erreur, coche de validation si succès */}
                {isError ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                <span>{message}</span>
              </div>
            )}

            {/* Bouton de validation */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading} // Désactive le bouton pendant le chargement pour éviter les doubles clics
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-xl font-bold shadow-sm active:scale-[0.99] transition-all text-sm flex items-center justify-center gap-2"
              >
                {/* Le texte du bouton s'adapte dynamiquement selon l'état "loading" */}
                {loading ? "Saving changes..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}