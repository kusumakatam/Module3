import { useContext, useState } from "react";
import { TodoContext } from "./TodoContext";

const AddTodo = () => {
  const { addTodo } = useContext(TodoContext);
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (title.trim() === "") return;
    addTodo(title);
    setTitle("");
  };

  return (
    <>
      <input
        type="text"
        value={title}
        placeholder="Enter todo"
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
    </>
  );
};

export default AddTodo;
