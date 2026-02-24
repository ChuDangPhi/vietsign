import http from "@/core/services/api/http";

export class Base {
  protected resource: string;

  constructor(resource: string) {
    this.resource = resource;
  }

  protected getUrl(path?: string): string {
    if (!path) return `/${this.resource}`;
    if (path.startsWith("/")) return `/${this.resource}${path}`;
    return `/${this.resource}/${path}`;
  }

  protected async apiGet(path: string = "", params?: any) {
    const defaultParams = { limit: 10000 };
    const mergedParams = { ...defaultParams, ...(params || {}) };
    const response = await http.get(this.getUrl(path), { params: mergedParams });
    return response;
  }

  protected async apiPost(path: string = "", data?: any) {
    const response = await http.post(this.getUrl(path), data);
    return response;
  }

  protected async apiPut(path: string = "", data?: any) {
    const response = await http.put(this.getUrl(path), data);
    return response;
  }

  protected async apiDelete(path: string = "", params?: any, data?: any) {
    const config: any = { params };
    if (data) {
      config.data = data;
    }
    const response = await http.delete(this.getUrl(path), config);
    return response;
  }

  protected async apiUploadFile(path: string = "", formData: FormData) {
    const response = await http.post(this.getUrl(path), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
}
