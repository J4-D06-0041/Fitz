async function usersTable() {
  try {
    const response = await fetch("/api/users/get-all-users");
    console.log('response')
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const users = await response.json();

    console.log(users);

    const usersTable = document.getElementById("users-table");
    const tbody = usersTable.querySelector(".tbody");

    users.forEach(user => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
      `;
      console.log(users)
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export { usersTable };