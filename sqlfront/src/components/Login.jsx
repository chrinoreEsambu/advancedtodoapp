import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";
import "../App.css";
function login() {
  const [user_id, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await axios.post("http://localhost:3000/api/connexion", {
        user_id,
        password,
      }, { withCredentials: true });

      navigate("/todolist");
    } catch (error) {
      alert("Erreur de connexion : " + error.response?.data?.message);
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <input type="text" placeholder="user_id" onChange={(e) => setUserId(e.target.value)} />
      <input type="password" placeholder="mot de passe" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Connexion</button>
    </div>
  );

}

export default login;
