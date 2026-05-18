import React, { useEffect, useState } from 'react';
// Importation des icônes depuis la bibliothèque lucide-react
import { Trash2, Edit, UserPlus, Building2, User, X, Search } from 'lucide-react';

export default function Clients() {
  // --- ÉTATS (STATES) POUR LA GESTION DES DONNÉES ET DE L'INTERFACE ---
  
  // Stocke la liste des clients récupérés depuis le backend (Initialisé à tableau vide)
  const [clients, setClients] = useState([]);
  
  // Gère l'affichage de l'animation de chargement (Spinner)
  const [loading, setLoading] = useState(true);
  
  // Contrôle l'ouverture et la fermeture de la boîte de dialogue (Modal d'ajout/modification)
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Désactive le bouton de validation pendant l'envoi des données au serveur
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Stocke le client sélectionné pour modification (null = Ajout, objet client = Modification)
  const [editingClient, setEditingClient] = useState(null); 
  
  // Stocke le texte saisi par l'utilisateur dans la barre de recherche
  const [searchTerm, setSearchTerm] = useState("");

  // Stocke temporairement les valeurs des champs du formulaire
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    type: 'Individual' // Valeur par défaut
  });

  // --- FONCTION POUR RÉCUPÉRER LES CLIENTS (READ) ---
  const fetchClients = async () => {
    try {
      // Récupération du jeton de sécurité stocké dans le navigateur après authentification
      const token = localStorage.getItem('token');
      
      // Envoi d'une requête HTTP GET asynchrone vers l'API Backend
      const res = await fetch('http://localhost:5000/api/clients', {
        headers: { 
          // Envoi du token pour prouver que l'utilisateur est connecté et autorisé
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Si le serveur répond avec un statut 200 (OK), on met à jour l'état "clients"
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (err) {
      console.error("Error fetching clients:", err);
    } finally {
      // Arrêt immédiat de l'affichage du chargement (Spinner), même en cas d'erreur
      setLoading(false);
    }
  };

  // --- CYCLE DE VIE : EFFET AU MONTAGE (COMPONENT DID MOUNT) ---
  useEffect(() => {
    // S'exécute uniquement au premier affichage de la page grâce au tableau de dépendances vide []
    fetchClients();
  }, []);

  // --- PRÉPARATION DE LA MODIFICATION (UPDATE - ÉTAPE 1) ---
  const handleEditClick = (client) => {
    // Passage en mode édition en stockant le client sélectionné
    setEditingClient(client);
    
    // Remplissage automatique des champs du formulaire avec les données existantes du client
    setFormData({
      fullName: client.fullName || client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      type: client.type || 'Individual'
    });
    
    // Ouverture de la modal pour afficher le formulaire pré-rempli
    setIsModalOpen(true);
  };

  // --- GESTION DE LA SOUMISSION : AJOUT OU MODIFICATION (CREATE / UPDATE - ÉTAPE 2) ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement automatique de la page
    setIsSubmitting(true); // Active l'état de chargement sur le bouton
    
    try {
      const token = localStorage.getItem('token');
      
      const url = editingClient 
        ? `http://localhost:5000/api/clients/${editingClient._id}` 
        : 'http://localhost:5000/api/clients';
      
      const method = editingClient ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsModalOpen(false); // Fermeture de la modal
        setEditingClient(null); // Réinitialisation du mode édition
        // Reset complet des champs du formulaire
        setFormData({ fullName: '', email: '', phone: '', address: '', type: 'Individual' });
        fetchClients(); // Rafraîchissement en temps réel de la liste des clients
      } else {
        const errorData = await response.json();
        alert("Error: " + (errorData.message || "Action impossible"));
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setIsSubmitting(false); 
    }
  };

  // --- SUPPRESSION D'UN CLIENT (DELETE) ---
  const deleteClient = async (id) => {
    // Alerte de confirmation de sécurité native du navigateur
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    
    try {
      const token = localStorage.getItem('token');
      // Envoi d'une requête HTTP avec la méthode DELETE ciblant l'ID du client
      const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) fetchClients(); // Rechargement de la table si suppression réussie
    } catch (err) {
      alert("Error during deletion");
    }
  };

  // --- FILTRAGE DES DONNÉES EN FRONTEND (Moteur de recherche local) ---
  const filteredClients = clients.filter(c => 
    // Recherche insensible à la casse (Majuscules/Minuscules ignorées grâce à toLowerCase)
    (c.fullName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- RENDU : ÉCRAN DE CHARGEMENT ---
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      {/* Spinner animé en CSS avec Tailwind (animate-spin) */}
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
    </div>
  );

  // --- RENDU PRINCIPAL DE L'INTERFACE CLIENTS ---
  return (
    <div className="min-h-screen bg-white font-sans pb-16 pt-12">
      
      {/* ACTION BAR : Barre supérieure contenant la recherche et le bouton d'ajout */}
      <div className="w-full px-12 mx-auto mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          {/* Input de recherche : Met à jour l'état "searchTerm" à chaque lettre tapée */}
          <input 
            type="text" 
            placeholder="Search clients..." 
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all text-sm text-slate-900 font-semibold placeholder:text-slate-400"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => {
            setEditingClient(null);
            setFormData({ fullName: '', email: '', phone: '', address: '', type: 'Individual' });
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto bg-[#4f46e5] hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all text-sm"
        >
          <UserPlus size={16} /> Add Client
        </button>
      </div>

      {/* TABLEAU DES CLIENTS */}
      <div className="w-full px-12 mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200">
                  <th className="px-8 py-5 text-[11px] font-extrabold uppercase text-[#334155] tracking-widest">Client Name</th>
                  <th className="px-8 py-5 text-[11px] font-extrabold uppercase text-[#334155] tracking-widest">Type</th>
                  <th className="px-8 py-5 text-[11px] font-extrabold uppercase text-[#334155] tracking-widest">Contact</th>
                  <th className="px-8 py-5 text-[11px] font-extrabold uppercase text-[#334155] tracking-widest text-center">Address</th>
                  <th className="px-8 py-5 text-[11px] font-extrabold uppercase text-[#334155] tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-16 text-center text-sm font-bold text-slate-400">
                      No clients found
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client._id} className="hover:bg-slate-50/50 transition-colors h-16">
                      
                      <td className="px-8 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-center text-indigo-600">
                         
                            {client.type === 'Company' ? <Building2 size={14} /> : <User size={14} />}
                          </div>
                          <span className="font-extrabold text-slate-900 text-sm">{client.fullName || client.name}</span>
                        </div>
                      </td>

                      <td className="px-8 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-extrabold rounded-md border uppercase tracking-wider ${
                          client.type === 'Company' 
                            ? 'bg-purple-50 text-purple-700 border-purple-200' 
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {client.type || "Individual"}
                        </span>
                      </td>

                      {/* Colonne 3 : Infos de contact (Email et Téléphone) */}
                      <td className="px-8 py-4 whitespace-nowrap text-sm">
                        <div className="text-slate-800 font-semibold">{client.email}</div>
                        <div className="text-slate-500 text-xs font-medium">{client.phone || "No phone"}</div>
                      </td>

                      {/* Colonne 4 : Adresse géographique */}
                      <td className="px-8 py-4 whitespace-nowrap text-center text-sm font-semibold text-slate-700">
                        <span className="italic">{client.address || "---"}</span>
                      </td>

                      {/* Colonne 5 : Boutons d'actions rapides (Edit et Delete) */}
                      <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-4 text-slate-500">
                          <button 
                            onClick={() => handleEditClick(client)}
                            className="hover:text-indigo-600 transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => deleteClient(client._id)}
                            className="hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* COMPOSANT MODAL : Fenêtre flottante (Formulaire d'ajout / édition) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative border border-slate-200">
            {/* Bouton de fermeture en forme de croix 'X' */}
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <X size={18} />
            </button>
            
            {/* Titre dynamique selon l'action en cours */}
            <h3 className="text-base font-black text-slate-900 mb-5">
              {editingClient ? 'Edit Client' : 'New Client Info'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Champ : Full Name */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1 ml-1">Full Name</label>
                <input 
                  type="text" required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-semibold bg-white focus:outline-none focus:border-indigo-500 transition-all"
                  value={formData.fullName}
                  // Spread Operator (...) pour garder intactes les autres clés de l'état formData
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>

              {/* Champ : Email */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1 ml-1">Email Address</label>
                <input 
                  type="email" required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-semibold bg-white focus:outline-none focus:border-indigo-500 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1 ml-1">Client Type</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white font-semibold focus:outline-none focus:border-indigo-500 transition-all"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Individual">Individual</option>
                  <option value="Company">Company</option>
                </select>
              </div>

              {/* Ligne double : Téléphone et Adresse côte à côte */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1 ml-1">Phone</label>
                  <input 
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-semibold bg-white focus:outline-none focus:border-indigo-500 transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1 ml-1">City/Address</label>
                  <input 
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-semibold bg-white focus:outline-none focus:border-indigo-500 transition-all"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              {/* Boutons d'action du bas de formulaire */}
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-all border border-slate-200">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} // Désactive le bouton si l'envoi est en cours
                  className="flex-1 py-2.5 bg-[#4f46e5] hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-sm transition-all disabled:bg-slate-300"
                >
                  {/* Texte dynamique du bouton de validation selon l'état actuel */}
                  {isSubmitting ? "Saving..." : (editingClient ? "Update" : "Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}