document.getElementById("calendarLink").addEventListener("click", () => {
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
