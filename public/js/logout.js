function updateTime(clientTimezone, userTimezone) {
  // Add login time
  const now = new Date(); // Gets the current date and time
  const utcTime = now.toISOString(); // Converts current time to UTC in ISO format

  // Get client time based on the client timezone offset in hours
  // let clientTimeZone = user.clientTimezone; // This should be a numeric value representing the timezone offset
  let clientTime = new Date(now.getTime() + clientTimezone * 3600 * 1000).toISOString().replace(/T/, " ").replace(/\..+/, "");

  // Get user time based on the user timezone offset in hours
  // let userTimeZone = user.userTimezone; // This should also be a numeric value
  let userTime = new Date(now.getTime() + userTimezone * 3600 * 1000).toISOString().replace(/T/, " ").replace(/\..+/, "");

  // Specific timezone handling (e.g., for Singapore which is UTC+8)
  let localTime = new Date(now.getTime() + 8 * 3600 * 1000).toISOString();

  document.getElementById("clientTime").innerText = clientTime;
  document.getElementById("userTime").innerText = userTime;
}

async function fetchUserDetails() {
  try {
    const response = await axios.get("/api/users/get-user-role");
    if (!response.data) {
      throw new Error("Failed to fetch user timezone");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching user timezone:", error);
    return null;
  }
}

document.getElementById("logoutLink").addEventListener("click", async function () {
  try { 
    const userDetails = await fetchUserDetails();
    console.log("userDetails", userDetails);
    setInterval(() => updateTime(userDetails.user.clientTimezone, userDetails.user.userTimezone), 1000);
    document.addEventListener("DOMContentLoaded", function () {
      updateTime(timezone);
      document.getElementById("logoutBtnId").addEventListener("click", async function () {

        try {
          const response = await axios.get("/api/auth/set-cookie");
          console.log('response', response);
          if (!response.data) {
            throw new Error("Failed to fetch user timezone");
          }
          return response.data;
        } catch (error) {
          console.error("Error fetching user timezone:", error);
          return null;
        }
      });
    });
  }catch (error){
    console.error("Logout Error: ", error);
  }
});
