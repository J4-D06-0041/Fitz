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


    const timezones = [
      { value: "-12", text: "UTC-12 (Baker Island Time)" },
      { value: "-11", text: "UTC-11 (Samoa Time)" },
      { value: "-10", text: "UTC-10 (Hawaii-Aleutian Time)" },
      { value: "-9", text: "UTC-9 (Alaska Time)" },
      { value: "-8", text: "UTC-8 (Pacific Time)" },
      { value: "-7", text: "UTC-7 (Mountain Time)" },
      { value: "-6", text: "UTC-6 (Central Time)" },
      { value: "-5", text: "UTC-5 (Eastern Time)" },
      { value: "-4", text: "UTC-4 (Atlantic Time)" },
      { value: "-3", text: "UTC-3 (West Africa Time)" },
      { value: "-2", text: "UTC-2 (Mid-Atlantic Time)" },
      { value: "-1", text: "UTC-1 (Greenwich Mean Time)" },
      { value: "+0", text: "UTC+0 (Coordinated Universal Time)" },
      { value: "+1", text: "UTC+1 (Central European Time)" },
      { value: "+2", text: "UTC+2 (Eastern European Time)" },
      { value: "+3", text: "UTC+3 (Moscow Time)" },
      { value: "+4", text: "UTC+4 (Astrakhan Time)" },
      { value: "+5", text: "UTC+5 (Pakistan Time)" },
      { value: "+6", text: "UTC+6 (Bangladesh Time)" },
      { value: "+7", text: "UTC+7 (Krasnoyarsk Time)" },
      { value: "+8", text: "UTC+8 (China Standard Time)" },
      { value: "+9", text: "UTC+9 (Japan Standard Time)" },
      { value: "+10", text: "UTC+10 (Australian Western Standard Time)" },
      { value: "+11", text: "UTC+11 (Solomon Islands Time)" },
      { value: "+12", text: "UTC+12 (Kiribati Time)" },
      { value: "+13", text: "UTC+13 (Samoa Time)" },
      { value: "+14", text: "UTC+14 (Line Islands Time)" },
    ];

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
          <select class="edit-input" style="display:none;">
            ${timezones.map(tz => `<option value="${tz.value}" ${user.userTimezone === tz.value ? 'selected' : ''}>${tz.text}</option>`).join('')}
          </select>
        </td>
        <td>
          <span class="user-info">${user.clientTimezone}</span>
          <select class="edit-input" style="display:none;">
            ${timezones.map(tz => `<option value="${tz.value}" ${user.clientTimezone === tz.value ? 'selected' : ''}>${tz.text}</option>`).join('')}
          </select>
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
        if (confirm("Are you sure you want to delete this user?")) {
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
        } else if (confirm("Are you sure you want to save changes?")) {
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
