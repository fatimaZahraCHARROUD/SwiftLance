import React, { useState, useEffect } from "react";

export default function Settings() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "developer",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          Profile Settings
        </h1>

        <form onSubmit={handleUpdateProfile} className="space-y-8">

          {/* Avatar Preview */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-100 shadow">
            
                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                  {formData.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
            
            </div>

             
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="freelancer">Freelancer</option>
              <option value="project_manager">Project Manager</option>
              <option value="marketer">Marketer</option>
              <option value="agency_owner">Agency Owner</option>
            </select>
          </div>

          {/* Message */}
          {message && (
            <div className="text-center text-sm font-medium text-blue-600">
              {message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}