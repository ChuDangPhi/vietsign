// Users management data

export interface UserItem {
  id: number;
  name: string;
  email: string;
  role: string;
  isDeleted: boolean; // Trạng thái xóa mềm (true: Inactive, false: Active)
  avatar?: string;
  phone?: string;
  createdAt: string;
  organizationId?: number; // ID cơ sở (thay vì tên)
  organizationName?: string; // Tên cơ sở (từ BE)
  parentOrganizationName?: string; // Tên đơn vị cha (Sở)
}

export const roleLabels: Record<string, string> = {
  ADMIN: "Quản trị viên",
  FACILITY_MANAGER: "Quản lý cơ sở",
  TEACHER: "Giáo viên",
  STUDENT: "Học sinh",
  USER: "Người dùng",
  TESTER: "Tester",
};

export const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-800",
  FACILITY_MANAGER: "bg-blue-100 text-blue-800",
  TEACHER: "bg-green-100 text-green-800",
  STUDENT: "bg-amber-100 text-amber-800",
  USER: "bg-teal-100 text-teal-800",
  TESTER: "bg-orange-100 text-orange-800",
};

export const userStatusConfig: Record<
  string,
  { label: string; color: string }
> = {
  active: { label: "Hoạt động", color: "bg-green-100 text-green-800" },
  inactive: { label: "Không hoạt động", color: "bg-gray-100 text-gray-600" },
};

// Vietnamese name components removed

// Mock Users removed to use Real DB
export const mockUsers: UserItem[] = [];

// Helper functions (Deprecated - should use async APIs from userService)
export function getUserById(id: number): UserItem | undefined {
  return undefined;
}

export function getUsersByRole(role: string): UserItem[] {
  return [];
}

export function getUsersByFacility(organizationId: number): UserItem[] {
  return [];
}

export function getFacilityManagers(): UserItem[] {
  return [];
}
