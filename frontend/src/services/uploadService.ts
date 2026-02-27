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

  // Return the relative path (/uploads/...) to be stored and used with API_BASE_URL
  if (response.data.path) return response.data.path;
  return response.data.url;
};
