const form = document.getElementById("login-form");

form.addEventListener("submit", e => {
  e.preventDefault();

  const saved = JSON.parse(localStorage.getItem("user"));

  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  // No user exists
  if (!saved) {
    alert("User does not exist");
    window.location.href = "index.html";
    return;
  }

  // Credentials mismatch
  if (saved.email !== email || saved.password !== pass) {
    alert("Invalid credentials");
    return;
  }

  // Successful login
  alert("Login successful");
  
  window.location.href = "todos.html";
});
