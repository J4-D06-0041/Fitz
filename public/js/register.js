async function register(event) {
  console.log("entered register function");
  event.preventDefault(); // Prevent the form from submitting

  const firstName = document.getElementById("firstname").value;
  const lastName = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const role = document.getElementById("role").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const userTimezone = document.getElementById("userTimezone").value;
  const clientTimezone = document.getElementById("clientTimezone").value;
  try {
    const response = await axios.post("/api/auth/register", {
      firstName,
      lastName,
      email,
      role,
      username,
      password,
      userTimezone,
      clientTimezone,
    });
    console.log("response", JSON.stringify(response));
    const data = await response.data;
    console.log("data", data);
    if (response.status === 200) {
      // Registration successful
      document.getElementById("message").innerText = "Registration successful! You can now log in.";
      setTimeout(() => {
        window.location.href = "/";
      }, 2000); // Redirect to login page after 2 seconds
    } else {
      // Registration failed
      document.getElementById("message").innerText = data.msg;
    }
  } catch (error) {
    console.error("error main", error);
    document.getElementById("message").innerText = `Registration failed. Please try again.\n${JSON.stringify(
      error.response.data.msg
    )}`;
  }
}

document.getElementById("registerForm").addEventListener("submit", register);
