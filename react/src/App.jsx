import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Todos from "./Todos";
import TodoDetails from "./TodoDetails";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/todos"
        element={
          <ProtectedRoute>
            <Todos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/todos/:todoId"
        element={
          <ProtectedRoute>
            <TodoDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
