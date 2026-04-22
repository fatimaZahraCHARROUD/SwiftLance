import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = () => {
    // 👉 simple fake auth (replace later with backend)
    if (email === "admin@gmail.com" && password === "1234") {
      
      // store fake token
      localStorage.setItem("token", "logged-in");

      // go to dashboard (part 2)
      navigate("/app");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Login</h2>

      <div>
        email <br />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <br />

      <div>
        password <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <br />

      <button onClick={login}>Login</button>
    </div>
  );
}