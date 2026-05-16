import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Calendar, TrendingUp, CheckCircle, 
  Clock, PieChart, Wallet, ArrowUpRight 
} from 'lucide-react';
// Importi hadou men Recharts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function PaymentDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/projects', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const paidProjects = projects.filter(p => p.paye === true);
  const unpaidProjects = projects.filter(p => p.paye === false);
  const totalIncome = paidProjects.reduce((acc, curr) => acc + curr.budget, 0);
  const pendingIncome = unpaidProjects.reduce((acc, curr) => acc + curr.budget, 0);

  // --- Logic bach n-prepariw l-data dyal l-Courbe ---
  const getChartData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    
    // N-creyiw objet fih kull chher o ch-hal dkhlat fih
    const monthlyData = months.map((month, index) => {
      const total = paidProjects
        .filter(p => {
          const d = new Date(p.updatedAt);
          return d.getMonth() === index && d.getFullYear() === currentYear;
        })
        .reduce((acc, p) => acc + p.budget, 0);
      
      return { name: month, amount: total };
    });
    return monthlyData;
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F4F7FE]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-8 space-y-8 bg-[#F4F7FE] min-h-screen font-sans">
      
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-[900] text-[#1B2559] tracking-tight">Rapport Financier</h1>
          <p className="text-[#A3AED0] font-medium text-sm">Visualisation des revenus et créances.</p>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-white">
            <Wallet className="text-blue-600" size={24} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Encaissé" amount={totalIncome} color="bg-emerald-500" icon={<TrendingUp className="text-white" size={20}/>} />
        <StatCard title="Montant en Attente" amount={pendingIncome} color="bg-orange-400" icon={<Clock className="text-white" size={20}/>} />
        <StatCard title="Taux de Recouvrement" amount={`${projects.length > 0 ? Math.round((paidProjects.length/projects.length)*100) : 0}%`} color="bg-blue-600" icon={<CheckCircle className="text-white" size={20}/>} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* L-Courbe dyal l-flouss (Paid) */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-black text-[#1B2559]">Évolution des Revenus (DH)</h2>
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
              <TrendingUp size={14}/> +{paidProjects.length} Projets payés
            </div>
          </div>
          
          <div className="flex-1 w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#A3AED0', fontSize: 12, fontWeight: 'bold'}} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  itemStyle={{color: '#1B2559', fontWeight: 'bold'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* List: Unpaid Projects */}
        <div className="bg-[#1B2559] p-8 rounded-[2.5rem] shadow-xl text-white">
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <h2 className="text-lg font-bold">Encaissements à Venir</h2>
            <span className="text-xs font-bold text-orange-400">{unpaidProjects.length} Projets</span>
          </div>
          <div className="space-y-1 overflow-y-auto max-h-[300px] custom-scrollbar">
            {unpaidProjects.map(p => <FinanceItem key={p._id} project={p} dark={true} />)}
            {unpaidProjects.length === 0 && <p className="text-center text-white/30 py-10 text-sm italic">Tout est réglé.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}

const StatCard = ({ title, amount, color, icon }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-white">
    <div className="flex items-center gap-4 mb-4">
      <div className={`${color} p-3 rounded-2xl shadow-lg flex items-center justify-center`}>
        {icon}
      </div>
      <span className="text-xs font-black uppercase text-[#A3AED0] tracking-widest">{title}</span>
    </div>
    <div className="text-3xl font-black text-[#1B2559]">{amount} <span className="text-sm font-medium">{typeof amount === 'number' ? 'DH' : ''}</span></div>
  </div>
);

const FinanceItem = ({ project, dark }) => (
  <div className={`py-4 px-2 flex justify-between items-center transition-all ${dark ? 'border-b border-white/5' : 'border-b border-gray-50'} last:border-none rounded-xl`}>
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-400'}`}>
         <DollarSign size={18} />
      </div>
      <div>
        <h4 className={`font-bold text-sm ${dark ? 'text-white' : 'text-[#1B2559]'}`}>{project.title}</h4>
        <p className={`text-[10px] font-medium opacity-50 ${dark ? 'text-white' : 'text-[#A3AED0]'}`}>
            {new Date(project.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
    <div className="text-right">
      <span className={`font-black text-sm ${dark ? 'text-white' : 'text-[#1B2559]'}`}>{project.budget} DH</span>
      {dark && <p className="text-[9px] text-orange-400 font-bold uppercase tracking-tighter">En attente</p>}
    </div>
  </div>
);