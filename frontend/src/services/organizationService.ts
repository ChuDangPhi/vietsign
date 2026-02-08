/**
 * Organization Service
 *
 * Service để fetch và quản lý dữ liệu tổ chức từ API backend.
 * Fallback về mock data khi API không khả dụng.
 */

import OrganizationModel, {
  OrganizationManagerModel,
} from "@/domain/entities/Organization";
import { type OrganizationItem } from "@/data/organizationsData";
import { fetchUsersByFacility } from "./userService";

// Re-export types và constants
export type { OrganizationItem } from "@/data/organizationsData";

/**
 * Convert API organization to OrganizationItem format
 */
function convertApiToOrganizationItem(apiOrg: any): OrganizationItem {
  // Extract ID with fallbacks for common naming conventions
  // Backend uses 'organization_id' as primary key
  const id =
    apiOrg.id ??
    apiOrg.organization_id ??
    apiOrg.ID ??
    apiOrg._id ??
    apiOrg.org_id;

  return {
    id: Number(id),
    name: apiOrg.name || apiOrg.Name || "",
    // Map backend types to frontend types
    type:
      apiOrg.type === "EDU_SYSTEM"
        ? "PROVINCE"
        : apiOrg.type === "CENTER"
          ? "DEPARTMENT"
          : apiOrg.type || "SCHOOL",
    parentId: apiOrg.parent_id ?? apiOrg.parentId ?? apiOrg.ParentID ?? null,
    street: apiOrg.street || apiOrg.address || "",
    ward: !isNaN(Number(apiOrg.ward)) ? Number(apiOrg.ward) : apiOrg.ward || "",
    city: !isNaN(Number(apiOrg.city)) ? Number(apiOrg.city) : apiOrg.city || "",
    address: apiOrg.address || apiOrg.street || "",
    phone: apiOrg.phone || apiOrg.Phone || "",
    email: apiOrg.email || apiOrg.Email || "",
    createdAt: apiOrg.created_at || apiOrg.createdAt || apiOrg.CreatedAt || "",
    updatedAt: apiOrg.updated_at || apiOrg.updatedAt || apiOrg.UpdatedAt || "",
  };
}

/**
 * Lấy tất cả organizations từ API
 */
export async function fetchAllOrganizations(
  query?: any,
): Promise<OrganizationItem[]> {
  try {
    const response = await OrganizationModel.getAll(query);

    // Handle different response structures: [item, ...], { data: [...] }, { organizations: [...] }
    let rawList: any[] = [];
    if (Array.isArray(response)) {
      rawList = response;
    } else if (response && Array.isArray(response.data)) {
      rawList = response.data;
    } else if (response && Array.isArray(response.organizations)) {
      rawList = response.organizations;
    } else if (response && typeof response === "object") {
      // If it's a single object, maybe it's the data we want? (Unlikely for getAll, but safe)
      if (response.id || response.ID || response._id) rawList = [response];
    }

    if (rawList.length > 0) {
      const mapped = rawList
        .map(convertApiToOrganizationItem)
        .filter((item, index) => {
          if (!item.id || isNaN(item.id)) {
            console.warn(
              `Organization item at index ${index} from API is missing a valid ID and will be filtered out:`,
              rawList[index],
            );
            return false;
          }
          return true;
        });

      return mapped;
    }

    return [];
  } catch (error) {
    console.error("Error fetching organizations from API:", error);
    return [];
  }
}

/**
 * Lấy organization theo ID
 */
export async function fetchOrganizationById(
  id: number,
): Promise<OrganizationItem | undefined> {
  try {
    const response = await OrganizationModel.getById(id);
    const data = response?.organization || response;
    if (data) {
      return convertApiToOrganizationItem(data);
    }
    return undefined;
  } catch (error) {
    console.error(`Error fetching organization ${id} from API:`, error);
    return undefined;
  }
}

/**
 * Helper to convert OrganizationItem to API payload
 */
function convertItemToApiPayload(data: Partial<OrganizationItem>): any {
  const payload: any = {
    name: data.name,
    // Map PROVINCE to EDU_SYSTEM for backend compatibility
    type: data.type === "PROVINCE" ? "EDU_SYSTEM" : data.type || "SCHOOL",
    // Map parentId -1 to null for top-level organizations
    parent_id:
      data.parentId === -1 ||
      data.parentId === null ||
      data.parentId === undefined
        ? null
        : data.parentId,
    address: data.address !== undefined ? data.address : data.street || "",
    street: data.street || "",
    city: data.city ? Number(data.city) : null,
    ward: data.ward ? Number(data.ward) : null,
    phone: data.phone || null,
    email: data.email || null,
  };

  return payload;
}

/**
 * Tạo organization mới
 */
export async function createOrganization(
  data: Partial<OrganizationItem>,
): Promise<OrganizationItem | null> {
  try {
    const payload = convertItemToApiPayload(data);
    const response = await OrganizationModel.create(payload);
    if (response) {
      return convertApiToOrganizationItem(response);
    }
    return null;
  } catch (error) {
    console.error("Error creating organization:", error);
    throw error;
  }
}

/**
 * Cập nhật organization
 */
export async function updateOrganization(
  id: number,
  data: Partial<OrganizationItem>,
): Promise<OrganizationItem | null> {
  try {
    const payload = convertItemToApiPayload(data);
    const response = await OrganizationModel.update(id, payload);
    if (response) {
      return convertApiToOrganizationItem(response);
    }
    return null;
  } catch (error) {
    console.error("Error updating organization:", error);
    throw error;
  }
}

/**
 * Xóa organization
 */
export async function deleteOrganization(id: number): Promise<boolean> {
  try {
    await OrganizationModel.delete(id);
    return true;
  } catch (error) {
    console.error("Error deleting organization:", error);
    throw error;
  }
}

// Backward compatibility aliases (for facilities)
// These should ideally be refactored to use async hooks, but we keep them as empty for now to avoid breaking imports
export function getOrganizationById(id: number): OrganizationItem | undefined {
  return undefined;
}

export function getActiveOrganizations(): OrganizationItem[] {
  return [];
}

export function getOrganizationsByProvince(
  cityCode: number,
): OrganizationItem[] {
  return [];
}

export const getFacilityById = getOrganizationById;
export const getActiveFacilities = getActiveOrganizations;
export const getFacilitiesByProvince = getOrganizationsByProvince;

/**
 * Gán quản lý cho tổ chức
 */
export async function assignOrganizationManager(data: {
  organization_id: number;
  user_id: number;
  role_in_org?: string;
  is_primary?: boolean;
}): Promise<any> {
  try {
    return await OrganizationManagerModel.assign(data);
  } catch (error) {
    console.error("Error assigning organization manager:", error);
    throw error;
  }
}

/**
 * Hủy quyền quản lý tổ chức
 */
export async function revokeOrganizationManager(data: {
  organization_id: number;
  user_id: number;
}): Promise<any> {
  try {
    return await OrganizationManagerModel.revoke(data);
  } catch (error) {
    console.error("Error revoking organization manager:", error);
    throw error;
  }
}

/**
 * Lấy danh sách tổ chức mà user quản lý
 */
export async function fetchUserManagedOrganizations(
  userId: number,
): Promise<number[]> {
  try {
    const response = await OrganizationManagerModel.getByUser(userId);
    // Response can be array of manager records or { managers: [...] }
    let managers: any[] = [];
    if (Array.isArray(response)) {
      managers = response;
    } else if (response?.managers && Array.isArray(response.managers)) {
      managers = response.managers;
    } else if (response?.data && Array.isArray(response.data)) {
      managers = response.data;
    }
    // Extract organization_id from each record
    return managers
      .map((m) => Number(m.organization_id || m.organizationId))
      .filter((id) => !isNaN(id));
  } catch (error) {
    console.error("Error fetching user managed organizations:", error);
    return [];
  }
}
