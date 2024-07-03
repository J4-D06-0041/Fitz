async function usersTable() {
  try {
    const response = await fetch("/api/users/get-all-users");
    console.log("response");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const users = await response.json();

    console.log(users);

    const usersTable = document.getElementById("users-table");
    const tbody = usersTable.querySelector(".tbody");

    users.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>${user.userTimezone}</td>
        <td>${user.clientTimezone}</td>
        <td>${user.dateCreated}</td>
        <td>${user.status}</td>
        <td><button class="delete-btn btn btn-danger" data-username="${user.username}">Delete</button></td>
      `;
      tbody.appendChild(row);
    });
      document.querySelectorAll(".delete-btn").forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", async (event) => {
          const username = event.target.getAttribute("data-username");
          try{
            const response = await fetch(`/api/users/username/${username}`, {
              method: "DELETE",
            });
            
            if (!response.ok){
              throw new Error("Failed to delete user");
            }
            const row = event.target.closest("tr");
            row.remove();
          }catch (error){
            console.log("error:", error)
          }
        });
      });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

export { usersTable };
