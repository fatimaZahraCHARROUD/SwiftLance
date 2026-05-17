import React, { useEffect, useState } from 'react';
import { Trash2, Edit, UserPlus, Building2, User, X } from 'lucide-react';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingClient, setEditingClient] = useState(null); 9

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    type: 'Individual' 
  });

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/clients', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (err) {
      console.error("Erreur fetching clients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleEditClick = (client) => {
    setEditingClient(client);
    setFormData({
      fullName: client.fullName || client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      type: client.type || 'Individual'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      
      const url = editingClient 
        ? `http://localhost:5000/api/clients/${editingClient._id}` 
        : 'http://localhost:5000/api/clients';
      
      const method = editingClient ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEditingClient(null);
        setFormData({ fullName: '', email: '', phone: '', address: '', type: 'Individual' });
        fetchClients();
      } else {
        const errorData = await response.json();
        alert("Erreur: " + (errorData.message || "Action impossible"));
      }
    } catch (err) {
      alert("Erreur réseau");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteClient = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchClients();
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full p-10">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3327db]"></div>
    </div>
  );

  return (
    <div className="p-6 relative animate-in fade-in duration-500">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">My Clients</h2>
          <p className="text-slate-500 text-sm">Manage your customer relationships and details.</p>
        </div>
        <button 
          onClick={() => {
            setEditingClient(null);
            setFormData({ fullName: '', email: '', phone: '', address: '', type: 'Individual' });
            setIsModalOpen(true);
          }}
          className="bg-[#3327db] text-white px-5 py-2.5 rounded-xl hover:bg-opacity-90 shadow-lg shadow-blue-200 transition flex items-center gap-2 font-semibold"
        >
          <UserPlus size={18} /> Add Client
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">
                {editingClient ? 'Edit Client' : 'New Client Info'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition">
                <X size={20}/>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1 ml-1">Full Name</label>
                <input 
                  type="text" required
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1 ml-1">Email Address</label>
                <input 
                  type="email" required
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1 ml-1">Client Type</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Individual">Individual</option>
                  <option value="Company">Company</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1 ml-1">Phone</label>
                  <input 
                    type="text"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1 ml-1">City/Address</label>
                  <input 
                    type="text"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-[#3327db] shadow-lg shadow-blue-100 disabled:bg-slate-300 transition"
                >
                  {isSubmitting ? "Saving..." : (editingClient ? "Update Client" : "Save Client")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-widest font-bold">
              <th className="p-5">Client Name</th>
              <th className="p-5">Type</th>
              <th className="p-5">Contact</th>
              <th className="p-5 text-center">Address</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {clients.length > 0 ? (
              clients.map((client) => (
                <tr key={client._id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#3327db]">
                        {client.type === 'Company' ? <Building2 size={18} /> : <User size={18} />}
                      </div>
                      <span className="font-bold text-slate-700">{client.fullName || client.name}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      client.type === 'Company' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {client.type || "Individual"}
                    </span>
                  </td>
                  <td className="p-5 text-sm">
                    <div className="text-slate-600 font-medium">{client.email}</div>
                    <div className="text-slate-400 text-xs">{client.phone || "No phone"}</div>
                  </td>
                  <td className="p-5 text-center">
                    <span className="text-slate-500 text-sm italic">{client.address || "---"}</span>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditClick(client)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => deleteClient(client._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-20 text-center text-slate-400">
                  <p>Aucun client trouvé.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}