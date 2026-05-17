import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Calendar, TrendingUp, CheckCircle, 
  Clock, PieChart, Wallet, ArrowUpRight 
} from 'lucide-react';
// التعديل هنا: إستيراد مكونات الـ LineChart عوض الـ BarChart
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

  // فلتتة المشاريع بناءً على حقل paye الحقيقي
  const paidProjects = projects.filter(p => p.paye === true);
  const unpaidProjects = projects.filter(p => p.paye === false);
  
  // الحسابات الإجمالية للديناميكية
  const totalIncome = paidProjects.reduce((acc, curr) => acc + (curr.budget || 0), 0);
  const pendingIncome = unpaidProjects.reduce((acc, curr) => acc + (curr.budget || 0), 0);

  // --- حساب البيانات الحقيقية بدقة تامة بناءً على الشهر المكتوب ف التاريخ ديريكت ---
  const getChartData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return months.map((month, index) => {
      // حساب مجموع الـ budget للمشاريع المخلصة (Paid) لي تابعة لهاد الشهر بالظبط
      const totalPaidForMonth = paidProjects
        .filter(p => {
          // أخذ سلسلة التاريخ الحقيقية (سواء من startDate أو createdAt)
          const dateStr = p.startDate || p.createdAt;
          if (!dateStr) return false;

          // تقطيع التاريخ بناءً على "-" (مثال: "2026-03-15" غاتعطينا ["2026", "03", "15"])
          const dateParts = dateStr.split('T')[0].split('-');
          if (dateParts.length < 2) return false;

          // أخذ الشهر ديريكت من النص وتحويله لـ رقم (مع نقص 1 حيت المصفوفة كاتبدا من 0 لـ 11)
          const projectMonthIndex = parseInt(dateParts[1], 10) - 1;
          
          return projectMonthIndex === index;
        })
        .reduce((acc, p) => acc + (Number(p.budget) || 0), 0); // جمع الميزانية بشكل صحيح

      return {
        name: month,
        Paid: totalPaidForMonth
      };
    });
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F4F7FE]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-8 space-y-8 bg-white min-h-screen font-sans">
      
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
        
        {/* التعديل هنا: تحويل الـ غراف لـ LineChart خطي احترافي */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white h-[420px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-black text-[#1B2559]">Évolution des Revenus (DH)</h2>
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
              <TrendingUp size={14}/> +{paidProjects.length} Projets payés
            </div>
          </div>
          
          <div className="w-full flex-1 min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData()} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#A3AED0', fontSize: 12, fontWeight: 'bold'}} 
                />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#A3AED0', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  itemStyle={{fontWeight: 'bold'}}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }}
                />
            
                <Line 
                  type="monotone" 
                  dataKey="Paid" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  name="Paid" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* List: Unpaid Projects */}
        <div className="bg-[#1B2559] p-8 rounded-[2.5rem] shadow-xl text-white h-[420px] flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <h2 className="text-lg font-bold">Encaissements à Venir</h2>
            <span className="text-xs font-bold text-orange-400">{unpaidProjects.length} Projets</span>
          </div>
          <div className="space-y-1 overflow-y-auto flex-1 custom-scrollbar">
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
            {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
        </p>
      </div>
    </div>
    <div className="text-right">
      <span className={`font-black text-sm ${dark ? 'text-white' : 'text-[#1B2559]'}`}>{project.budget} DH</span>
      {dark && <p className="text-[9px] text-orange-400 font-bold uppercase tracking-tighter">En attente</p>}
    </div>
  </div>
);