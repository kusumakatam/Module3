export function displayTodos(data) {
  let container = document.getElementById("todo-container");
  container.innerHTML = "";

  data.forEach((todo) => {
    let div = document.createElement("div");
    div.className = "todo-card";

    let title = document.createElement("p");
    title.textContent = todo.title;

    let status = document.createElement("p");
    status.textContent = todo.completed ? "Completed" : "Pending";

    div.append(title, status);
    container.append(div);
  });
}
