import React, { useEffect, useState } from 'react';
import { 
  Plus, Notebook, Trash2, Search, Edit3, X, Eye 
} from 'lucide-react';

export default function Note() {
  const [notes, setNotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [viewingNote, setViewingNote] = useState(null); 
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: '', content: '', projectId: ''
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [resProjects, resNotes] = await Promise.all([
        fetch('http://localhost:5000/api/projects', { headers }),
        fetch('http://localhost:5000/api/notes', { headers }) 
      ]);

      if (resProjects.ok && resNotes.ok) {
        const projectsData = await resProjects.json();
        const notesData = await resNotes.json();
        setProjects(projectsData);
        setNotes(notesData);
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
    
    const url = editingNote 
      ? `http://localhost:5000/api/notes/${editingNote._id}` 
      : 'http://localhost:5000/api/notes';
    
    const method = editingNote ? 'PUT' : 'POST';

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
        setEditingNote(null);
        setFormData({ title: '', content: '', projectId: '' });
        fetchData(); 
      } else {
        const errorData = await response.json();
        alert("Erreur backend: " + (errorData.message || "Erreur de validation"));
      }
    } catch (err) {
      alert("Erreur réseau: Checki CORS f server.js o t-أkd bli l-auth kheddam");
    }
  };

  const deleteNote = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette note ?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) fetchData();
      } catch (err) {
        alert("Erreur réseau lors de la suppression");
      }
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({ 
      title: note.title, 
      content: note.content, 
      projectId: note.projectId?._id || note.projectId
    });
    setIsModalOpen(true);
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
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
            type="text" placeholder="Rechercher des notes..." 
            className="w-full pl-16 pr-8 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 shadow-sm transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { setEditingNote(null); setFormData({title:'', content:'', projectId:''}); setIsModalOpen(true); }}
          className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl active:scale-95 transition-all"
        >
          <Plus size={22} strokeWidth={3} /> Ajouter une note
        </button>
      </div>

      <div className="px-12">
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc]/50">
              <tr className="border-b border-slate-50">
                <th className="px-10 py-6 text-[11px] font-black uppercase text-slate-300 tracking-[0.2em]">Titre</th>
                <th className="px-6 py-6 text-[11px] font-black uppercase text-slate-300 tracking-[0.2em]">Projet</th>
                <th className="px-6 py-6 text-[11px] font-black uppercase text-slate-300 tracking-[0.2em]">Aperçu</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase text-slate-300 tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredNotes.map(note => (
                <tr key={note._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                        <Notebook size={20} />
                      </div>
                      <span className="font-bold text-slate-700 text-lg">{note.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-7">
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg">
                      {projects.find(p => p._id === (note.projectId?._id || note.projectId))?.title || "Général"}
                    </span>
                  </td>
                  <td className="px-6 py-7 text-slate-400 text-sm italic max-w-xs truncate">
                    {note.content}
                  </td>
                  <td className="px-10 py-7 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      
                      <button onClick={() => setViewingNote(note)} className="p-3 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleEdit(note)} className="p-3 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => deleteNote(note._id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[3.5rem] w-full max-w-xl p-12 shadow-2xl relative animate-in zoom-in-95">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-slate-300 hover:text-red-500">
              <X size={24}/>
            </button>
            <h3 className="text-3xl font-black text-slate-900 mb-10">
              {editingNote ? 'Modifier' : 'Nouvelle'} <span className="text-indigo-600">Note</span>
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <input 
                type="text" placeholder="Titre..." required
                className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold outline-none"
                value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
              <select 
                required className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold outline-none"
                value={formData.projectId} onChange={(e) => setFormData({...formData, projectId: e.target.value})}
              >
                <option value="">Sélectionner un projet</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
              </select>
              <textarea 
                placeholder="Description..." required
                className="w-full p-5 bg-slate-50 border-none rounded-2xl h-44 resize-none font-bold outline-none"
                value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})}
              />
              <button type="submit" className="w-full py-6 bg-[#4f46e5] text-white rounded-[2rem] font-black text-lg hover:bg-indigo-700 transition-all">
                {editingNote ? 'Mettre à jour' : 'Enregistrer'}
              </button>
            </form>
          </div>
        </div>
      )}

      {viewingNote && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[3.5rem] w-full max-w-xl p-12 shadow-2xl relative">
            <button onClick={() => setViewingNote(null)} className="absolute top-10 right-10 text-slate-300">
              <X size={24}/>
            </button>
            <h3 className="text-3xl font-black mb-6">{viewingNote.title}</h3>
            <div className="bg-slate-50 p-8 rounded-3xl min-h-[200px]">
              <p className="text-slate-700 whitespace-pre-wrap font-medium">{viewingNote.content}</p>
            </div>
            <button onClick={() => setViewingNote(null)} className="mt-8 w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black">
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}