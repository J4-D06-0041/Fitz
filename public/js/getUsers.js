async function usersTable() {
  try {
    const response = await fetch("/api/users/get-all-users");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const users = await response.json();

    const usersTable = document.getElementById("users-table");
    const tbody = usersTable.querySelector(".tbody");

    tbody.innerHTML = "";

    users.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><span class="user-info">${user.firstName}</span><input class="edit-input" type="text" value="${user.firstName}" style="display:none;"></td>
        <td><span class="user-info">${user.lastName}</span><input class="edit-input" type="text" value="${user.lastName}" style="display:none;"></td>
        <td><span class="user-info">${user.username}</span><input class="edit-input" type="text" value="${user.username}" style="display:none;"></td>
        <td><span class="user-info">${user.email}</span><input class="edit-input" type="email" value="${user.email}" style="display:none;"></td>
        <td>
          <span class="user-info">${user.role}</span>
          <select class="edit-input" style="display:none;">
            <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
            <option value="auditor" ${user.role === 'auditor' ? 'selected' : ''}>Auditor</option>
          </select>
        </td>
        <td>
          <span class="user-info">${user.userTimezone}</span>
          <input class="edit-input" type="text" value="${user.userTimezone}" pattern="^[+-]?([0-9]|1[0-2])$" style="display:none;">
        </td>
        <td>
          <span class="user-info">${user.clientTimezone}</span>
          <input class="edit-input" type="text" value="${user.clientTimezone}" pattern="^[+-]?([0-9]|1[0-2])$" style="display:none;">
        </td>
        <td>${user.dateCreated}</td>
        <td>${user.status}</td>
        <td><button class="delete-btn btn btn-danger" data-username="${user.username}">Delete</button></td>
        <td><button class="edit-btn btn btn-primary" data-username="${user.username}">Edit</button></td>
      `;
      tbody.appendChild(row);
    });

    document.querySelectorAll(".delete-btn").forEach((deleteBtn) => {
      deleteBtn.addEventListener("click", async (event) => {
        const username = event.target.getAttribute("data-username");
        try {
          const deleteResponse = await fetch(`/api/users/delete/${username}`, {
            method: "DELETE",
          });

          if (!deleteResponse.ok) {
            throw new Error("Failed to delete user");
          }
          const row = event.target.closest("tr");
          row.remove();
        } catch (error) {
          console.log("error:", error);
        }
      });
    });

    document.querySelectorAll(".edit-btn").forEach((editBtn) => {
      editBtn.addEventListener("click", async (event) => {
        const row = event.target.closest("tr");
        const oldUsername = event.target.getAttribute("data-username");
        const editInputs = row.querySelectorAll(".edit-input");
        const userInfo = row.querySelectorAll(".user-info");

        if (event.target.innerText === "Edit") {
          userInfo.forEach(span => span.style.display = "none");
          editInputs.forEach(input => input.style.display = "block");
          event.target.innerText = "Save";
        } else {
          const newUser = {
            firstName: editInputs[0].value,
            lastName: editInputs[1].value,
            newUsername: editInputs[2].value,
            email: editInputs[3].value,
            role: editInputs[4].value,
            userTimezone: editInputs[5].value,
            clientTimezone: editInputs[6].value,
          };

          try {
            // Validate timezones on the client side
            const validTimezone = /^[+-]?([0-9]|1[0-2])$/;
            if (!validTimezone.test(newUser.userTimezone) || !validTimezone.test(newUser.clientTimezone)) {
              throw new Error('Invalid timezone format. Must be between -12 and +12.');
            }

            const updateResponse = await fetch(`/api/users/update/${oldUsername}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newUser),
            });

            if (!updateResponse.ok) {
              const errorData = await updateResponse.json();
              throw new Error(errorData.msg || "Failed to update user");
            }

            userInfo.forEach((span, index) => {
              span.innerText = editInputs[index].value;
              span.style.display = "block";
            });
            editInputs.forEach(input => input.style.display = "none");
            event.target.innerText = "Edit";
            event.target.setAttribute("data-username", newUser.newUsername);
          } catch (error) {
            console.error("Error updating user:", error.message);
          }
        }
      });
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

export { usersTable };
