  import "./App.css";
  import { BrowserRouter,Routes, Route } from "react-router-dom";
  import Login from "./components/Log";
  import Register from "./components/Register";
  import Todolist from "./components/TodoList";

  function App() {
    return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/todolist" element={<Todolist />} />
      </Routes>
      </BrowserRouter>
    );
  }

  export default App;
