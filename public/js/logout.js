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

async function fetchAttendanceByUser() {
  try {
    console.log(`fetchAttendanceByUser userId`);
    const response = await axios.get(`/api/attendance/user`);
    if (!response.data) {
      throw new Error("Failed to fetch fetchAttendanceByUser");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching fetchAttendanceByUser:", error);
    return null;
  }
}

async function logout() {
  try {
    const response = await axios.get("/api/auth/set-cookie");
    window.location.href = "/";
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
    const attendanceDetails = await fetchAttendanceByUser();
    console.log("attendanceDetails", attendanceDetails);
    setInterval(() => updateTime(userDetails.user.clientTimezone, userDetails.user.userTimezone), 1000);
    document.addEventListener("DOMContentLoaded", function () {
      updateTime(timezone);
    });
  } catch (error) {
    console.error("Logout Error: ", error);
  }
});
