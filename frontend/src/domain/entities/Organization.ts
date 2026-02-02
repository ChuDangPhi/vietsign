import { Base } from "./base";

export interface Organization {
  id?: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  is_active?: boolean;
  created_date?: string;
  modified_date?: string;
}

class OrganizationModelClass extends Base {
  constructor() {
    super("organizations"); // Matches backend /organizations routes
  }

  // GET /organizations - Lấy danh sách tổ chức
  getAll = async (query?: any): Promise<any> => {
    const res = await this.apiGet("", query);
    return res.data;
  };

  // GET /organizations/:id - Lấy thông tin tổ chức
  getById = async (id: number): Promise<any> => {
    const res = await this.apiGet(`/${id}`);
    return res.data;
  };

  // POST /organizations - Tạo tổ chức mới
  create = async (data: Partial<Organization>): Promise<any> => {
    const res = await this.apiPost("", data);
    return res.data;
  };

  // PUT /organizations/:id - Cập nhật tổ chức
  update = async (id: number, data: Partial<Organization>): Promise<any> => {
    const res = await this.apiPut(`/${id}`, data);
    return res.data;
  };

  // DELETE /organizations/:id - Xóa tổ chức
  delete = async (id: number): Promise<any> => {
    const res = await this.apiDelete(`/${id}`);
    return res.data;
  };
}

class OrganizationManagerModelClass extends Base {
  constructor() {
    super("organization-managers");
  }

  // GET /organization-managers?organization_id=X&role_in_org=TEACHER
  getByOrganization = async (
    organizationId: number | string,
    roleInOrg?: string,
  ): Promise<any> => {
    const query: any = { organization_id: organizationId };
    if (roleInOrg) {
      query.role_in_org = roleInOrg;
    }
    const res = await this.apiGet("", query);
    return res.data;
  };

  assign = async (data: {
    organization_id: string | number;
    user_id: string | number;
    role_in_org?: string;
    is_primary?: boolean;
  }): Promise<any> => {
    const res = await this.apiPost("", data);
    return res.data;
  };

  revoke = async (data: {
    organization_id: string | number;
    user_id: string | number;
  }): Promise<any> => {
    // apiDelete(path, params, data)
    const res = await this.apiDelete("", null, data);
    return res.data;
  };
}

export const OrganizationManagerModel = new OrganizationManagerModelClass();
const OrganizationModel = new OrganizationModelClass();
export default OrganizationModel;
