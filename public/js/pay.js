document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("/api/pay"); // Adjust the endpoint as needed
  const payDetails = await response.json();
  const payDiv = document.getElementById("payDetails");

  // Display pay computation details
  payDiv.innerHTML = `
        <p>Total Hours: ${payDetails.totalHours}</p>
        <p>Pay Rate: ${payDetails.payRate}</p>
        <p>Total Pay: ${payDetails.totalPay}</p>
    `;
});
