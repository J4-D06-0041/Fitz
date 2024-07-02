import { register } from './register.js';
import { usersTable } from './getUsers.js';
const userPage = () => {
  fetch("/api/users/get-users")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("display-container").innerHTML = html;
      usersTable();
    })
    .catch((error) => {
      console.error("Error fetching users list:", error);
    });
};
const registrationPage = () => {
  fetch("/api/users/register")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("display-container").innerHTML = html;
      register(); 
    })
    .catch((error) => {
      console.error("Error fetching registration form:", error);
    });
};

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

    if(role !== "admin"){
      console.log("hello")
      document.getElementById("employeesLinkContainer").style.display = "block";
    } else {
      console.log("hello1")
      document.getElementById("employeesLinkContainer").style.display = "none";
    } 
  } catch (error) {
    console.error("Error fetching user role:", error);
  }
});

document.getElementById("employeesLink").addEventListener("click", () => {
  document.getElementById("content").innerHTML = `
      <div class="container">
      <div class="btn-group mb-3" role="group">
        <button id="register-btn-id" class="btn btn-primary">Go to register</button>
        <button id="show-user-btn-id" class="btn btn-primary">Show users</button>
      </div>
      <div id="display-container"></div>
    </div>
  `;
  document.getElementById("register-btn-id").addEventListener("click", () => {
    registrationPage();
  });
  document.getElementById("show-user-btn-id").addEventListener("click", () => {
    userPage();
  });
});
