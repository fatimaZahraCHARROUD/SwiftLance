import React, { useEffect, useState } from 'react';
// Importation des icônes depuis lucide-react pour illustrer l'interface
import { 
  Plus,          // Icône "+" : Utilisée pour le bouton de création d'une nouvelle tâche ("Add a task").
  Calendar,      // Icône "Calendrier" : Affichée à côté de la date limite (Due Date) dans le tableau.
  CheckCircle2,  // Icône "Coche cochée" : S'affiche en vert quand une tâche a le statut 'done' (terminée).
  Trash2,        // Icône "Poubelle" : Placée dans la colonne Actions pour supprimer définitivement une tâche.
  Edit3,         // Icône "Crayon" : Placée dans la colonne Actions pour ouvrir la modale en mode modification.
  Search,        // Icône "Loupe" : Positionnée à l'intérieur de la barre de recherche en haut à gauche.
  Circle,        // Icône "Rond vide" : S'affiche à côté des tâches en attente ('todo') pour pouvoir les cocher.
  X,             // Icône "Croix" : Bouton de fermeture situé en haut à droite de la boîte de dialogue (Popup).
  Clock          // Icône "Horloge" : Affichée à côté du nombre d'heures estimées ("Estimated Hours").
} from 'lucide-react';

export default function Tasks() {
  // --- ÉTATS (STATES) ---
  const [tasks, setTasks] = useState([]); // Liste globale des tâches récupérées du serveur
  const [projects, setProjects] = useState([]); // Liste des projets pour lier une tâche à un projet
  const [loading, setLoading] = useState(true); // Indicateur de chargement initial
  const [isModalOpen, setIsModalOpen] = useState(false); // Contrôle de l'affichage de la boîte de dialogue (Popup)
  const [searchTerm, setSearchTerm] = useState(""); // Chaîne de caractères tapée dans la barre de recherche
  const [editingTask, setEditingTask] = useState(null); // Stocke la tâche en cours de modification (null si création)

  // État du formulaire contenant les champs nécessaires pour créer/modifier une tâche
  const [formData, setFormData] = useState({
    title: '', projectId: '', status: 'todo', priority: 'medium', dueDate: '', estimatedHours: 0
  });

  // --- ACTIONS API (FONCTIONS ASYNCHRONES) ---

  // 1. Récupération des données (Tâches et Projets) simultanément depuis le serveur
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Promise.all exécute les deux requêtes en parallèle pour gagner du temps
      const [resTasks, resProjects] = await Promise.all([
        fetch('http://localhost:5000/api/tasks', { headers }),
        fetch('http://localhost:5000/api/projects', { headers })
      ]);

      if (resTasks.ok && resProjects.ok) {
        setTasks(await resTasks.json());
        setProjects(await resProjects.json());
      }
    } catch (err) {
      console.error("Loading error:", err);
    } finally {
      setLoading(false); // Fin du chargement, l'écran principal peut s'afficher
    }
  };

  // Chargement automatique des données au montage du composant
  useEffect(() => { fetchData(); }, []);

  // 2. Soumission du formulaire (Ajout ou Modification d'une tâche)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page HTML
    const token = localStorage.getItem('token');
    
    // Si editingTask existe, on modifie via PUT, sinon on crée via POST
    const url = editingTask 
      ? `http://localhost:5000/api/tasks/${editingTask._id}` 
      : 'http://localhost:5000/api/tasks';
    
    const method = editingTask ? 'PUT' : 'POST';
    
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // Transformation des données du formulaire en texte JSON
      });

      if (response.ok) {
        setIsModalOpen(false); // Ferme la boîte de dialogue
        setEditingTask(null); // Réinitialise le mode édition
        // Remise à zéro complète du formulaire
        setFormData({ title: '', projectId: '', status: 'todo', priority: 'medium', dueDate: '', estimatedHours: 0 });
        fetchData(); // Rafraîchit le tableau avec la nouvelle liste
      } else {
        const errorData = await response.json();
        alert("Error: " + (errorData.message || "Unable to save task"));
      }
    } catch (err) {
      alert("Network error: Unable to connect to the server");
    }
  };

  // 3. Inversion rapide du statut d'une tâche (A faire <-> Terminé) au clic sur le rond
  const toggleTaskStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = currentStatus === 'done' ? 'todo' : 'done';
      const taskToUpdate = tasks.find(t => t._id === id);
      
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          ...taskToUpdate, 
          status: newStatus,
          // Extraction propre de l'identifiant du projet pour éviter les bugs d'objets imbriqués
          projectId: taskToUpdate.projectId?._id || taskToUpdate.projectId
        })
      });
      if (response.ok) fetchData(); // Rafraîchissement automatique
    } catch (err) {
      alert("Error updating status");
    }
  };

  // 4. Suppression définitive d'une tâche après confirmation
  const deleteTask = async (id) => {
    if(!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchData();
      else alert("Error deleting task");
    } catch (err) {
      alert("Network error");
    }
  };

  // 5. Préparation de la boîte de dialogue pour la modification (Remplissage des champs)
  const handleEditClick = (task) => {
    setEditingTask(task); // Enregistre la tâche ciblée
    setFormData({
      title: task.title,
      projectId: task.projectId?._id || task.projectId || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '', // Formatage propre pour le champ de type calendrier HTML
      estimatedHours: task.estimatedHours || 0
    });
    setIsModalOpen(true); // Ouvre la boîte de dialogue contenant ces infos
  };

  // --- FILTRAGE ET STYLES DYNAMIQUES ---

  // Filtrage en temps réel des tâches selon les caractères saisis dans la barre de recherche
  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Attribution des couleurs Tailwind en fonction du niveau d'urgence/priorité
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-900 border-red-200';
      case 'medium': return 'bg-amber-50 text-amber-900 border-amber-200';
      default: return 'bg-slate-100 text-slate-900 border-slate-200';
    }
  };

  // Rendu de l'écran d'attente (Spinner) pendant le chargement des données depuis l'API
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
       <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
    </div>
  );

  // --- RENDU VISUEL DE L'INTERFACE PRINCIPALE ---
  return (
    <div className="min-h-screen bg-white font-sans pb-16 pt-12">
      
      {/* --- Barre d'actions supérieure (Recherche et Bouton Ajouter) --- */}
      <div className="w-full px-12 mx-auto mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Champ de recherche de tâches */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all text-sm text-slate-900 font-medium placeholder:text-slate-400"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Bouton pour ouvrir la boîte de dialogue en mode création */}
        <button 
          onClick={() => { setEditingTask(null); setFormData({ title: '', projectId: '', status: 'todo', priority: 'medium', dueDate: '', estimatedHours: 0 }); setIsModalOpen(true); }}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all text-sm"
        >
          <Plus size={18} /> Add a task
        </button>
      </div>

      {/* --- Conteneur du Tableau Principal des Tâches --- */}
      <div className="w-full px-12 mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-8 py-4 text-[11px] font-extrabold uppercase text-slate-600 tracking-widest">Status / Task</th>
                  <th className="px-8 py-4 text-[11px] font-extrabold uppercase text-slate-600 tracking-widest">Project</th>
                  <th className="px-8 py-4 text-[11px] font-extrabold uppercase text-slate-600 tracking-widest">Priority</th>
                  <th className="px-8 py-4 text-[11px] font-extrabold uppercase text-slate-600 tracking-widest">Due Date</th>
                  <th className="px-8 py-4 text-[11px] font-extrabold uppercase text-slate-600 tracking-widest">Time</th>
                  <th className="px-8 py-4 text-[11px] font-extrabold uppercase text-slate-600 tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {/* Condition : Si aucune tâche ne correspond à la recherche */}
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-16 text-center text-sm text-slate-500 font-medium italic">
                      No tasks found
                    </td>
                  </tr>
                ) : (
                  // Boucle d'affichage pour chaque tâche filtrée
                  filteredTasks.map(task => (
                    <tr key={task._id} className={`hover:bg-slate-50/50 transition-colors h-20 ${task.status === 'done' ? 'bg-slate-50/40 opacity-75' : ''}`}>
                      
                      {/* Colonne : Statut (Bouton rond) + Titre de la tâche */}
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => toggleTaskStatus(task._id, task.status)}
                            className={`transition-all transform active:scale-75 ${task.status === 'done' ? 'text-green-600' : 'text-slate-400 hover:text-indigo-600'}`}
                          >
                            {/* L'icône change (Coche verte ou Rond vide) selon le statut */}
                            {task.status === 'done' ? <CheckCircle2 size={22} strokeWidth={2.5} /> : <Circle size={22} strokeWidth={2.5} />}
                          </button>
                          {/* Si la tâche est validée, le texte est barré et estompé (`line-through`) */}
                          <span className={`font-extrabold text-slate-900 text-[14px] ${task.status === 'done' ? 'line-through text-slate-400 font-semibold' : ''}`}>
                            {task.title}
                          </span>
                        </div>
                      </td>

                      {/* Colonne : Projet associé (Recherche du nom de projet par ID, affiche "General" si aucun) */}
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-900 text-[11px] font-extrabold rounded-md border border-blue-200 uppercase tracking-wider">
                          {projects.find(p => p._id === (task.projectId?._id || task.projectId))?.title || "General"}
                        </span>
                      </td>

                      {/* Colonne : Niveau de priorité avec badge de couleur dynamique */}
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-extrabold rounded-md border uppercase tracking-wider ${getPriorityStyle(task.priority)}`}>
                          {task.priority === 'high' ? 'High' : task.priority === 'medium' ? 'Medium' : 'Low'}
                        </span>
                      </td>

                      {/* Colonne : Date d'échéance formatée au standard américain */}
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-slate-800 text-sm flex items-center gap-1.5 font-bold">
                          <Calendar size={14} className="text-slate-500" strokeWidth={2.5} />
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US') : '--/--/----'}
                        </div>
                      </td>

                      {/* Colonne : Temps estimé en heures */}
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-slate-800 text-sm flex items-center gap-1.5 font-bold">
                          <Clock size={14} className="text-slate-500" strokeWidth={2.5} />
                          {task.estimatedHours ? `${task.estimatedHours}h` : '0h'}
                        </div>
                      </td>

                      {/* Colonne : Boutons d'actions de gestion (Éditer / Supprimer) */}
                      <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEditClick(task)} 
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit3 size={16} strokeWidth={2.5} />
                          </button>
                          <button 
                            onClick={() => deleteTask(task._id)} 
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={16} strokeWidth={2.5} />
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

      {/* --- BOÎTE DE DIALOGUE MODALE (Popup pour Ajout / Modification) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl relative border border-slate-200">
            {/* Bouton de fermeture de la modale en haut à droite */}
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <X size={18} strokeWidth={2.5}/>
            </button>
            {/* Titre dynamique adapté selon le mode choisi (Création ou Édition) */}
            <h3 className="text-lg font-black text-slate-900 mb-5">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h3>
            
            {/* Formulaire de saisie des données de la tâche */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Champ : Titre de la tâche */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Task Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Integrate Figma Design" 
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              {/* Ligne : Sélection du projet lié et choix de la priorité */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Linked Project</label>
                  <select 
                    required 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    value={formData.projectId} 
                    onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                  >
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Priority</label>
                  <select 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    value={formData.priority} 
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Ligne : Date d'échéance de rendu et temps de travail estimé */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Due Date</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    value={formData.dueDate} 
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Estimated Hours</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    value={formData.estimatedHours} 
                    onChange={(e) => setFormData({...formData, estimatedHours: e.target.value})}
                  />
                </div>
              </div>

              {/* Boutons inférieurs de validation de la modale */}
              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 rounded-lg text-sm font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  {editingTask ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}