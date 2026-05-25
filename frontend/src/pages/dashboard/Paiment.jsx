import React, { useState, useEffect } from 'react';
// Importation des icônes vectorielles depuis la bibliothèque 'lucide-react'
import { 
  DollarSign,   // Illustre les montants financiers (ex: budget du projet).
  Calendar,     // Représente les dates (création ou lancement).
  TrendingUp,   // Illustre la croissance et les revenus encaissés.
  CheckCircle,  // Valide un succès (ex: le taux de recouvrement).
  Clock,        // Symbolise l'attente (ex: factures en attente).
  PieChart,     // Utilisé pour les aspects visuels liés aux statistiques.
  Wallet,       // Icône de portefeuille pour l'en-tête financier.
  ArrowUpRight  // Flèche d'action pour indiquer un lien ou une ouverture.
} from 'lucide-react';

// =========================================================================
// 2. IMPORTATION DU GRAPHIQUE (RECHARTS)
// Recharts utilise des composants React pour assembler un graphique en blocs.
// =========================================================================
import { 
  LineChart,         // Le conteneur principal du graphique linéaire.
  Line,              // Trace la courbe des données (la ligne verte).
  XAxis,             // Gère l'Axe Horizontal (les mois de l'année).
  YAxis,             // Gère l'Axe Vertical (les montants en DH).
  CartesianGrid,     // Dessine la grille/quadrillage en arrière-plan.
  Tooltip,           // Affiche la bulle d'info au survol de la souris (hover).
  Legend,            // Affiche la légende en bas ("Paid").
  ResponsiveContainer  // Rend le graphique 100% responsive (s'adapte à l'écran).
} from 'recharts';

export default function PaymentDashboard() {
  // 1. Les États (States)
  const [projects, setProjects] = useState([]); 
  const [loading, setLoading] = useState(true);  

  // 2. Le cycle de vie (useEffect) : S'exécute uniquement au chargement initial de la page
  useEffect(() => {
    const fetchProjects = async () => {
      try {
   
        const res = await fetch(import.meta.env.VITE_API_URL +'/api/projects', {
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

  // 3. Filtrage des données (Logique financière)
  
  const paidProjects = projects.filter(p => p.paye === true);
   const unpaidProjects = projects.filter(p => p.paye === false);
  
  // 4. Calcul des Totaux (via la méthode .reduce)
   const totalIncome = paidProjects.reduce((acc, curr) => acc + (curr.budget || 0), 0);
   const pendingIncome = unpaidProjects.reduce((acc, curr) => acc + (curr.budget || 0), 0);

  // 5. Préparation des données pour le Graphique (Répartition Mensuelle)
  const getChartData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
     return months.map((month, index) => {
      // Filtrer les projets payés spécifiques à ce mois et additionner leur budget
      const totalPaidForMonth = paidProjects
        .filter(p => {
          const dateStr = p.startDate || p.createdAt; // Récupération de la date disponible
          if (!dateStr) return false;

          // Découpage de la date (ex: "2026-03-15" devient ["2026", "03", "15"])
          const dateParts = dateStr.split('T')[0].split('-');
          if (dateParts.length < 2) return false;

          // parseInt convertit le texte du mois en nombre, et "- 1" aligne avec l'index du tableau (0-11)
          const projectMonthIndex = parseInt(dateParts[1], 10) - 1;
          
          return projectMonthIndex === index; // Retourne vrai si le projet appartient au mois en cours de traitement
        })
        .reduce((acc, p) => acc + (Number(p.budget) || 0), 0); // Somme des budgets du mois concerné

      // Recharts requiert ce format spécifique pour chaque point : { name: "Mois", Paid: Montant }
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

  // 7. Rendu de l'Interface Principale
  return (
    <div className="p-8 space-y-8 bg-white min-h-screen font-sans">
      
      {/* En-tête de la page (Rapport Financier) */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-[900] text-[#1B2559] tracking-tight">Financial Report</h1>
          <p className="text-[#A3AED0] font-medium text-sm">Visualization of earnings and outstanding invoices.</p>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-white">
          <Wallet className="text-blue-600" size={24} />
        </div>
      </div>

      {/* Grille des 3 Cartes Statistiques (Total Encaissé, En attente, Taux de recouvrement) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carte : Total Encaissé */}
        <StatCard title="Total Collected" amount={totalIncome} color="bg-emerald-500" icon={<TrendingUp className="text-white" size={20}/>} />
        {/* Carte : Montant en Attente */}
        <StatCard title="Pending Amount" amount={pendingIncome} color="bg-orange-400" icon={<Clock className="text-white" size={20}/>} />
        {/* Carte : Taux de recouvrement (Calcul du pourcentage : (payés / total) * 100) */}
        <StatCard title="Collection Rate" amount={`${projects.length > 0 ? Math.round((paidProjects.length / projects.length) * 100) : 0}%`} color="bg-blue-600" icon={<CheckCircle className="text-white" size={20}/>} />
      </div>

      {/* Grille contenant le Graphique et la Liste des projets non payés */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Le Graphique d'Évolution des Revenus (LineChart) */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white h-[420px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-black text-[#1B2559]">Revenue Trend (DH)</h2>
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
              <TrendingUp size={14}/> +{paidProjects.length} Paid projects
            </div>
          </div>
          
          {/* ResponsiveContainer : Permet au graphique de s'adapter dynamiquement à la largeur de la carte */}
          <div className="w-full flex-1 min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              {/* Injection des données formatées par la fonction getChartData() */}
              <LineChart data={getChartData()} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                {/* CartesianGrid : Lignes de fond horizontales uniquement (vertical={false}) */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                {/* XAxis : Axe horizontal représentant le nom des mois */}
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#A3AED0', fontSize: 12, fontWeight: 'bold'}} />
                {/* YAxis : Axe vertical représentant l'échelle des montants des budgets */}
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#A3AED0', fontSize: 10}} />
                {/* Tooltip : Bulle d'information stylisée qui apparaît au survol (hover) d'un point */}
                <Tooltip contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} itemStyle={{fontWeight: 'bold'}} />
                {/* Legend : Légende explicative située en bas (ex: Point vert "Paid") */}
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
                {/* Line : Configuration de la courbe (Lissage monotone, couleur émeraude, épaisseur 4px) */}
                <Line type="monotone" dataKey="Paid" stroke="#10b981" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Paid" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section de droite : Liste des projets non payés (Entrées à venir) */}
        <div className="bg-[#1B2559] p-8 rounded-[2.5rem] shadow-xl text-white h-[420px] flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <h2 className="text-lg font-bold">Upcoming Inflow</h2>
            <span className="text-xs font-bold text-orange-400">{unpaidProjects.length} Projects</span>
          </div>
          {/* Défilement vertical actif si la liste contient beaucoup d'éléments */}
          <div className="space-y-1 overflow-y-auto flex-1 custom-scrollbar">
            {/* .map pour afficher chaque projet non payé sous forme de ligne réutilisable FinanceItem */}
            {unpaidProjects.map(p => <FinanceItem key={p._id} project={p} dark={true} />)}
            {/* Condition : Si aucun projet n'est en attente de paiement, afficher un message de succès */}
            {unpaidProjects.length === 0 && <p className="text-center text-white/30 py-10 text-sm italic">All payments settled.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}

// =========================================================================
// 8. SOUS-COMPOSANT REUTILISABLE : StatCard
// Génère de manière propre l'une des 3 cartes d'indicateurs du haut de page.
// =========================================================================
const StatCard = ({ title, amount, color, icon }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-white">
    <div className="flex items-center gap-4 mb-4">
      <div className={`${color} p-3 rounded-2xl shadow-lg flex items-center justify-center`}>
        {icon}
      </div>
      <span className="text-xs font-black uppercase text-[#A3AED0] tracking-widest">{title}</span>
    </div>
    {/* Condition : Si le montant est un nombre, on ajoute l'unité 'DH'. Si c'est du texte (taux %), on n'affiche rien */}
    <div className="text-3xl font-black text-[#1B2559]">{amount} <span className="text-sm font-medium">{typeof amount === 'number' ? 'DH' : ''}</span></div>
  </div>
);

// =========================================================================
// 9. SOUS-COMPOSANT REUTILISABLE : FinanceItem
// Représente une ligne unique de projet à l'intérieur de la liste des impayés.
// =========================================================================
const FinanceItem = ({ project, dark }) => (
  <div className={`py-4 px-2 flex justify-between items-center transition-all ${dark ? 'border-b border-white/5' : 'border-b border-gray-50'} last:border-none rounded-xl`}>
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-400'}`}>
         <DollarSign size={18} />
      </div>
      <div>
        {/* Titre du projet */}
        <h4 className={`font-bold text-sm ${dark ? 'text-white' : 'text-[#1B2559]'}`}>{project.title}</h4>
        {/* Affichage de la date convertie au format local de lecture (ex: DD/MM/YYYY) */}
        <p className={`text-[10px] font-medium opacity-50 ${dark ? 'text-white' : 'text-[#A3AED0]'}`}>
            {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
        </p>
      </div>
    </div>
    <div className="text-right">
      {/* Affichage du budget alloué */}
      <span className={`font-black text-sm ${dark ? 'text-white' : 'text-[#1B2559]'}`}>{project.budget} DH</span>
      {/* Badge orange "Pending" indicatif du statut de paiement bloqué */}
      {dark && <p className="text-[9px] text-orange-400 font-bold uppercase tracking-tighter">Pending</p>}
    </div>
  </div>
);