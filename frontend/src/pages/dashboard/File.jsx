import React, { useEffect, useRef, useState } from "react";
import {
  Upload,
  Trash2,
  FileText,
  Image,
  File,
} from "lucide-react";

const FILES_URL = "http://localhost:5000/api/files";
const PROJECTS_URL = "http://localhost:5000/api/projects";

function Files() {
  const [files, setFiles] = useState([]);
  const [projects, setProjects] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");

  const [loading, setLoading] = useState(true);

  // FILE INPUT REF
  const fileInputRef = useRef(null);

  // ================= FETCH FILES =================
  const fetchFiles = async () => {
    try {
      const res = await fetch(FILES_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= FETCH PROJECTS =================
  const fetchProjects = async () => {
    try {
      const res = await fetch(PROJECTS_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= LOAD =================
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      await fetchFiles();
      await fetchProjects();

      setLoading(false);
    };

    load();
  }, []);

  // ================= ICON =================
  const getIcon = (type) => {
    switch (type) {
      case "image":
        return <Image size={18} className="text-blue-500" />;

      case "application":
        return <FileText size={18} className="text-red-500" />;

      default:
        return <File size={18} className="text-gray-500" />;
    }
  };

  // ================= UPLOAD =================
const uploadFile = async () => {

  if (!selectedFile || !selectedProject) {
    return alert("Select file and project");
  }

  try {

    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("project", selectedProject);

    const res = await fetch(FILES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    console.log("STATUS:", res.status);

    const data = await res.json();

    console.log("DATA:", data);

    if (!res.ok) {
      return alert(data.message);
    }

    alert("Uploaded successfully");

    setSelectedFile(null);
    setSelectedProject("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    fetchFiles();

  } catch (err) {

    console.log("FRONT ERROR:", err);

    alert(err.message);
  }
};
  // ================= DELETE =================
  const deleteFile = async (id) => {
    if (!window.confirm("Delete this file?")) return;

    try {
      await fetch(`${FILES_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      fetchFiles();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= OPEN FILE =================
  const openFile = (file) => {
    window.open(file.url, "_blank");
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Files
        </h1>
      </div>

      {/* UPLOAD SECTION */}
      <div className="bg-white p-5 rounded-2xl shadow mb-6">

        <h2 className="font-semibold mb-4">
          Upload File
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          {/* FILE INPUT */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="border p-2 rounded-xl"
          />

          {/* PROJECT SELECT */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="border p-2 rounded-xl"
          >
            <option value="">
              Select Project
            </option>

            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>

          {/* UPLOAD BUTTON */}
          <button
            onClick={uploadFile}
            className="bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700"
          >
            <Upload size={18} />
            Upload
          </button>

        </div>
      </div>

      {/* FILES */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

          {files.map((file) => (
            <div
              key={file._id}
              onClick={() => openFile(file)}
              className="bg-white p-4 rounded-2xl shadow hover:shadow-md transition cursor-pointer"
            >

              {/* TOP */}
              <div className="flex justify-between items-center mb-3">

                <div className="flex items-center gap-2">

                  {getIcon(file.type)}

                  <span className="font-medium">
  {file.name.length > 25
    ? file.name.slice(0, 25) + "..."
    : file.name}
</span>

                </div>

                {/* DELETE */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFile(file._id);
                  }}
                  className="text-red-500 hover:bg-red-100 p-1 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>

              </div>

              {/* PROJECT */}
              <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
                {file.project?.title || "No project"}
              </span>

            </div>
          ))}

        </div>
      )}

      {/* EMPTY */}
      {!loading && files.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          No files uploaded yet
        </div>
      )}

    </div>
  );
}

export default Files;