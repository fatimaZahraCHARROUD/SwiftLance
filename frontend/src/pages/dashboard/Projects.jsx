import React from 'react';

function Projects() {
  const projects = [
    { id: 1, name: "E-app", client: "Sami", progress: 40 },
    { id: 2, name: "Web Portfolio", client: "Meryem", progress: 100 }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-8">My Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <div key={p.id} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group">
            {p.progress < 100 && (
              <div className="absolute top-4 right-4 bg-red-50 text-red-500 text-[10px] font-bold px-2 py-1 rounded-full border border-red-100">
                ● PENDING
              </div>
            )}
            
            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-[#3327db] transition-colors">{p.name}</h3>
            <p className="text-sm text-slate-500 mb-6 italic">Client: {p.client || 'Unknown'}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Progress</span>
                <span className={p.progress === 100 ? "text-green-500" : "text-blue-500"}>{p.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${p.progress === 100 ? 'bg-green-500' : 'bg-[#3327db]'}`}
                  style={{ width: `${p.progress}%` }}
                ></div>
              </div>
            </div>
            
            <button className="w-full mt-6 py-2 rounded-xl bg-slate-50 text-slate-600 font-semibold hover:bg-[#3327db] hover:text-white transition-all">
              View Project
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;