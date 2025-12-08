let url = "https://jsonplaceholder.typicode.com/todos";

function fetchTodos() {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let first20 = data.slice(0, 20);
            localStorage.setItem("todos", JSON.stringify(first20));
            displayTodos();
        });
}

function displayTodos() {
    let container = document.getElementById("todo-container");
    container.innerHTML = "";

    let todos = JSON.parse(localStorage.getItem("todos")) || [];

    if (todos.length === 0) {
        container.innerHTML = "<p>No Todos Available</p>";
        return;
    }

    todos.forEach(function (todo) {
        let div = document.createElement("div");
        div.style.margin = "10px 0";
        div.style.padding = "10px";
        div.style.border = "1px solid #ccc";

        let title = document.createElement("p");
        title.textContent = todo.title;

        let status = document.createElement("p");
        status.textContent = "Completed: " + todo.completed;

        let delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = function () {
            deleteTodo(todo.id);
        };

        div.appendChild(title);
        div.appendChild(status);
        div.appendChild(delBtn);

        container.appendChild(div);
    });
}

function deleteTodo(id) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    let updated = todos.filter(function (item) {
        return item.id !== id;
    });

    localStorage.setItem("todos", JSON.stringify(updated));
    displayTodos();
}

if (!localStorage.getItem("todos")) {
    fetchTodos();
} else {
    displayTodos();
}
