import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logimg from "../assets/logimg.jpg";

import "../App.css";

function Login() {
  const [user_id, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/connexion",
        {
          user_id,
          password,
        },
        { withCredentials: true }
      );

      navigate("/todolist");
    } catch (error) {
      alert("Erreur de connexion : " + error.response?.data?.message);
    }
  };

  return (
    <div className="logincontainer">
      <div className="imgi">
        <img src={logimg} alt="" />
      </div>
      <div className="formscontainer">
      <h2>Connexion</h2>
      <input
        className="inputT"
        type="text"
        placeholder="user_id"
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        className="inputT"
        type="password"
        placeholder="mot de passe"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Connexion</button>
      </div>
    </div>
  );
}

export default Login;
