import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Calendar, Hash, CheckCircle2, Clock, Layout, AlertCircle, Search } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    estimatedHours: 0
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [resTasks, resProjects] = await Promise.all([
        axios.get('http://localhost:5000/api/tasks', config),
        axios.get('http://localhost:5000/api/projects', config)
      ]);

      setTasks(resTasks.data);
      setProjects(resProjects.data);
    } catch (err) {
      console.error("Erreur lors de la récupération :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/tasks', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
      setFormData({ title: '', description: '', projectId: '', status: 'todo', priority: 'medium', dueDate: '', estimatedHours: 0 });
      fetchData();
    } catch (err) {
      alert("Erreur lors de la création de la tâche");
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-50 text-red-500 border-red-100';
      case 'medium': return 'bg-orange-50 text-[#f97316] border-[#ffedd5]';
      default: return 'bg-blue-50 text-blue-500 border-blue-100';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf5]">
       <div className="animate-pulse text-[#f97316] font-bold text-xl tracking-widest">LOADING TASKS...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfaf5] p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
               <div className="h-1 w-10 bg-[#f97316] rounded-full"></div>
               <span className="text-[#fdba74] font-bold uppercase text-[12px] tracking-[0.25em]">Workflow</span>
            </div>
            <h2 className="text-5xl font-extrabold text-[#1f2937] tracking-tighter">Project <span className="text-[#f97316]">Tasks</span></h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#fdba74] group-focus-within:text-[#f97316] transition-colors" size={20} />
               <input 
                 type="text" placeholder="Find a task..."
                 className="pl-14 pr-6 py-4 rounded-[2rem] bg-white border border-slate-100 shadow-[0_10px_35px_-10px_rgba(249,115,22,0.05)] outline-none focus:border-[#ffedd5] focus:ring-4 focus:ring-[#f97316]/5 w-full sm:w-80 transition-all placeholder:text-slate-300"
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#f97316] hover:bg-[#ea580c] text-white px-10 py-4 rounded-[2rem] flex items-center justify-center gap-3 shadow-[0_15px_40px_-10px_rgba(249,115,22,0.4)] hover:shadow-[0_18px_50px_-10px_rgba(249,115,22,0.5)] transition-all active:scale-95"
            >
              <Plus size={22} strokeWidth={3} /> <span className="font-extrabold">New Task</span>
            </button>
          </div>
        </div>

        {/* --- Tasks Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTasks.length > 0 ? filteredTasks.map(task => (
            <div key={task._id} className="bg-white p-8 rounded-[3rem] border-2 border-white hover:border-[#ffedd5] shadow-[0_15px_50px_-15px_rgba(0,0,0,0.03)] transition-all duration-500 group">
              <div className="flex justify-between items-start mb-6">
                <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-[#f97316]/10 group-hover:text-[#f97316] transition-colors text-slate-200">
                  <CheckCircle2 size={20} />
                </div>
              </div>

              <h4 className="font-extrabold text-[#1f2937] text-xl mb-3 group-hover:text-[#f97316] transition-colors">{task.title}</h4>
              <p className="text-slate-400 text-sm line-clamp-2 mb-8 font-medium leading-relaxed">{task.description}</p>
              
              <div className="pt-6 border-t border-[#fdfaf5] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[12px] font-bold">
                    <Calendar size={14} className="text-[#fdba74]" />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[12px] font-bold">
                    <Clock size={14} className="text-[#fdba74]" />
                    <span>{task.estimatedHours}h</span>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-[#ffedd5] flex items-center justify-center text-[#f97316]">
                  <Layout size={14} />
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-24 bg-white rounded-[4rem] border-4 border-dashed border-[#ffedd5]">
               <div className="bg-[#fff7ed] inline-block p-6 rounded-full text-[#f97316] mb-6">
                  <AlertCircle size={40} />
               </div>
               <p className="text-[#1f2937] font-black text-xl">No tasks found.</p>
               <p className="text-[#fdba74] font-medium mt-2">Ready to conquer your goals?</p>
            </div>
          )}
        </div>
      </div>

      {/* --- Modern Orange Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1f2937]/20 backdrop-blur-xl z-50 flex items-center justify-center p-5">
          <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-2xl p-12 relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#f97316] to-[#fdba74]"></div>
            
            <h3 className="text-3xl font-extrabold text-[#1f2937] mb-10 tracking-tight">Create <span className="text-[#f97316]">Task</span></h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <input 
                type="text" placeholder="What needs to be done?" required
                className="w-full p-6 rounded-2xl border border-transparent bg-[#fcf9f5] outline-none focus:border-[#ffedd5] focus:ring-4 focus:ring-[#f97316]/5 transition-all text-lg"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
              
              <textarea 
                placeholder="Brief description..."
                className="w-full p-6 rounded-2xl border border-transparent bg-[#fcf9f5] h-32 outline-none focus:border-[#ffedd5] focus:ring-4 focus:ring-[#f97316]/5 transition-all resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              
              <div className="grid grid-cols-2 gap-6">
                <select 
                  required className="w-full p-5 rounded-2xl border border-transparent bg-[#fcf9f5] outline-none focus:border-[#ffedd5] focus:ring-4 focus:ring-[#f97316]/5 transition-all appearance-none text-slate-500 font-bold"
                  value={formData.projectId}
                  onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                >
                  <option value="">Link to Project</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.title}</option>
                  ))}
                </select>

                <select 
                  className="w-full p-5 rounded-2xl border border-transparent bg-[#fcf9f5] outline-none focus:border-[#ffedd5] focus:ring-4 focus:ring-[#f97316]/5 transition-all appearance-none text-slate-500 font-bold"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-[#fdba74] ml-4">Due Date</label>
                  <input 
                    type="date" className="w-full p-5 rounded-2xl border border-transparent bg-[#fcf9f5] outline-none focus:border-[#ffedd5]"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-[#fdba74] ml-4">Est. Hours</label>
                  <input 
                    type="number" placeholder="Hours"
                    className="w-full p-5 rounded-2xl border border-transparent bg-[#fcf9f5] outline-none focus:border-[#ffedd5]"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({...formData, estimatedHours: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-6 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 font-bold text-slate-300 hover:text-[#1f2937] transition-colors">Cancel</button>
                <button type="submit" className="flex-[2] py-5 bg-[#f97316] text-white rounded-[1.5rem] font-extrabold shadow-lg shadow-[#f97316]/30 hover:bg-[#ea580c] transition-all">
                  Launch Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}