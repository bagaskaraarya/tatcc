export const Base_Url =
  "https://api-rkakl-mahasiswa-772045342482.us-central1.run.app";

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
