const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";


export const scanWaste = async (imageFile) => {
  const userData = localStorage.getItem("ecosort_user");

  if (!userData) {
    throw new Error("Please login before scanning.");
  }

  const user = JSON.parse(userData);

  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await fetch(
    `${API_BASE_URL}/predict`,
    {
      method: "POST",
      headers: {
        "X-User-ID": String(user.id),
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to analyze image."
    );
  }

  return data;
};


export const getScanHistory = async () => {
  const userData = localStorage.getItem("ecosort_user");

  if (!userData) {
    throw new Error("Please login before viewing history.");
  }

  const user = JSON.parse(userData);

  const response = await fetch(
    `${API_BASE_URL}/history`,
    {
      headers: {
        "X-User-ID": String(user.id),
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to load scan history."
    );
  }

  return data;
};


export const getScanById = async (
  scanId
) => {

  const response = await fetch(
    `${API_BASE_URL}/history/${scanId}`
  );

  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      errorText ||
      "Failed to load scan."
    );
  }

  return response.json();
};


export const getEnvironmentalImpact =
  async () => {

    return {};
  };