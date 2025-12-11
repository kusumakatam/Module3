import { navbar } from "./navbar.js";
import { footer } from "./footer.js";
import { displayTodos } from "./displayTodos.js";

document.getElementById("navbar").innerHTML = navbar();
document.getElementById("footer").innerHTML = footer();

let loggedIn = localStorage.getItem("loggedInUser");

if (loggedIn) {
  

  loadTodos();
}

async function loadTodos() {
  let res = await fetch("https://jsonplaceholder.typicode.com/todos");
  let data = await res.json();
  displayTodos(data.slice(0, 20));
}
