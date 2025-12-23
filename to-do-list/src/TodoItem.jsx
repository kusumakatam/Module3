import { useContext } from "react";
import { TodoContext } from "./TodoContext";

const TodoItem = ({ todoId }) => {
  const { todos, deleteTodo } = useContext(TodoContext);

  const todo = todos.find((t) => t.id === todoId);

  if (!todo) return null;

  return (
    <div>
      <span>{todo.title}</span>
      <button onClick={() => deleteTodo(todo.id)}>Delete</button>
    </div>
  );
};

export default TodoItem;
