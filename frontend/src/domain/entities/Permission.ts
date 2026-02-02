import { Base } from "./base";

export interface Permission {
  code: string;
  name: string;
  description?: string;
  group?: string;
}

export interface Role {
  code: string;
  name: string;
  description?: string;
  permissions?: Permission[];
}

class PermissionModelClass extends Base {
  constructor() {
    super("permissions");
  }

  getAllPermissions = async (): Promise<any> => {
    const res = await this.apiGet("");
    return res.data;
  };

  getRolePermissions = async (roleCode: string): Promise<any> => {
    const res = await this.apiGet(`/roles/${roleCode}`);
    return res.data;
  };

  addRolePermission = async (
    roleCode: string,
    permissionCode: string,
  ): Promise<any> => {
    const res = await this.apiPost(`/roles/${roleCode}`, { permissionCode });
    return res.data;
  };

  removeRolePermission = async (
    roleCode: string,
    permissionCode: string,
  ): Promise<any> => {
    const res = await this.apiDelete(`/roles/${roleCode}/${permissionCode}`);
    return res.data;
  };
}

const PermissionModel = new PermissionModelClass();
export default PermissionModel;
