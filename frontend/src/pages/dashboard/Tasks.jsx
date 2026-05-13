import React, { useEffect, useState } from 'react';
import { 
  Plus, Calendar, CheckCircle2, Trash2, Edit3, Search, Circle, X, Target 
} from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState({
    title: '', projectId: '', status: 'todo', priority: 'medium', dueDate: '', estimatedHours: 0
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [resTasks, resProjects] = await Promise.all([
        fetch('http://localhost:5000/api/tasks', { headers }),
        fetch('http://localhost:5000/api/projects', { headers })
      ]);

      if (resTasks.ok && resProjects.ok) {
        setTasks(await resTasks.json());
        setProjects(await resProjects.json());
      }
    } catch (err) {
      console.error("Erreur de chargement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = editingTask 
      ? `http://localhost:5000/api/tasks/${editingTask._id}` 
      : 'http://localhost:5000/api/tasks';
    
    // UPDATED: Kheddamin b PUT f l-update kima f l-Backend
    const method = editingTask ? 'PUT' : 'POST';
    
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEditingTask(null);
        setFormData({ title: '', projectId: '', status: 'todo', priority: 'medium', dueDate: '', estimatedHours: 0 });
        fetchData();
      } else {
        const errorData = await response.json();
        alert("Erreur : " + (errorData.message || "Impossible d'enregistrer la tâche"));
      }
    } catch (err) {
      alert("Erreur réseau : Impossible de contacter le serveur");
    }
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = currentStatus === 'done' ? 'todo' : 'done';
      
      // Khassna n-chedu l-task kamla bach n-seftoha f l-PUT
      const taskToUpdate = tasks.find(t => t._id === id);
      
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT', // UPDATED: Beddelna PATCH b PUT
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        // F PUT, a7san t-sefti l-data kamla dyal l-task bach t-eviti machakil validation
        body: JSON.stringify({ 
          ...taskToUpdate, 
          status: newStatus,
          projectId: taskToUpdate.projectId?._id || taskToUpdate.projectId
        })
      });
      if (response.ok) fetchData();
    } catch (err) {
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const deleteTask = async (id) => {
    if(!window.confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchData();
      else alert("Erreur lors de la suppression");
    } catch (err) {
      alert("Erreur réseau");
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      projectId: task.projectId?._id || task.projectId || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      estimatedHours: task.estimatedHours || 0
    });
    setIsModalOpen(true);
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd]">
       <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfd] font-sans pb-12 pt-8">
      <div className="px-12 mb-10 flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" placeholder="Rechercher des tâches..." 
            className="w-full pl-16 pr-8 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 shadow-sm transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { setEditingTask(null); setFormData({ title: '', projectId: '', status: 'todo', priority: 'medium', dueDate: '', estimatedHours: 0 }); setIsModalOpen(true); }}
          className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-indigo-100 active:scale-95 transition-all"
        >
          <Plus size={22} strokeWidth={3} /> Ajouter une tâche
        </button>
      </div>

      <div className="px-12 space-y-4">
        {filteredTasks.map(task => (
          <div key={task._id} 
               className={`group flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all duration-300 ${task.status === 'done' ? 'bg-slate-50/50 opacity-80' : ''}`}>
            
            <div className="flex items-center gap-6">
              <button 
                onClick={() => toggleTaskStatus(task._id, task.status)}
                className={`transition-all transform active:scale-75 ${task.status === 'done' ? 'text-green-500' : 'text-slate-200 hover:text-indigo-500'}`}
              >
                {task.status === 'done' ? <CheckCircle2 size={32} /> : <Circle size={32} />}
              </button>

              <div>
                <h4 className={`font-bold text-lg transition-all ${task.status === 'done' ? 'line-through text-slate-300' : 'text-slate-700'}`}>
                  {task.title}
                </h4>
                <div className="flex items-center gap-4 mt-1">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wider ${task.status === 'done' ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600'}`}>
                    {projects.find(p => p._id === (task.projectId?._id || task.projectId))?.title || "Général"}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${task.priority === 'high' ? 'text-red-500' : 'text-slate-400'}`}>
                    {task.priority}
                  </span>
                  <span className="text-slate-300 text-[11px] font-bold flex items-center gap-1">
                    <Calendar size={12} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString('fr-FR') : 'Pas de date'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <button onClick={() => handleEditClick(task)} className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                <Edit3 size={18} />
              </button>
              <button onClick={() => deleteTask(task._id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[3.5rem] w-full max-w-xl p-12 shadow-2xl relative animate-in zoom-in-95">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-slate-300 hover:text-red-500">
              <X size={24}/>
            </button>
            <h3 className="text-3xl font-black text-slate-900 mb-10">
              {editingTask ? 'Modifier' : 'Nouvelle'} <span className="text-indigo-600">Tâche</span>
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Titre de la mission</label>
                <input 
                  type="text" placeholder="Ce qu'il faut faire..." required
                  className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold outline-none text-slate-700 focus:ring-2 focus:ring-indigo-200"
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Projet</label>
                  <select 
                    required className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-500 outline-none cursor-pointer"
                    value={formData.projectId} onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                  >
                    <option value="">Lier un projet</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Priorité</label>
                  <select 
                    className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-500 outline-none cursor-pointer"
                    value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Échéance</label>
                  <input 
                    type="date" className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-500 outline-none"
                    value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Heures est.</label>
                  <input 
                    type="number" className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-500 outline-none"
                    value={formData.estimatedHours} onChange={(e) => setFormData({...formData, estimatedHours: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-6 bg-[#4f46e5] text-white rounded-[2rem] font-black text-lg hover:bg-indigo-700 shadow-xl transition-all">
                {editingTask ? 'Mettre à jour' : 'Créer la tâche'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}