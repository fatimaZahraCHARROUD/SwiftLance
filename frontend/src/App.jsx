import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Public pages
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

// Dashboard pages
import Dashboard from "./pages/dashboard/Dashboard";
import Clients from "./pages/dashboard/Clients";
import Projects from "./pages/dashboard/Projects";

// Protected route
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css"
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 PUBLIC PART */}
        {/*<Route path="/" element={<PublicLayout />}>*/}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        {/*</Route>*/}

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
        </Route>

      </Routes> 
    </BrowserRouter>
  );
}

export default App;