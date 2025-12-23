import { useState } from "react";
import { TodoContext } from "./TodoContext";
import AddTodo from "./AddTodo";
import TodoList from "./TodoList";

const Todos = () => {
  const [todos, setTodos] = useState([]);

  const addTodo = (title) => {
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), title }
    ]);
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, deleteTodo }}>
      <AddTodo />
      <TodoList />
    </TodoContext.Provider>
  );
};

export default Todos;
