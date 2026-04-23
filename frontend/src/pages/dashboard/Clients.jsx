import React from 'react';

const clientsData = [
  { id: 1, name: "Sami Mansouri", email: "sami@example.com", projects: 3 },
  { id: 2, name: "Meryem Alami", email: "meryem@dev.com", projects: 1 },
  { id: 3, name: "Tech Solutions", email: "contact@tech.ma", projects: 5 },
];

export default function Clients() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-bold text-slate-800">My Clients</h2>
        <button className="bg-[#3327db] text-white px-6 py-2 rounded-xl hover:bg-opacity-90 shadow-lg transition">+ Add Client</button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold text-center">Projects</th>
              <th className="p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clientsData.map((client) => (
              <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-700">{client.name}</td>
                <td className="p-4 text-slate-500 text-sm">{client.email}</td>
                <td className="p-4 text-center">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                    {client.projects}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-[#3327db] font-semibold text-sm hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}