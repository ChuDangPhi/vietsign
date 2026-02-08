import http from "@/core/services/api/http";

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await http.post("/upload", formData);

  // Prioritize URL (MinIO public URL)
  // Backend now returns { path, url, filename }
  if (response.data.url) return response.data.url;
  return response.data.path;
};
