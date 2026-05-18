import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  //return children(pages/components) inside it
  return children;
}

export default ProtectedRoute;