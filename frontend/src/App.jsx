import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";


// Public pages
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";

// Dashboard pages
import Dashboard from "./pages/dashboard/Dashboard";
import Clients from "./pages/dashboard/Clients";
import Projects from "./pages/dashboard/Projects";
import Paiment from "./pages/dashboard/Paiment";
import  Note from "./pages/dashboard/Note";
import Tasks from "./pages/dashboard/Tasks";
import Planning from "./pages/dashboard/Planning";
import Notification from "./pages/dashboard/Notification";
// Protected route
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css"
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 PUBLIC PART */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* 🔐 PRIVATE PART */}
         <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="projects" element={<Projects />} />
          
          <Route path="note" element={<Note />} />
          <Route path="paiment" element={<Paiment />} />
          <Route path="planning" element={<Planning />} />
          <Route path="tasks" element={<Tasks />} />
            <Route path="notification" element={<Notification />} />
        </Route>

      </Routes> 
    </BrowserRouter>
  );
}

export default App;