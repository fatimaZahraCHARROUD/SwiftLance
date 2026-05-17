import React, { useState, useEffect } from "react";
import { User, Mail, Briefcase, CheckCircle, AlertCircle } from "lucide-react";

export default function Settings() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "developer",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("userName") || "";
    const savedEmail = localStorage.getItem("userEmail") || "";
    const savedRole = localStorage.getItem("userRole") || "developer";

    setFormData({
      fullName: savedName,
      email: savedEmail,
      role: savedRole,
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/users/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            role: formData.role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Update failed");
        setIsError(true);
        setLoading(false);
        return;
      }

      localStorage.setItem("userName", data.fullName);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userRole", data.role || "developer");

      setMessage("Profile updated successfully ✅");
      window.location.reload();
    } catch (error) {
      setMessage("Server error ❌");
      setIsError(true);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans pb-16 pt-12">
      <div className="w-full max-w-2xl px-12 mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-[900] text-[#1B2559] tracking-tight">
              Profile Settings
            </h1>
            <p className="text-[#A3AED0] font-medium text-sm">
              Manage your personal information and account options.
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            
            {/* Avatar Generation */}
            <div className="flex flex-col items-center justify-center pb-4 border-b border-slate-100">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-50 shadow-sm">
                <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-black">
                  {formData.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all text-sm text-slate-900 font-semibold placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all text-sm text-slate-900 font-semibold placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Professional Role */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Professional Role
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all text-sm text-slate-900 font-semibold"
                >
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="project_manager">Project Manager</option>
                  <option value="marketer">Marketer</option>
                  <option value="agency_owner">Agency Owner</option>
                </select>
              </div>
            </div>

            {/* Dynamic Alerts */}
            {message && (
              <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${
                isError ? "bg-red-50 text-red-900 border border-red-100" : "bg-emerald-50 text-emerald-900 border border-emerald-100"
              }`}>
                {isError ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                <span>{message}</span>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-xl font-bold shadow-sm active:scale-[0.99] transition-all text-sm flex items-center justify-center gap-2"
              >
                {loading ? "Saving changes..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}