// Organizations management data
// Dữ liệu tổ chức - kết nối với API backend /organizations

import { type UserItem } from "./usersData";

// Loại tổ chức
export type OrganizationType = "PROVINCE" | "DEPARTMENT" | "SCHOOL";

export interface OrganizationItem {
  id: number;
  name: string;
  type: OrganizationType; // PROVINCE = Tỉnh/TP, DEPARTMENT = Sở GD, SCHOOL = Trường
  parentId: number | null; // -1 nếu là Tỉnh, ID của Province nếu là Sở, ID của Sở nếu là Trường
  // Thông tin địa chỉ
  street: string; // Số nhà, đường (tên mới)
  ward: number; // Mã phường/xã (tên mới)
  city: number; // Mã tỉnh/thành phố (tên mới)
  address?: string; // Địa chỉ đầy đủ
  // Thông tin liên hệ
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Alias for backward compatibility
export type FacilityItem = OrganizationItem;

// Mã tỉnh/thành phố từ API provinces.open-api.vn
export const PROVINCE_CODES = {
  HA_NOI: 1,
  HO_CHI_MINH: 79,
  DA_NANG: 48,
  CAN_THO: 92,
  HAI_PHONG: 31,
  HUE: 46,
  QUANG_NINH: 22,
  BAC_NINH: 24,
  THANH_HOA: 38,
  NGHE_AN: 40,
};

// Base data structure for organizations
// IDs 1-5: Sở Giáo dục (DEPARTMENT)
// IDs 101+: Trường (SCHOOL) thuộc các Sở
const baseOrganizations: OrganizationItem[] = [];

// Export mock organizations
export const mockOrganizations: OrganizationItem[] = baseOrganizations;

// Backward compatibility aliases
export const mockFacilities = mockOrganizations;

export const organizationStatusConfig: Record<
  string,
  { label: string; color: string }
> = {
  active: { label: "Đang hoạt động", color: "bg-green-100 text-green-800" },
  inactive: { label: "Tạm ngưng", color: "bg-gray-100 text-gray-600" },
  maintenance: { label: "Bảo trì", color: "bg-yellow-100 text-yellow-800" },
};

// Backward compatibility alias
export const facilityStatusConfig = organizationStatusConfig;

// Helper functions
export function getOrganizationById(id: number): OrganizationItem | undefined {
  return mockOrganizations.find((f) => f.id === id);
}

// Alias for backward compatibility
export const getFacilityById = getOrganizationById;

export function getOrganizationsByCity(cityCode: number): OrganizationItem[] {
  return mockOrganizations.filter((f) => f.city === cityCode);
}

// Compatibility function
export const getFacilitiesByProvince = getOrganizationsByCity;
export const getOrganizationsByProvince = getOrganizationsByCity;

export function getActiveOrganizations(): OrganizationItem[] {
  return mockOrganizations;
}

export const getActiveFacilities = getActiveOrganizations;

export function getOrganizationsGroupedByCity(): Record<
  number,
  OrganizationItem[]
> {
  return mockOrganizations.reduce(
    (acc, org) => {
      if (!acc[org.city]) {
        acc[org.city] = [];
      }
      acc[org.city].push(org);
      return acc;
    },
    {} as Record<number, OrganizationItem[]>,
  );
}

export const getFacilitiesGroupedByProvince = getOrganizationsGroupedByCity;

// Lấy danh sách unique city codes
export function getUniqueCityCodes(): number[] {
  return [...new Set(mockOrganizations.map((f) => f.city))];
}

// ===== HELPER FUNCTIONS CHO CẤU TRÚC PHÂN CẤP =====

// Lấy danh sách Sở Giáo dục (DEPARTMENT)
export function getDepartments(): OrganizationItem[] {
  return mockOrganizations.filter((org) => org.type === "DEPARTMENT");
}

// Lấy danh sách Trường (SCHOOL)
export function getSchools(): OrganizationItem[] {
  return mockOrganizations.filter((org) => org.type === "SCHOOL");
}

// Lấy danh sách Trường thuộc một Sở cụ thể
export function getSchoolsByDepartment(
  departmentId: number,
): OrganizationItem[] {
  return mockOrganizations.filter(
    (org) => org.type === "SCHOOL" && org.parentId === departmentId,
  );
}

// Lấy Sở Giáo dục cha của một Trường
export function getParentDepartment(
  schoolId: number,
): OrganizationItem | undefined {
  const school = mockOrganizations.find((org) => org.id === schoolId);
  if (!school || school.type !== "SCHOOL" || !school.parentId) return undefined;
  return mockOrganizations.find((org) => org.id === school.parentId);
}

// Đếm số trường thuộc một Sở
export function countSchoolsByDepartment(departmentId: number): number {
  return mockOrganizations.filter(
    (org) => org.type === "SCHOOL" && org.parentId === departmentId,
  ).length;
}
