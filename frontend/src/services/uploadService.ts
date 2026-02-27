import http from "@/core/services/api/http";

export const uploadFile = async (
  file: File,
  folder?: "exam" | "question" | "avatar" | "Data_FSL" | "others",
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  if (folder) {
    formData.append("folder", folder);
  }

  const response = await http.post("/upload", formData);

  // Prioritize the relative path (/uploads/...) to be stored.
  // This allows the frontend to prepend API_BASE_URL consistently.
  if (response.data.path) return response.data.path;
  return response.data.url;
};
