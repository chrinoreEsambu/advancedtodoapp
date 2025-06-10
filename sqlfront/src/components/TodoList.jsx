import "../todolist.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

function TodoList() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  // 🔁 Charger les tâches depuis le backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/getusertasks",
        {
          withCredentials: true,
        }
      );

      console.log("Réponse serveur :", response.data);

      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else if (response.data && Array.isArray(response.data.tasks)) {
        setTasks(response.data.tasks);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des tâches :", error);
    }
  };

  // ➕ Ajouter une tâche
  const handleAddTask = async () => {
    if (task.trim() === "") return;

    try {
      await axios.post(
        "http://localhost:8000/api/addtask",
        { task: task }, // ✅ adapte cette ligne si le backend attend un autre champ
        { withCredentials: true }
      );
      setTask("");
      fetchTasks(); // recharger les tâches après ajout
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout :",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="logincontainer">
      {/* Formulaire d'ajout */}
      <div className="formscontainer" style={{ borderRight: "1px solid #ccc" }}>
        <h2>Ajouter une tâche</h2>
        <input
          type="text"
          className="inputT"
          placeholder="Ex: Réviser Angular"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={handleAddTask}>Ajouter</button>
      </div>

      {/* Liste des tâches */}
      <div className="formscontainer">
        <h2>Mes tâches</h2>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {Array.isArray(tasks) && tasks.length > 0 ? (
            tasks.map((t, index) => (
              <li
                key={index}
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  marginBottom: "10px",
                }}
              >
                {/* ✅ Adapter selon le nom réel de la propriété */}
                {t.task || t.content || t.title || JSON.stringify(t)}
              </li>
            ))
          ) : (
            <li>Aucune tâche disponible.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default TodoList;
