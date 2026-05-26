import React, { useEffect, useRef, useState } from "react";
import {
  Upload,
  Trash2,
  FileText,
  Image,
  File,
} from "lucide-react";

const FILES_URL = import.meta.env.VITE_API_URL +"/api/files";
const PROJECTS_URL = import.meta.env.VITE_API_URL +"/api/projects";

function Files() {
  const [files, setFiles] = useState([]);
  const [projects, setProjects] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");
const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);
const [uploading, setUploading] = useState(false);
const [successMessage, setSuccessMessage] = useState("");
  // FILE INPUT REF
  const fileInputRef = useRef(null);

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

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      await fetchFiles();
      await fetchProjects();

      setLoading(false);
    };

    load();
  }, []);

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


  const uploadFile = async () => {

  if (!selectedFile || !selectedProject) {
    return alert("Select file and project");
  }

  try {

    setUploading(true);
    setSuccessMessage("");

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

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    setSuccessMessage("✅ File uploaded successfully");

    setSelectedFile(null);
    setSelectedProject("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    await fetchFiles();

    // hide success after 3 sec
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

  } catch (err) {

    console.log("FRONT ERROR:", err);

    alert(err.message);

  } finally {

    setUploading(false);

  }
};

const deleteFile = async (id) => {

  if (!window.confirm("Delete this file?")) return;

  try {

    setDeletingId(id);

    await fetch(`${FILES_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    await fetchFiles();

  } catch (err) {

    console.log(err);

  } finally {

    setDeletingId(null);

  }
};


  const openFile = (file) => {
    window.open(file.url, "_blank");
  };

   return (
    <div className="p-3 sm:p-4 md:p-6 min-h-screen ">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Files
        </h1>
      </div>

      {/* UPLOAD SECTION */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
        
        <h2 className="font-semibold text-lg mb-4 text-gray-700">
          Upload File
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* FILE INPUT */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="border border-gray-200 p-3 rounded-xl text-sm w-full"
          />

          {/* PROJECT SELECT */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="border border-gray-200 p-3 rounded-xl text-sm w-full"
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
{uploading && (
  <div className="text-sm text-blue-600 font-medium">
    Uploading file, please wait...
  </div>
)}

{successMessage && (
  <div className="text-sm text-green-600 font-medium">
    {successMessage}
  </div>
)}
          {/* BUTTON */}
          <button
  onClick={uploadFile}
  disabled={uploading}
  className={`rounded-xl flex items-center justify-center gap-2 transition-all py-3 font-medium w-full text-white
  ${
    uploading
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {uploading ? (
    <>
      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Uploading...
    </>
  ) : (
    <>
      <Upload size={18} />
      Upload
    </>
  )}
</button>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500 text-lg">
            Loading...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          
          {files.map((file) => (
            <div
              key={file._id}
              onClick={() => openFile(file)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
            >

              {/* TOP */}
              <div className="flex justify-between items-start gap-3 mb-4">

                {/* LEFT */}
                <div className="flex items-start gap-3 flex-1 min-w-0">

                  <div className="mt-1">
                    {getIcon(file.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 text-sm sm:text-base break-words">
                      {file.name.length > 35
                        ? file.name.slice(0, 35) + "..."
                        : file.name}
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      Click to open
                    </p>
                  </div>
                </div>

                {/* DELETE */}
               <button
  onClick={(e) => {
    e.stopPropagation();
    deleteFile(file._id);
  }}
  disabled={deletingId === file._id}
  className={`p-2 rounded-lg transition
  ${
    deletingId === file._id
      ? "bg-gray-100 cursor-not-allowed"
      : "text-red-500 hover:bg-red-100"
  }`}
>
  {deletingId === file._id ? (
    <div className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
  ) : (
    <Trash2 size={16} />
  )}
</button>
              </div>

              {/* PROJECT */}
              <div className="flex items-center justify-between">
                <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full truncate max-w-full">
                  {file.project?.title || "No project"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && files.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md mx-auto">
            <File size={50} className="mx-auto text-gray-300 mb-4" />

            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No files uploaded
            </h3>

            <p className="text-gray-400 text-sm">
              Upload your first file to start managing documents.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Files;