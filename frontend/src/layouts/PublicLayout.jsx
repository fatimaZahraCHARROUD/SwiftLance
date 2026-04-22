import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function PublicLayout() {
  return (
    <>
      <Navbar />
        <main style={{ marginTop: "100px" }}>
            <Outlet />
        </main>
    </>
  );
}

export default PublicLayout;