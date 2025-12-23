import { useContext } from "react";
import { TodoContext } from "./TodoContext";
import TodoItem from "./TodoItem";

const TodoList = () => {
  const { todos } = useContext(TodoContext);

  return (
    <>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todoId={todo.id} />
      ))}
    </>
  );
};

export default TodoList;
