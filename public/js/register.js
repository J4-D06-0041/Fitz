export function register() {
  document.getElementById("registerForm").addEventListener("submit", async function (event) {
    console.log("Entered register function");
    event.preventDefault(); // Prevent the form from submitting

    const firstName = document.getElementById("firstname").value;
    const lastName = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const userTimezone = document.getElementById("userTimezone").value;
    const clientTimezone = document.getElementById("clientTimezone").value;

    const formData = {
      firstName,
      lastName,
      email,
      role,
      username,
      password,
      userTimezone,
      clientTimezone,
    };

    try {
      const response = await axios.post("/api/auth/register", formData);

      if (response.status === 200) {
        // Registration successful
        document.getElementById("message").innerText = "Registration successful! You can now log in.";
        setTimeout(() => {
          window.location.href = "/"; // Redirect to login page after 2 seconds
        }, 2000);
      } else {
        // Registration failed
        document.getElementById("message").innerText = response.data.msg || "Registration failed.";
      }
    } catch (error) {
      console.error("Error registering user:", error);
      document.getElementById("message").innerText = `Registration failed. Please try again.\n${error.message}`;
    }
  });
}