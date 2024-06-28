async function checkToken() {
  try {
    const response = await axios.get("/api/auth/validate-token", { withCredentials: true });
    if (response.status === 200 && response.data.valid) {
      // Check if already on the dashboard to prevent unnecessary redirection
      if (!window.location.pathname.includes("dashboard.html")) {
        window.location.href = "/pages/private/dashboard.html"; // Redirect if token is valid
      }
    } else {
      // If not valid and not already on unauthorized, redirect
      if (!window.location.pathname.includes("unauthorized.html")) {
        window.location.href = "/pages/public/unauthorized.html";
      }
    }
  } catch (error) {
    // Redirect to login only if not already on the login page
    if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
      // Do nothing if already at root or index.html, preventing loop
    } else {
      window.location.href = "/"; // Redirect to login if not on login page
    }
  }
}

document.addEventListener("DOMContentLoaded", checkToken); // Check token on page load

async function login(event) {
  event.preventDefault(); // Prevent the form from submitting
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const loginResponse = await axios.post("/api/auth/login", { username, password });
    if (loginResponse.status === 200 && loginResponse.data.token) {
      // Login successful
      window.location.href = "/pages/private/dashboard.html";
    } else {
      // Login failed
      window.location.href = "/pages/public/unauthorized.html";
    }
  } catch (error) {
    console.log("error", error);
    if (error.response && error.response.status === 401) {
      window.location.href = "/pages/public/unauthorized.html";
    }
  }
}

document.getElementById("loginForm").addEventListener("submit", login);
