/**
 * User Data Service
 *
 * Service này cung cấp các hàm để lấy dữ liệu người dùng từ API.
 */

import UserModel from "@/domain/entities/User";
import {
  UserItem,
  roleLabels,
  roleColors,
  userStatusConfig,
  mockUsers,
  getUserById as getMockUserById,
  getUsersByRole as getMockUsersByRole,
} from "@/data/usersData";

// Re-export types và constants
export { roleLabels, roleColors, userStatusConfig } from "@/data/usersData";
export type { UserItem } from "@/data/usersData";

/**
 * Convert API user to UserItem format
 */
function convertApiUserToUserItem(apiUser: any): UserItem {
  return {
    id: apiUser.user_id,
    name: apiUser.name,
    email: apiUser.email,
    role: apiUser.code || "USER",
    isDeleted:
      typeof apiUser.is_deleted === "boolean"
        ? apiUser.is_deleted
        : apiUser.status === "inactive",
    avatar: apiUser.avatar_location || apiUser.avatar_url,
    phone: apiUser.phone_number,
    createdAt: apiUser.created_date
      ? new Date(apiUser.created_date).toLocaleDateString("vi-VN")
      : new Date().toLocaleDateString("vi-VN"),
    organizationId: apiUser.organization_id || apiUser.facility_id,
    organizationName: apiUser.organization_name,
    parentOrganizationName: apiUser.parent_organization_name,
  };
}

export interface UserListResponse {
  users: UserItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Lấy tất cả users từ API, nếu không thành công sử dụng mock data
 */
export async function fetchAllUsers(query?: any): Promise<UserListResponse> {
  try {
    // Map frontend query params to backend params
    const apiQuery = {
      ...query,
      q: query?.search,
      organization_id: query?.organizationId, // Map organizationId to organization_id for backend
    };

    let response;
    if (query?.role === "TEACHER") {
      response = await UserModel.getTeachers(apiQuery);
    } else if (query?.role === "STUDENT") {
      response = await UserModel.getStudents(apiQuery);
    } else {
      // Use generic /users endpoint which now exists in backend
      response = await UserModel.getAllUsers(apiQuery);
    }

    let users: UserItem[] = [];

    if (response.users && Array.isArray(response.users)) {
      users = response.users.map(convertApiUserToUserItem);
    } else if (response.teachers && Array.isArray(response.teachers)) {
      users = response.teachers.map(convertApiUserToUserItem);
    } else if (response.students && Array.isArray(response.students)) {
      users = response.students.map(convertApiUserToUserItem);
    } else if (response.content && Array.isArray(response.content)) {
      users = response.content.map(convertApiUserToUserItem);
    } else if (response.data && Array.isArray(response.data)) {
      users = response.data.map(convertApiUserToUserItem);
    } else if (Array.isArray(response)) {
      users = response.map(convertApiUserToUserItem);
    }

    return {
      users,
      total: response.total || users.length,
      page: response.page || 1,
      limit: response.limit || users.length,
      totalPages: response.totalPages || 1,
    };
  } catch (error) {
    console.error("Error fetching users from API", error);
    return {
      users: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    };
  }
}

/**
 * Lấy user theo ID từ API, nếu không thành công sử dụng mock data
 */
export async function fetchUserById(id: number): Promise<UserItem | undefined> {
  try {
    const response = await UserModel.getUserById(id);
    if (response.user) {
      return convertApiUserToUserItem(response.user);
    }
    return undefined;
  } catch (error) {
    console.error(`Error fetching user ${id} from API`, error);
    return undefined;
  }
}

/**
 * Lấy users theo role
 */
export async function fetchUsersByRole(role: string): Promise<UserItem[]> {
  try {
    const result = await fetchAllUsers({ role });
    return result.users;
  } catch (error) {
    console.error(`Error fetching users by role ${role}`, error);
    return [];
  }
}

/**
 * Lấy users theo facility
 */
export async function fetchUsersByFacility(
  organizationId: number,
): Promise<UserItem[]> {
  try {
    const [teachersRes, studentsRes] = await Promise.all([
      fetchAllUsers({ role: "TEACHER", organizationId }),
      fetchAllUsers({ role: "STUDENT", organizationId }),
    ]);
    return [...teachersRes.users, ...studentsRes.users];
  } catch (error) {
    console.error("Error fetching users by facility:", error);
    return [];
  }
}

/**
 * Lấy danh sách facility managers, nếu không thành công sử dụng mock data
 */
export async function fetchFacilityManagers(): Promise<UserItem[]> {
  return fetchUsersByRole("FACILITY_MANAGER");
}

/**
 * Tạo người dùng mới
 */
/**
 * Tạo người dùng mới
 */
/**
 * Tạo người dùng mới
 */
export async function createUser(data: any): Promise<any> {
  try {
    // Map frontend data to backend payload
    const payload: any = {
      name: data.name,
      email: data.email,
      password: data.password, // Add password
      phoneNumber: data.phone, // Map phone -> phoneNumber
      birthDay: data.birthDay,
      address: data.address,
      classRoomName: data.className,
      schoolName: data.schoolName || data.facilityName,
      organization_id: data.organizationId, // Map to organization_id (underscore for BE)
    };

    if (data.role === "TEACHER" || payload.code === "TEACHER") {
      return await UserModel.createTeacher(payload);
    } else if (data.role === "STUDENT" || payload.code === "STUDENT") {
      return await UserModel.createStudent(payload);
    }

    // Fallback for other roles or generic create if supported
    return await UserModel.createUser(payload);
  } catch (error) {
    console.error("API create user failed", error);
    throw error;
  }
}

/**
 * Cập nhật thông tin người dùng
 */
export async function updateUser(userId: number, data: any): Promise<any> {
  try {
    const payload: any = {
      ...data,
      phone_number: data.phone, // Map phone -> phone_number for update
      avatar_location: data.avatar, // Map avatar -> avatar_location
    };
    return await UserModel.updateUser(userId, payload);
  } catch (error) {
    console.error("API update user failed", error);
    throw error;
  }
}

/**
 * Xóa người dùng
 */
export async function deleteUser(userId: number): Promise<any> {
  try {
    return await UserModel.deleteUser(userId);
  } catch (error) {
    console.error("API delete user failed", error);
    throw error;
  }
}

/**
 * Khôi phục người dùng
 */
export async function restoreUser(userId: number): Promise<any> {
  try {
    return await UserModel.restoreUser(userId);
  } catch (error) {
    console.error("API restore user failed", error);
    throw error;
  }
}

/**
 * Reset mật khẩu
 */
export async function resetPassword(
  userId: number,
  newPassword: string,
): Promise<any> {
  try {
    return await UserModel.resetUserPassword(userId, newPassword);
  } catch (error) {
    console.error("API reset password failed", error);
    throw error;
  }
}

/**
 * Thay đổi vai trò
 */
export async function changeUserRole(
  userId: number,
  roleCode: string,
): Promise<any> {
  try {
    return await UserModel.changeUserRole(userId, roleCode);
  } catch (error) {
    console.error("API change role failed", error);
    throw error;
  }
}
