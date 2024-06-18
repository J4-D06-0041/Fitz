async function register(event) {
  console.log("entered register function");
  event.preventDefault(); // Prevent the form from submitting

  const firstName = document.getElementById("firstname").value;
  const lastName = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const role = document.getElementById("role").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firstName, lastName, email, role, username, password }),
  });

  const data = await response.json();
  console.log("data", data);
  if (response.ok) {
    // Registration successful
    document.getElementById("message").innerText = "Registration successful! You can now log in.";
    setTimeout(() => {
      window.location.href = "/";
    }, 2000); // Redirect to login page after 2 seconds
  } else {
    // Registration failed
    document.getElementById("message").innerText = data.msg;
  }
}

document.getElementById("registerForm").addEventListener("submit", register);
