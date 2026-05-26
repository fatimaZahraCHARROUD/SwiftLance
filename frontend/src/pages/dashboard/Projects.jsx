import React, { useEffect, useState, useRef } from "react";
import { Pencil, Trash2, Plus, X, Info, File } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL +"/api/projects";
const CLIENTS_URL = import.meta.env.VITE_API_URL +"/api/clients";
const NOTES_URL = import.meta.env.VITE_API_URL +"/api/notes";
const TASKS_URL = import.meta.env.VITE_API_URL +"/api/tasks";
const FILES_URL = import.meta.env.VITE_API_URL +"/api/files";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
 
  const [detailsOpen, setDetailsOpen] = useState(false);
const [selectedProject, setSelectedProject] = useState(null);

const [projectNotes, setProjectNotes] = useState([]);
const [projectTasks, setProjectTasks] = useState([]);

const [projectFiles, setProjectFiles] = useState([]);
const [filesOpen, setFilesOpen] = useState(false);
const [fileFormOpen, setFileFormOpen] = useState(false);
const [uploading, setUploading] = useState(false);
const fileInputRef = useRef(null);
const [selectedFile, setSelectedFile] = useState(null);

const [expandedNote, setExpandedNote] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "planning",
    budget: 0,
    paye:false,
    startDate: "",
    endDate: "",
    client: "",
  });

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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchProjects();
      await fetchClients();
      setLoading(false);
    };
    load();
  }, []);

  const fetchProjectFiles = async (projectId) => {
  const res = await fetch(`${FILES_URL}/project/${projectId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();
  setProjectFiles(data);
};

//files 
const uploadProjectFile = async () => {
  if (!selectedFile || !selectedProject) {
    return alert("Select file");
  }

  setUploading(true); // 🔥 START LOADING

  try {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("project", selectedProject._id);

    const res = await fetch(FILES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) return alert(data.message);

    // reset
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    await fetchProjectFiles(selectedProject._id);

  } finally {
    setUploading(false); // 🔥 STOP LOADING
  }
};

const deleteProjectFile = async (id) => {
  if (!window.confirm("Delete file?")) return;

  await fetch(`${FILES_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  fetchProjectFiles(selectedProject._id);
};

const openFiles = async (project) => {
  setSelectedProject(project);
  await fetchProjectFiles(project._id);
  setFilesOpen(true);
};


const handleChange = (e) => {
  const { name, value } = e.target;

  setForm({
    ...form,
    [name]: //ex: paye:true
      name === "paye"
        ? value === "true"
        : value,
  });
};

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      status: "planning",
      budget: 0,
      paye: false,
      startDate: "",
      endDate: "",
      client: "",
    });
  };

  const openAdd = () => {
    resetForm();
    setEditMode(false);
    setIsModalOpen(true);
  };

  const openEdit = (p,id) => {
    console.log(p._id);
    setForm({
      title: p.title,
      description: p.description,
      status: p.status,
      budget: p.budget,
      paye: p.paye || false,
      startDate: p.startDate?.split("T")[0] || "", //"2026-05-17T10:30:00.000Z"
      endDate: p.endDate?.split("T")[0] || "",
      client: p.client?._id || "",
    });

    setSelectedId(p._id);
    setEditMode(true);
    setIsModalOpen(true);
  };


  const openInfo = async (project) => {

    setSelectedProject(project);

    try {

       const notesRes = await fetch(
        `${NOTES_URL}/project/${project._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const notesData = await notesRes.json();

      // ===== FETCH TASKS =====
      const tasksRes = await fetch(TASKS_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const tasksData = await tasksRes.json();

      // FILTER TASKS OF THIS PROJECT
      const filteredTasks = tasksData.filter(
        (task) => task.projectId?._id === project._id
      );

      setProjectNotes(notesData);
      setProjectTasks(filteredTasks);

      setDetailsOpen(true);

    } catch (err) {
      console.log(err);
    }
  };

  const toggleTaskStatus = async (task) => {
  await fetch(`${TASKS_URL}/${task._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      ...task,
      status: task.status === "done" ? "in_progress" : "done",
    }),
  });

  openInfo(selectedProject); // refresh details
};

const deleteTask = async (id) => {
  await fetch(`${TASKS_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  openInfo(selectedProject); // refresh details
};


const createProject = async () => {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });

    setIsModalOpen(false);
    resetForm();
    fetchProjects();
  };


  const updateProject = async () => {
    await fetch(`${API_URL}/${selectedId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });

    setIsModalOpen(false);
    setEditMode(false);
    setSelectedId(null);
    resetForm();
    fetchProjects(); // 🔥 IMPORTANT FIX
  };


  const deleteProject = async (id) => {
    if (!confirm("Delete this project?")) return;

    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    fetchProjects();
  };


  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => p.status === filter);


      const statusBadge = (status) => {
    const styles = {
      planning: "bg-yellow-100 text-yellow-600",
      in_progress: "bg-blue-100 text-blue-600",
      done: "bg-green-100 text-green-600",
    };

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Projects</h2>

        <button
          onClick={openAdd}
          className="bg-[#3327db] text-white px-4 py-2 rounded-xl flex gap-2"
        >
          <Plus /> Add
        </button>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex gap-3 mb-6">
        {["all", "planning", "in_progress", "done"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 rounded-full text-sm border ${
              filter === tab ? "bg-black text-white" : "bg-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ================= GRID ================= */}
      {loading ? (

  <div className="min-h-[400px] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
  </div>

) : filteredProjects.length === 0 ? (

  <div className="min-h-[300px] flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100">
    
    <div className="text-6xl mb-4">
      📁
    </div>

    <h3 className="text-xl font-bold text-gray-700 mb-2">
      No projects found
    </h3>

    <p className="text-gray-400 text-sm mb-5">
      Start by creating your first project
    </p>

    <button
      onClick={openAdd}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl transition"
    >
      + Create Project
    </button>

  </div>

) : (

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">    {filteredProjects.map((p) => (
            <div key={p._id} className="bg-white p-5 rounded-xl shadow relative">

              {/* ACTIONS TOP RIGHT */}
              <div className="absolute top-3 right-3 flex gap-2">
                <button onClick={() => openEdit(p,p._id)}>
                  <Pencil size={16} className="text-blue-500" />
                </button>

                <button onClick={() => deleteProject(p._id)}>
                  <Trash2 size={16} className="text-red-500" />
                </button>

                <button onClick={() => openInfo(p)}>
                  <Info size={16} className="text-gray-500" />
                </button>
                <button
                  onClick={() => openFiles(p)}
                >
                  <File size={18} className="text-gray-500" />
                </button>
              </div>

              <h3 className="font-bold text-lg">{p.title}</h3>

              <p className="text-sm text-gray-500">
                Client: {p.client?.fullName || "N/A"}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                {p.description}
              </p>

              <p className="text-sm mt-2">💰 {p.budget} DH</p>

              <p className="text-xs text-gray-400">
                📅 {p.startDate?.split("T")[0]} → {p.endDate?.split("T")[0]}
              </p>

              <div className="mt-3">{statusBadge(p.status)}</div>
              <div className="mt-2">
                {p.paye ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                    💰 Payé
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                    ❌ Non Payé
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {isModalOpen && (
  <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto">
    
    <div className="min-h-screen flex justify-center px-4 py-6 sm:ml-64">
      
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-4 sm:p-6 relative h-fit">
        
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-3 right-3"
        >
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4">
          {editMode ? "Update" : "Add"} Project
        </h2>
        Title
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded-lg"
          placeholder="Title"
        />
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded-lg"
        />
        Status
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded-lg"
        >
          <option value="planning">Planning</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        Budget
        <input
          type="number"
          name="budget"
          value={form.budget}
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded-lg"
        />

        <select
          name="paye"
          value={form.paye}
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded-lg"
        >
          <option value={false}>Non Payé</option>
          <option value={true}>Payé</option>
        </select>
        Start Day
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded-lg"
        />
        End Day
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded-lg"
        />
        Client
        <select
          name="client"
          value={form.client}
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded-lg"
        >
          <option value="">Select Client</option>

          {clients.map((c) => (
            <option key={c._id} value={c._id}>
              {c.fullName}
            </option>
          ))}
        </select>

        <button
          onClick={editMode ? updateProject : createProject}
          className="w-full bg-[#3327db] text-white py-2 rounded-lg"
        >
          {editMode ? "Update" : "Create"}
        </button>

      </div>
    </div>
  </div>
)}

{filesOpen && selectedProject && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white w-[600px] p-6 rounded-2xl relative">

      <button
        onClick={() => setFilesOpen(false)}
        className="absolute top-3 right-3"
      >
        <X />
      </button>

      <h2 className="text-xl font-bold mb-4">
        Files - {selectedProject.title}
      </h2>

      {/* UPLOAD */}
      <div className="flex gap-2 mb-4">
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="border p-2 flex-1"
        />

    <button
  onClick={uploadProjectFile}
  disabled={uploading}
  className="bg-blue-600 text-white px-4 rounded flex items-center justify-center gap-2"
>
  {uploading ? "Uploading..." : "Add"}
</button>

      </div>

      {/* LIST */}
      <div className="space-y-2">
        {projectFiles.length === 0 ? (
          <p className="text-gray-400">No files</p>
        ) : (
          projectFiles.map((f) => (
            <div
              key={f._id}
              className="flex justify-between items-center bg-gray-50 p-2 rounded"
            >
              <a
                href={f.url}
                target="_blank"
                className="text-sm text-blue-600"
              >
                {f.name.length > 20 ? f.name.slice(0, 20) + "..." : f.name}
              </a>

              <button
                onClick={() => deleteProjectFile(f._id)}
                className="text-red-500 text-xs"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
)}

      {/* ================= DETAILS MODAL ================= */}
      {detailsOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[700px] max-h-[90vh] overflow-y-auto p-6 rounded-2xl relative shadow-2xl">

            {/* CLOSE */}
            <button
              onClick={() => setDetailsOpen(false)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            {/* TITLE */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-slate-800">
                {selectedProject.title}
              </h2>

              <div className="mt-2">
                {statusBadge(selectedProject.status)}
              </div>
            </div>

            {/* PROJECT INFO */}
            <div className="grid grid-cols-2 gap-4 mb-6">

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-gray-400">Client</p>

                <p className="font-semibold">
                  {selectedProject.client?.fullName || "N/A"}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-gray-400">Budget</p>

                <p className="font-semibold">
                  {selectedProject.budget} DH
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-gray-400">Paiement</p>

                <p className="font-semibold">
                  {selectedProject.paye ? "💰 Payé" : "❌ Non Payé"}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-gray-400">Start Date</p>

                <p className="font-semibold">
                  {selectedProject.startDate?.split("T")[0] || "N/A"}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-gray-400">Deadline</p>

                <p className="font-semibold">
                  {selectedProject.endDate?.split("T")[0] || "N/A"}
                </p>
              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">
                Description
              </h3>

              <div className="bg-slate-50 p-4 rounded-xl text-slate-700">
                {selectedProject.description || "No description"}
              </div>
            </div>

            {/* NOTES */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">
                Notes
              </h3>

              <div className="space-y-3">

                {projectNotes.length > 0 ? (
                  projectNotes.map((note) => (
                    <div
                      key={note._id}
                      className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl"
                    >
                      <div className="flex justify-between items-center">
  <h4 className="font-semibold">{note.title}</h4>

  <button
    onClick={() =>
      setExpandedNote(expandedNote === note._id ? null : note._id)
    }
    className="text-blue-500 text-xs"
  >
    Details
  </button>
</div>

{expandedNote === note._id && (
  <p className="text-sm text-gray-600 mt-2">
    {note.content}
  </p>
)}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">
                    No notes found.
                  </p>
                )}

              </div>
            </div>

            {/* TASKS */}
            <div>
              <h3 className="font-bold text-lg mb-3">
                Tasks
              </h3>

              <div className="space-y-3">

                {projectTasks.length > 0 ? (
                  projectTasks.map((task) => (
                    <div
                      key={task._id}
                      className="bg-blue-50 border border-blue-100 p-4 rounded-xl"
                    >
                     <div className="flex justify-between items-center">

  {/* LEFT: checkbox + title */}
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={task.status === "done"}
      onChange={() => toggleTaskStatus(task)}
    />

    <span className={task.status === "done" ? "line-through" : ""}>
      {task.title}
    </span>
  </label>

  {/* RIGHT: status + delete */}
  <div className="flex items-center gap-2">

    <span className="text-xs px-2 py-1 rounded-full bg-white">
      {task.status}
    </span>

    <button
       onClick={() => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(task._id);
    }
  }}
      className="text-red-500 text-xs px-2 py-1 rounded-full hover:bg-red-100"
    >
      Delete
    </button>

  </div>

</div>

                      

                      <div className="flex gap-3 mt-3 text-xs text-gray-500">

                        <span>
                          Priority: {task.priority}
                        </span>

                        <span>
                          Due: {task.dueDate?.split("T")[0] || "N/A"}
                        </span>

                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">
                    No tasks found.
                  </p>
                )}

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Projects;