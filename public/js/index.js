async function login(event) {
  event.preventDefault(); // Prevent the form from submitting
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (response.ok) {
    // Login successful
    localStorage.setItem("token", data.token);
    window.location.href = "/api/main/dashboard"; // Redirect to dashboard or home page
  } else {
    // Login failed
    document.getElementById("message").innerText = data.msg;
  }
}

document.getElementById("loginForm").addEventListener("submit", login);
