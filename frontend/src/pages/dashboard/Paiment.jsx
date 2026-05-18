import React, { useState, useEffect } from 'react';
// Importation dyal les icônes vectoriels m bibliothèque 'lucide-react'
import { 
  DollarSign, Calendar, TrendingUp, CheckCircle, 
  Clock, PieChart, Wallet, ArrowUpRight 
} from 'lucide-react';

// Importation dyal les composants d l-graphe m bibliothèque 'recharts'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PaymentDashboard() {
  // 1. Les États (States)
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);   

  // 2. Le cycle de vie (useEffect) : Kay-khdem gha t-7l la page initialement
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Appel API via fetch m l-backend
        const res = await fetch('http://localhost:5000/api/projects', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json(); 
        setProjects(data);             
      } catch (err) {
        console.error("Error fetching projects", err); 
      } finally {
      }
    };
    fetchProjects();
  }, []); 

  
  // paidProjects: fih gha les projets li paid (paye === true)
  const paidProjects = projects.filter(p => p.paye === true);
  // unpaidProjects: fih gha les projets li ba9i makhlsouhsh (paye === false)
  const unpaidProjects = projects.filter(p => p.paye === false);
  
  // 4. Calcul des Totaux (via la méthode .reduce li chfna)
  // totalIncome: l-majmou3 d l-mizaniya dyal les projets mkhlsyin
  const totalIncome = paidProjects.reduce((acc, curr) => acc + (curr.budget || 0), 0);
  // pendingIncome: l-majmou3 d l-mizaniya dyal les projets li ba9i t-sal
  const pendingIncome = unpaidProjects.reduce((acc, curr) => acc + (curr.budget || 0), 0);

  // 5. Préparation d data d l-Graphe (Monthly Breakdown)
  const getChartData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // map kat-dor 3la klla chhar f had l-tableau
    return months.map((month, index) => {
      // Filtrer les projets d had chhar khossossan w jm3 l-budget dyalhom
      const totalPaidForMonth = paidProjects
        .filter(p => {
          const dateStr = p.startDate || p.createdAt; // Khoud la date
          if (!dateStr) return false;

          // Split d la date (ex: "2026-03-15" rj3at ["2026", "03", "15"])
          const dateParts = dateStr.split('T')[0].split('-');
          if (dateParts.length < 2) return false;

          // parseInt kat-7wel l-kteb l-raqm w -1 kat-line m3a l-index (0-11)
          const projectMonthIndex = parseInt(dateParts[1], 10) - 1;
          
          return projectMonthIndex === index; // Ila kan l-projet d had chhar, khlih
        })
        .reduce((acc, p) => acc + (Number(p.budget) || 0), 0); // Jm3 total d l-budget d chhar

      // Recharts bgha l-format dyal data y-koun hka: { name: "Mois", Paid: Montant }
      return {
        name: month,
        Paid: totalPaidForMonth
      };
    });
  };

  // 6. L-Affichage d l-Chargement (Spinner animate-spin d Tailwind)
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F4F7FE]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );

  // 7. L-Affichage Principal d la page (L'interface)
  return (
    <div className="p-8 space-y-8 bg-white min-h-screen font-sans">
      
      {/* Header dyal la page (Financial Report) */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-[900] text-[#1B2559] tracking-tight">Financial Report</h1>
          <p className="text-[#A3AED0] font-medium text-sm">Visualization of earnings and outstanding invoices.</p>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-white">
          <Wallet className="text-blue-600" size={24} />
        </div>
      </div>

      {/* Grid dyal les 3 Cartes d l-Statistiques (Total Collected, Pending, Rate) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Collected Card */}
        <StatCard title="Total Collected" amount={totalIncome} color="bg-emerald-500" icon={<TrendingUp className="text-white" size={20}/>} />
        {/* Pending Amount Card */}
        <StatCard title="Pending Amount" amount={pendingIncome} color="bg-orange-400" icon={<Clock className="text-white" size={20}/>} />
        {/* Collection Rate Card: T-7seb l-pourcentage (paid / total) * 100 */}
        <StatCard title="Collection Rate" amount={`${projects.length > 0 ? Math.round((paidProjects.length / projects.length) * 100) : 0}%`} color="bg-blue-600" icon={<CheckCircle className="text-white" size={20}/>} />
      </div>

      {/* Grid fih l-Graphe w la Liste dyal les projets unpaid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Le Graphe de Revenu (LineChart) */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white h-[420px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-black text-[#1B2559]">Revenue Trend (DH)</h2>
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
              <TrendingUp size={14}/> +{paidProjects.length} Paid projects
            </div>
          </div>
          
          {/* ResponsiveContainer: Bach l-graphe i-koun responsive m3a l-écran */}
          <div className="w-full flex-1 min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              {/* Data li khdina m la fonction getChartData() */}
              <LineChart data={getChartData()} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                {/* CartesianGrid: L-khoutout d l-khalfya horizontal (vertical={false}) */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                {/* XAxis: L-me7war l-ofoqy (fih les noms d l-achhor) */}
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#A3AED0', fontSize: 12, fontWeight: 'bold'}} />
                {/* YAxis: L-me7war l-3amoudy (fih l-arqam d l-budget) */}
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#A3AED0', fontSize: 10}} />
                {/* Tooltip: L-fqa3a li katban mlli kat-7ti l-far (hover) 3la chi chhar */}
                <Tooltip contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} itemStyle={{fontWeight: 'bold'}} />
                {/* Legend: L-kteb d l-tafssir li t7t (Paid f l-khdar) */}
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
                {/* Line: L-khatt s-s7i7 d l-graphe (Loon khdar monotone, ghlada 4px) */}
                <Line type="monotone" dataKey="Paid" stroke="#10b981" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Paid" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* La Liste dyal les projets li ba9i makhlsouhsh (Upcoming Inflow) */}
        <div className="bg-[#1B2559] p-8 rounded-[2.5rem] shadow-xl text-white h-[420px] flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <h2 className="text-lg font-bold">Upcoming Inflow</h2>
            <span className="text-xs font-bold text-orange-400">{unpaidProjects.length} Projects</span>
          </div>
          {/* Scrollbar vertical ila kano bzzaf d les projets */}
          <div className="space-y-1 overflow-y-auto flex-1 custom-scrollbar">
            {/* map bach n-affichio klla projet unpaid f un composant sghir FinanceItem */}
            {unpaidProjects.map(p => <FinanceItem key={p._id} project={p} dark={true} />)}
            {/* Condition: Ila l-9ina 0 projets unpaid, n-biyeno message "All payments settled" */}
            {unpaidProjects.length === 0 && <p className="text-center text-white/30 py-10 text-sm italic">All payments settled.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}

// 8. Sous-Composant StatCard (Composant Réutilisable le les 3 cartes)
const StatCard = ({ title, amount, color, icon }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-white">
    <div className="flex items-center gap-4 mb-4">
      <div className={`${color} p-3 rounded-2xl shadow-lg flex items-center justify-center`}>
        {icon}
      </div>
      <span className="text-xs font-black uppercase text-[#A3AED0] tracking-widest">{title}</span>
    </div>
    {/* Typeof amount === 'number' : Ila kan raqm (b7al l-flous) n-biyeno 7dah 'DH', ila kan texte (b7al la carte 3 d l-pourcentage %) match9ash DH */}
    <div className="text-3xl font-black text-[#1B2559]">{amount} <span className="text-sm font-medium">{typeof amount === 'number' ? 'DH' : ''}</span></div>
  </div>
);

// 9. Sous-Composant FinanceItem (Composant Réutilisable d la ligne f la liste)
const FinanceItem = ({ project, dark }) => (
  <div className={`py-4 px-2 flex justify-between items-center transition-all ${dark ? 'border-b border-white/5' : 'border-b border-gray-50'} last:border-none rounded-xl`}>
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-400'}`}>
         <DollarSign size={18} />
      </div>
      <div>
        {/* Smiyt l-projet */}
        <h4 className={`font-bold text-sm ${dark ? 'text-white' : 'text-[#1B2559]'}`}>{project.title}</h4>
        {/* Date formatée b l-LocaleDateString (ex: DD/MM/YYYY) */}
        <p className={`text-[10px] font-medium opacity-50 ${dark ? 'text-white' : 'text-[#A3AED0]'}`}>
            {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
        </p>
      </div>
    </div>
    <div className="text-right">
      {/* L-Budget dyal l-projet */}
      <span className={`font-black text-sm ${dark ? 'text-white' : 'text-[#1B2559]'}`}>{project.budget} DH</span>
      {/* Badge 'Pending' بالليموني 7يت l-projet ba9i makhlossch */}
      {dark && <p className="text-[9px] text-orange-400 font-bold uppercase tracking-tighter">Pending</p>}
    </div>
  </div>
);