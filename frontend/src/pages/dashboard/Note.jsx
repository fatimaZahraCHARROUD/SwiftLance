import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Notebook, Trash2, Calendar, Search, ArrowRight, BookOpen, Clock3 } from 'lucide-react';

export default function Note() {
  const [notes, setNotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    projectId: ''
  });

  // 1. Function bach n-jibou l-data
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const resProjects = await axios.get('http://localhost:5000/api/projects', config);
      setProjects(resProjects.data);

      const resNotes = await axios.get('http://localhost:5000/api/notes', config);
      setNotes(resNotes.data);

    } catch (err) {
      console.error("Erreur f Note.jsx:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // 2. Save Note
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/notes', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchData(); // Refresh automatyco
      setIsModalOpen(false);
      setFormData({ title: '', content: '', projectId: '' });
    } catch (err) {
      alert("Error saving note");
    }
  };

  const deleteNote = async (id) => {
    if (window.confirm("Bghiti tms7 had l-note?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/notes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData(); 
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf5]">
       <div className="animate-pulse text-[#f97316] font-bold text-xl">Loading Creative Space...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfaf5] p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header Section (Kima chfti f l-Mac) --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
               <div className="h-1 w-10 bg-[#f97316] rounded-full"></div>
               <span className="text-[#fdba74] font-bold uppercase text-[12px] tracking-[0.25em]">Creative Canvas</span>
            </div>
            <h2 className="text-5xl font-extrabold text-[#1f2937] tracking-tighter">My <span className="text-[#f97316]">Notes</span></h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#fdba74] group-focus-within:text-[#f97316] transition-colors" size={20} />
               <input 
                 type="text" placeholder="Search ideas..."
                 className="pl-14 pr-6 py-4 rounded-[2rem] bg-white border border-slate-100 shadow-[0_10px_35px_-10px_rgba(249,115,22,0.05)] outline-none focus:border-[#ffedd5] focus:ring-4 focus:ring-[#f97316]/5 w-full sm:w-80 transition-all placeholder:text-slate-300"
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#f97316] hover:bg-[#ea580c] text-white px-10 py-4 rounded-[2rem] flex items-center justify-center gap-3 shadow-[0_15px_40px_-10px_rgba(249,115,22,0.4)] hover:shadow-[0_18px_50px_-10px_rgba(249,115,22,0.5)] hover:-translate-y-1 transition-all active:scale-95"
            >
              <Plus size={22} strokeWidth={3} /> <span className="font-extrabold tracking-wide">New Thought</span>
            </button>
          </div>
        </div>

        {/* --- Notes Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredNotes.length > 0 ? filteredNotes.map(note => (
            <div key={note._id} className="bg-white p-9 rounded-[3rem] shadow-[0_15px_50px_-15px_rgba(0,0,0,0.03)] border-2 border-white hover:border-[#ffedd5] transition-all duration-500 hover:shadow-[0_20px_60px_-10px_rgba(249,115,22,0.07)] group overflow-hidden">
              <div className="flex items-center gap-3 mb-7">
                <div className="p-4 bg-[#fff7ed] rounded-[1.5rem] text-[#f97316]">
                  <Notebook size={24} />
                </div>
                <div className="h-1.5 w-1.5 bg-slate-200 rounded-full"></div>
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-[0.2em]">
                  {projects.find(p => p._id === note.projectId)?.title || "General Idea"}
                </span>
              </div>

              <h4 className="font-extrabold text-[#1f2937] text-2xl mb-5 group-hover:text-[#f97316] transition-colors leading-snug">{note.title}</h4>
              <p className="text-slate-500 text-[15px] mb-10 leading-relaxed line-clamp-5 font-medium opacity-85">{note.content}</p>
              
              <div className="pt-7 border-t border-[#fff7ed] flex justify-between items-center">
                 <div className="flex items-center gap-3 text-slate-400">
                    <Clock3 size={16} className="text-[#f97316]/60"/> 
                    <span className="text-[13px] font-bold">{new Date(note.createdAt).toLocaleDateString()}</span>
                 </div>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => deleteNote(note._id)}
                      className="p-3.5 bg-white hover:bg-red-50 rounded-2xl text-slate-200 hover:text-red-500 shadow-inner border border-slate-50 transition-all hover:scale-110"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button className="p-3.5 bg-[#f97316]/5 rounded-2xl text-[#f97316] hover:bg-[#f97316] hover:text-white transition-colors">
                      <ArrowRight size={18} />
                    </button>
                 </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-32 bg-white rounded-[4rem] border-4 border-dashed border-[#ffedd5]">
               <div className="bg-[#fff7ed] inline-block p-7 rounded-full shadow-lg mb-8 text-[#f97316]">
                  <BookOpen size={52} strokeWidth={1} />
               </div>
               <p className="text-[#1f2937] font-black text-2xl">Your canvas is fresh and empty.</p>
               <p className="text-[#fdba74] font-medium mt-3">Click "New Thought" to write your next big idea.</p>
            </div>
          )}
        </div>

        {/* --- Modal Design (Limouni style) --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-[#1f2937]/15 backdrop-blur-xl z-50 flex items-center justify-center p-5">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl p-12 relative overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#f97316] to-[#fdba74]"></div>
              
              <h3 className="text-3xl font-extrabold text-[#1f2937] mb-10 flex items-center gap-3">
                New <span className="text-[#f97316]">Thought</span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="space-y-2">
                  <label className="text-[12px] font-black uppercase text-[#fdba74] ml-2">Note Title</label>
                  <input 
                    type="text" required placeholder="Give it a fresh name..."
                    className="w-full p-6 rounded-2xl border border-transparent bg-[#fcf9f5] outline-none focus:border-[#ffedd5] focus:ring-4 focus:ring-[#f97316]/5 transition-all text-lg"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-black uppercase text-[#fdba74] ml-2">Select Project</label>
                  <select 
                    required className="w-full p-6 rounded-2xl border border-transparent bg-[#fcf9f5] outline-none focus:border-[#ffedd5] focus:ring-4 focus:ring-[#f97316]/5 transition-all appearance-none text-lg text-slate-500"
                    value={formData.projectId}
                    onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                  >
                    <option value="">Choose a linked project</option>
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-black uppercase text-[#fdba74] ml-2">Content Details</label>
                  <textarea 
                    required placeholder="Spill your ideas here..."
                    className="w-full p-6 rounded-2xl border border-transparent bg-[#fcf9f5] h-44 resize-none outline-none focus:border-[#ffedd5] focus:ring-4 focus:ring-[#f97316]/5 transition-all text-lg"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                  />
                </div>

                <div className="flex gap-5 pt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 font-extrabold text-slate-300 hover:text-[#1f2937] transition-colors">Dismiss</button>
                  <button type="submit" className="flex-[2] py-5 bg-[#f97316] text-white rounded-[1.5rem] font-extrabold shadow-lg shadow-[#f97316]/30 hover:bg-[#ea580c] transition-all active:scale-95 text-lg">
                    Save Note
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}