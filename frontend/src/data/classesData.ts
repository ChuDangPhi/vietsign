// Classes/Courses data
// Sử dụng ID để liên kết với các bảng khác

import { getUserById, UserItem } from "./usersData";
import { getOrganizationById as getFacilityById } from "./organizationsData";

// Cấp lớp học
export type GradeLevel = "Lớp 1" | "Lớp 2" | "Lớp 3" | "Lớp 4" | "Lớp 5";

export const gradeLevels: GradeLevel[] = [
  "Lớp 1",
  "Lớp 2",
  "Lớp 3",
  "Lớp 4",
  "Lớp 5",
];

export const gradeLevelConfig: Record<
  GradeLevel,
  { label: string; color: string }
> = {
  "Lớp 1": { label: "Lớp 1", color: "bg-blue-100 text-blue-800" },
  "Lớp 2": { label: "Lớp 2", color: "bg-green-100 text-green-800" },
  "Lớp 3": { label: "Lớp 3", color: "bg-amber-100 text-amber-800" },
  "Lớp 4": { label: "Lớp 4", color: "bg-purple-100 text-purple-800" },
  "Lớp 5": { label: "Lớp 5", color: "bg-red-100 text-red-800" },
};

export interface ClassTeacher {
  id: number;
  classId: number;
  userId: number;
  createdDate: string;
}

export interface ClassStudent {
  id: number;
  classId: number;
  userId: number;
  createdDate: string;
}

export let mockClassTeachers: ClassTeacher[] = [];
export let mockClassStudents: ClassStudent[] = [];

export interface ClassItem {
  id: number;
  name: string;
  code?: string; // Mã lớp
  teacherId: number; // Primary teacher Ref
  students: number;
  maxStudents?: number;
  schedule?: string;
  startDate?: string;
  endDate?: string;
  status: string; // Allow any status from BE (APPROVED, PENDING, etc)
  organizationId: number | null; // ID cơ sở (null = Online)
  description?: string;
  classLevel: GradeLevel | string; // Allow string fallbacks
  thumbnail?: string; // Đường dẫn ảnh
}

export const mockClasses: ClassItem[] = [];

export const statusConfig: Record<string, { label: string; color: string }> = {
  ongoing: { label: "Đang diễn ra", color: "bg-green-100 text-green-800" },
  upcoming: { label: "Sắp diễn ra", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Đã hoàn thành", color: "bg-gray-100 text-gray-600" },
};

export const levels = [
  { id: "all", label: "Tất cả cấp độ" },
  { id: "basic", label: "Cơ bản" },
  { id: "advanced", label: "Nâng cao" },
  { id: "specialized", label: "Chuyên ngành" },
  { id: "special", label: "Đặc biệt" },
];

// Helper functions (Warning: These will return undefined/empty as mockClasses is empty)
export function getClassById(id: number): ClassItem | undefined {
  return mockClasses.find((c) => c.id === id);
}

export function getClassTeacherName(classId: number): string {
  // Find teacher in ClassTeacher relation
  const relation = mockClassTeachers.find((ct) => ct.classId === classId);
  if (!relation) return "Không xác định";

  const teacher = getUserById(relation.userId);
  return teacher?.name || "Không xác định";
}

export function getClassFacilityName(classId: number): string {
  const classItem = getClassById(classId);
  if (!classItem) return "Không xác định";
  if (classItem.organizationId === null) return "Online";
  const facility = getFacilityById(classItem.organizationId);
  return facility?.name || "Không xác định";
}

export function getClassesByFacility(
  organizationId: number | null,
): ClassItem[] {
  return mockClasses.filter((c) => c.organizationId === organizationId);
}

export function getClassesByTeacher(teacherId: number): ClassItem[] {
  const classIds = mockClassTeachers
    .filter((ct) => ct.userId === teacherId)
    .map((ct) => ct.classId);
  return mockClasses.filter((c) => classIds.includes(c.id));
}

export function getClassesByStatus(status: ClassItem["status"]): ClassItem[] {
  return mockClasses.filter((c) => c.status === status);
}

export function getClassesByClassLevel(classLevel: GradeLevel): ClassItem[] {
  return mockClasses.filter((c) => c.classLevel === classLevel);
}

export function getClassStudents(classId: number): UserItem[] {
  const studentRelations = mockClassStudents.filter(
    (cs) => cs.classId === classId,
  );

  return studentRelations
    .map((cs) => getUserById(cs.userId))
    .filter((u): u is UserItem => u !== undefined);
}
