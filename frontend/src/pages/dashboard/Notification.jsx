import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

export default function SwiftLanceDeadlines() {
    const [urgentProjects, setUrgentProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAndFilter = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL +'/api/projects', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const data = await response.json();
                
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

                const filtered = data.filter(project => {
                    
                    const currentStatus = project.status ? project.status.toLowerCase().trim() : '';
                    if (currentStatus === 'done' || currentStatus === 'completed') {
                        return false; 
                    }

                    const projectDeadline =  project.endDate;
                    if (!projectDeadline) return false; 
                    
                    const pDate = new Date(projectDeadline);
                    const pDay = new Date(pDate.getFullYear(), pDate.getMonth(), pDate.getDate()).getTime();
                    
                    const diffTime = pDay - today;
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        
                    return diffDays >= 0 && diffDays <= 2; 
                });

                setUrgentProjects(filtered);
                setLoading(false);
            } catch (err) {
                console.error("Error:", err);
                setLoading(false);
            }
        };
        fetchAndFilter();
    }, []);

    const getRemainingInfo = (projectDate) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const pDate = new Date(projectDate);
        const pDay = new Date(pDate.getFullYear(), pDate.getMonth(), pDate.getDate()).getTime();
        
        const diffTime = pDay - today;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return { label: 'Due Today', days: 0, color: 'red' };
        return { label: 'Upcoming', days: diffDays, color: 'orange' };
    };

    return (
        <div className="p-8 bg-white min-h-screen font-sans">
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

            <div className="grid gap-6">
                {loading ? (
                    <div className="p-10 text-center text-gray-400 font-bold italic">Loading your deadlines...</div>
                ) : urgentProjects.length > 0 ? (
                    urgentProjects.map((project) => {
                        const projectDeadline = project.deadline || project.endDate;
                        const info = getRemainingInfo(projectDeadline);
                        const isDueToday = info.label === 'Due Today';

                        return (
                            <div key={project._id} className="group bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                                <div className={`absolute top-0 left-0 h-full w-2 ${isDueToday ? 'bg-red-500' : 'bg-orange-400'}`}></div>
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 ml-4">
                                    <div className="flex gap-5 items-start">
                                        <div className={`p-4 rounded-2xl ${isDueToday ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                                            <Clock size={28} className={isDueToday ? "animate-pulse" : ""} />
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {project.title}
                                            </h3>
                                            <p className="text-sm text-gray-400 font-medium line-clamp-1">{project.description}</p>
                                            <div className="flex items-center gap-4 mt-3">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                                                    <Calendar size={14} className="text-blue-500" />
                                                    {projectDeadline ? new Date(projectDeadline).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                    <div className="bg-green-50 border border-green-100 p-12 rounded-[3rem] text-center">
                        <h2 className="text-2xl font-black text-green-800">All caught up!</h2>
                        <p className="text-green-600/70 font-medium mt-2">No projects are due within 2 days.</p>
                    </div>
                )}
            </div>
        </div>
    );
}