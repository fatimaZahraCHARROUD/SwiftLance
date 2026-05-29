import React, { useEffect, useState } from 'react';
import { 
  Plus, Trash2, Search, Edit3, X, Eye, FileText
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
        fetch(import.meta.env.VITE_API_URL +'/api/projects', { headers }),
        fetch(import.meta.env.VITE_API_URL +'/api/notes', { headers }) 
      ]);

      if (resProjects.ok && resNotes.ok) {
        setProjects(await resProjects.json());
        setNotes(await resNotes.json());
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const url = editingNote 
      ? import.meta.env.VITE_API_URL +`/api/notes/${editingNote._id}` 
      : import.meta.env.VITE_API_URL +'/api/notes';
    
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
        alert("Backend error: " + (errorData.message || "Validation error"));
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(import.meta.env.VITE_API_URL +`/api/notes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchData();
      else alert("Error during deletion");
    } catch (err) {
      alert("Network error during deletion");
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({ 
      title: note.title, 
      content: note.content, 
      projectId: note.projectId?._id || note.projectId || ''
    });
    setIsModalOpen(true);
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
       <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans pb-16 pt-12">
      {/* HEADER */}
<div className=" mb-10">
  <h1 className="text-4xl font-black text-slate-900 tracking-tight">
    Notes
  </h1>

  <p className="text-slate-500 mt-3 text-lg max-w-2xl">
    Organize project ideas, meeting summaries, and important team notes in one place.
  </p>
</div>
      {/* --- Action Bar (Perfect Match to Tasks) --- */}
      <div className="w-full  mx-auto mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search notes..." 
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all text-sm text-slate-900 font-medium placeholder:text-slate-400"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { setEditingNote(null); setFormData({title:'', content:'', projectId:''}); setIsModalOpen(true); }}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all text-sm"
        >
          <Plus size={18} /> Add Note
        </button>
      </div>

      {/* --- Main Table Container (Perfect Match to Tasks) --- */}
      <div className="w-full  mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-8 py-4 text-[11px] font-extrabold uppercase text-slate-600 tracking-widest">Note / Title</th>
                  <th className="px-8 py-4 text-[11px] font-extrabold uppercase text-slate-600 tracking-widest">Project</th>
                  <th className="px-8 py-4 text-[11px] font-extrabold uppercase text-slate-600 tracking-widest">Content Preview</th>
                  <th className="px-8 py-4 text-[11px] font-extrabold uppercase text-slate-600 tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredNotes.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-16 text-center text-sm text-slate-500 font-medium italic">
                      No notes found
                    </td>
                  </tr>
                ) : (
                  filteredNotes.map(note => (
                    <tr key={note._id} className="hover:bg-slate-50/50 transition-colors h-20">
                      
                      {/* Column 1: Note Title (Matching Tasks Style) */}
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="text-slate-400">
                            <FileText size={22} strokeWidth={2.5} />
                          </div>
                          <span className="font-extrabold text-slate-900 text-[14px]">
                            {note.title}
                          </span>
                        </div>
                      </td>

                      {/* Column 2: Project Badge (Matching Tasks Style) */}
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-900 text-[11px] font-extrabold rounded-md border border-blue-200 uppercase tracking-wider">
                          {projects.find(p => p._id === (note.projectId?._id || note.projectId))?.title || "General"}
                        </span>
                      </td>

                      {/* Column 3: Content Preview */}
                      <td className="px-8 py-6 text-slate-500 text-sm max-w-xs truncate font-medium">
                        {note.content}
                      </td>

                      {/* Column 4: Actions (Matching Tasks Style) */}
                      <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setViewingNote(note)} 
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="View"
                          >
                            <Eye size={16} strokeWidth={2.5} />
                          </button>
                          <button 
                            onClick={() => handleEdit(note)} 
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit3 size={16} strokeWidth={2.5} />
                          </button>
                          <button 
                            onClick={() => deleteNote(note._id)} 
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

      {/* --- Add / Edit Modal (Perfect Match to Tasks) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 pl-20">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl relative border border-slate-200">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <X size={18} strokeWidth={2.5}/>
            </button>
            <h3 className="text-lg font-black text-slate-900 mb-5">
              {editingNote ? 'Edit Note' : 'Create New Note'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Note Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Database Architecture Design" 
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Linked Project</label>
                <select 
                  required 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  value={formData.projectId} 
                  onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                >
                  <option value="">Select a project</option>
                  {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Note Content</label>
                <textarea 
                  placeholder="Write your ideas here..." 
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-36 resize-none transition-all"
                  value={formData.content} 
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                />
              </div>

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
                  {editingNote ? 'Update Note' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- View Details Modal (Perfect Match to Tasks Style) --- */}
      {viewingNote && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 pl-20">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl relative border border-slate-200">
            <button 
              onClick={() => setViewingNote(null)} 
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <X size={18} strokeWidth={2.5}/>
            </button>
            <h3 className="text-lg font-black text-slate-900 mb-4">{viewingNote.title}</h3>
            
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl min-h-[150px] max-h-[300px] overflow-y-auto mb-5">
              <p className="text-slate-800 text-sm whitespace-pre-wrap leading-relaxed font-medium">
                {viewingNote.content}
              </p>
            </div>
            
            <div className="flex justify-end">
              <button 
                onClick={() => setViewingNote(null)} 
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 rounded-lg text-sm font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}