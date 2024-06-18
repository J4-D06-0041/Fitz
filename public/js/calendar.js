document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("/api/attendance"); // Adjust the endpoint as needed
  const attendance = await response.json();
  const calendarDiv = document.getElementById("calendar");

  // Generate a simple calendar view based on attendance data
  attendance.forEach((day) => {
    const dayDiv = document.createElement("div");
    dayDiv.className = day.status; // "green", "orange", or "red"
    dayDiv.innerText = day.date;
    calendarDiv.appendChild(dayDiv);
  });
});
