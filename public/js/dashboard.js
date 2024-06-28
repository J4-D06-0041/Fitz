document.getElementById("timelogLink").addEventListener("click", () => {
  fetch("/api/timelog/view")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("content").innerHTML = html;
    });
});

document.getElementById("payLink").addEventListener("click", () => {
  fetch("/api/pay/view")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("content").innerHTML = html;
    });
});

document.getElementById("dashboardLink").addEventListener("click", () => {
  document.getElementById("content").innerHTML = `
        <h2>Welcome to the Dashboard</h2>
        <p>Select an option from the sidebar to get started.</p>
    `;
});

document.getElementById("logoutLink").addEventListener("click", () => {
  fetch("/api/auth/logout")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("content").innerHTML = html;
    });
});

// retrives user role of the logged in user
document.addEventListener("DOMContentLoaded", async function () {
  try {
    console.log("Fetching user role");
    const response = await axios.get("/api/users/get-user-role");
    console.log("User role:", JSON.stringify(response.data));
    const { role } = response.data;
  } catch (error) {
    console.error("Error fetching user role:", error);
  }
});
