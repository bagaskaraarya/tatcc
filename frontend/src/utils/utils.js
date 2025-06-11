export const Base_Url =
  "http://localhost:5000";

// Function to test API connection
export const testConnection = async () => {
  try {
    const response = await fetch(`${Base_Url}/health`);
    console.log("API Health Check:", response.status);
    return response.ok;
  } catch (error) {
    console.error("API Connection Error:", error);
    return false;
  }
};
