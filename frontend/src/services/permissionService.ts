import PermissionModel, { Permission, Role } from "@/domain/entities/Permission";
import { roleLabels } from "@/data/usersData";

// Re-export types
export type { Permission, Role };

// Construct roles from configuration
export const systemRoles: Role[] = Object.entries(roleLabels).map(
  ([code, name]) => ({
    code,
    name,
    description: `Vai trò ${name} trong hệ thống`,
  })
);

/**
 * Get all permissions
 */
export async function fetchAllPermissions(): Promise<Permission[]> {
  try {
    const res = await PermissionModel.getAllPermissions();
    if (Array.isArray(res)) return res;
    return res?.permissions || [];
  } catch (error) {
    console.error("Fetch permissions error", error);
    return [];
  }
}

/**
 * Get all available roles
 */
export async function fetchAllRoles(): Promise<Role[]> {
  return systemRoles;
}

/**
 * Get permissions for a specific role
 */
export async function fetchRolePermissions(
  roleCode: string
): Promise<Permission[]> {
  try {
    const res = await PermissionModel.getRolePermissions(roleCode);
    return Array.isArray(res) ? res : res?.permissions || [];
  } catch (error) {
    console.error(`Fetch role permissions error for ${roleCode}`, error);
    return [];
  }
}

/**
 * Add permission to role
 */
export async function addPermissionToRole(
  roleCode: string,
  permissionCode: string
): Promise<any> {
  return await PermissionModel.addRolePermission(roleCode, permissionCode);
}

/**
 * Remove permission from role
 */
export async function removePermissionFromRole(
  roleCode: string,
  permissionCode: string
): Promise<any> {
  return await PermissionModel.removeRolePermission(roleCode, permissionCode);
}
