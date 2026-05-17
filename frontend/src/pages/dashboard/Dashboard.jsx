import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/projects";
const CLIENTS_URL = "http://localhost:5000/api/clients";
const TASKS_URL = "http://localhost:5000/api/tasks";

export default function Dashboard() {
  const navigate = useNavigate();
const [projects, setProjects] = useState([]);
const [clients, setClients] = useState([]);
const [tasks, setTasks] = useState([]);

const fetchProjects = async () => {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();
  setProjects(data);
};

const fetchClients = async () => {
  const res = await fetch(CLIENTS_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();
  setClients(data);
};
const fetchTasks = async () => {
  const res = await fetch(TASKS_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();
  setTasks(data);
};
const toggleTaskStatus = async (task) => {
  const newStatus = task.status === "done" ? "in_progress" : "done";

  await fetch(`${TASKS_URL}/${task._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      ...task,
      status: newStatus,
    }),
  });

  fetchTasks(); // refresh dashboard
};
useEffect(() => {
  fetchProjects();
  fetchClients();
  fetchTasks();

}, []);



  const totalProjects = projects.length;
const totalClients = clients.length;

const paidProjects = projects.filter((p) => p.paye === true).length;
const unpaidProjects = projects.filter((p) => !p.paye).length;

const stats = [
  {
    title: "Total Projects",
    value: totalProjects,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Total Clients",
    value: totalClients,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    title: "Paid Projects",
    value: paidProjects,
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Unpaid Projects",
    value: unpaidProjects,
    color: "bg-red-100 text-red-700",
  },
];
const getDeadlineColor = (date) => {
  const diffDays = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 3) return "text-red-500";
  if (diffDays <= 7) return "text-orange-500";
  return "text-green-500";
};
 

 const today = new Date();

const deadlines = projects
  .filter((p) => p.endDate) // only projects with deadline
  .filter((p) => p.status !== "done") // ignore finished projects
  .map((p) => ({
    project: p.title,
    date: new Date(p.endDate),
  }))
  .filter((p) => p.date >= today) // only future deadlines
  .sort((a, b) => a.date - b.date) // nearest first
  .slice(0, 5); // top 5



const revenuePaidByMonth = Array(12).fill(0);
const revenueUnpaidByMonth = Array(12).fill(0);

projects.forEach((p) => {
  if (!p.startDate) return;

  const month = new Date(p.startDate).getMonth();
  const amount = p.budget || 0;

  if (p.paye === true) {
    revenuePaidByMonth[month] += amount;
  } else {
    revenueUnpaidByMonth[month] += amount;
  }
});

const maxRevenue = Math.max(
  ...revenuePaidByMonth,
  ...revenueUnpaidByMonth,
  1
);

  const progressProjects = [
    {
      title: "E-commerce Website",
      progress: 80,
    },
    {
      title: "Delivery App",
      progress: 55,
    },
    {
      title: "CRM Platform",
      progress: 35,
    },
  ];

  const yAxisSteps = 5;
const stepValue = maxRevenue / yAxisSteps;
const yLabels = Array.from({ length: yAxisSteps + 1 }, (_, i) =>
  Math.round(stepValue * i)
).reverse();



  return (
    <div className="min-h-screen p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Welcome back 👋
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => navigate("/app/projects")}
            className="bg-[#3327db] text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition"
          >
            + Add Project
          </button>

          <button
            onClick={() => navigate("/app/clients")}
            className="bg-white px-5 py-2 rounded-xl shadow hover:bg-gray-50 transition"
          >
            + Add Client
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition"
          >
            <div
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${stat.color}`}
            >
              {stat.title}
            </div>

            <h2 className="text-3xl font-bold text-slate-800">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* GRID */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* REVENUE */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-bold text-slate-800">
      Revenue Analytics
    </h2>
    <span className="text-sm text-gray-400">Paid vs Unpaid</span>
  </div>

  <div className="flex">
    {/* Y AXIS */}
    <div className="flex flex-col justify-between h-64 pr-3 text-xs text-gray-400">
      {yLabels.map((val, i) => (
        <span key={i}>{val}</span>
      ))}
    </div>

    {/* CHART AREA */}
    <div className="flex-1">
<div className="h-64 flex items-end gap-3 border-l border-b border-gray-200 pl-3 pb-2 relative">        {revenuePaidByMonth.map((paid, index) => {
          const unpaid = revenueUnpaidByMonth[index];

          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              {/* Bars */}
              <div className="flex items-end gap-1 w-full h-full">
                
                {/* Paid */}
                <div
                  className="flex-1 bg-green-500 rounded-t-md"
                  style={{
                    height: `${(paid / maxRevenue) * 200}px`,                  }}
                  title="Paid"
                />

                {/* Unpaid */}
                <div
                  className="flex-1 bg-red-500 rounded-t-md"
                  style={{
                    height: `${(unpaid / maxRevenue) * 200}px`,
                  }}
                  title="Unpaid"
                />
              </div>

              {/* X axis (months) */}
              <span className="text-xs text-gray-500 mt-2">
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][index]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  </div>

  {/* LEGEND */}
  <div className="flex gap-4 mt-4 text-sm">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-green-500 rounded"></div>
      <span>Paid</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-red-500 rounded"></div>
      <span>Unpaid</span>
    </div>
  </div>
</div>

          

         
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* TASKS */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-slate-800">
                Tasks
              </h2>

              <button   onClick={() => navigate("/app/tasks")}className="text-sm text-[#3327db] font-medium">
                View All
              </button>
            </div>

            <div className="space-y-4">
             {tasks
                .filter((task) => task.status !== "done")
                .slice(0, 5)
                .map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-50 p-4 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.status === "done"}
                      onChange={() => toggleTaskStatus(task)}
                    />

                    <span className="text-slate-700 font-medium">
                      {task.title}
                    </span>
                  </div>

                  <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    task.status === "done"
                      ? "bg-green-100 text-green-600"
                      : task.status === "in_progress"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {task.status}
                </span>
                </div>
              ))}
            </div>
          </div>

          {/* DEADLINES */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-5">
              Upcoming Deadlines
            </h2>

            <div className="space-y-4">
              {deadlines.map((deadline, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-3 last:border-none"
                >
                  <div>
                    <p className="font-medium text-slate-700">
                      {deadline.project}
                    </p>

                    <p className={`text-sm ${getDeadlineColor(deadline.date)}`}>                      {deadline.date.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}  
                    </p>
                  </div>

                  <button className="text-sm text-[#3327db] font-medium"   onClick={() => navigate(`/app/projects`)} >
                    Details
                  </button>
                </div>
              ))}
            </div>
          </div>

         

          
        </div>
       
      </div>
    </div>
  );
}
