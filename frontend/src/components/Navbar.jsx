import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css"
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
   <nav className="navbar">
  <div className="nav-container">
    
    <div className="logo">SwiftLance</div>

    <ul className="nav-links">
      <li><Link to="#features">Features</Link></li>
      <li><Link to="#about">About</Link></li>
      <li><Link to="#contact">Contact</Link></li>
    </ul>

    <div className="nav-buttons">
      <Link to="/login" className="login-btn">Login</Link>
      <Link to="/register" className="register-btn">Get Started</Link>
    </div>

  </div>
</nav>
  );
}

export default Navbar;