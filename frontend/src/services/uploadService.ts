import http from "@/core/services/api/http";

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await http.post("/upload", formData);

  // Return the path from response
  return response.data.path;
};
