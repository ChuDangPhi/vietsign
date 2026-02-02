"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
  Users,
  Calendar,
  Clock,
  User,
  Building,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ClassItem, statusConfig } from "@/data";
import {
  fetchClassById,
  updateClass,
  deleteClass,
} from "@/services/classService";
import { fetchUserById, fetchUsersByRole } from "@/services/userService";
import {
  fetchAllOrganizations,
  OrganizationItem,
} from "@/services/organizationService";
import { ConfirmModal } from "@/shared/components/common/ConfirmModal";

export function ClassManagementDetail() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);
  const [classItem, setClassItem] = useState<ClassItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ClassItem>>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State for teachers list and current teacher name
  const [teachers, setTeachers] = useState<any[]>([]);
  const [teacherName, setTeacherName] = useState<string>("Đang tải...");

  // State for organizations
  const [facilities, setFacilities] = useState<OrganizationItem[]>([]);
  const [facilitiesMap, setFacilitiesMap] = useState<Record<number, string>>(
    {},
  );

  // Load class and teachers
  // Load class and teachers
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true); // Start loading

      try {
        console.log("[ClassDetail] Fetching class ID:", id);

        // 1. Fetch Class Content FIRST
        const fetchedClass = await fetchClassById(id);
        console.log("[ClassDetail] Fetched class:", fetchedClass);

        if (fetchedClass) {
          setClassItem(fetchedClass);
          setEditForm({ ...fetchedClass });
          setIsLoading(false); // Valid class found -> Show UI immediately

          // 2. Fetch Auxiliary Data (Teachers, Facilities) in background
          try {
            const [teachersList, facilitiesList] = await Promise.all([
              fetchUsersByRole("TEACHER"),
              fetchAllOrganizations(),
            ]);

            setTeachers(teachersList);
            setFacilities(facilitiesList);

            // Map facilities
            const fMap: Record<number, string> = {};
            facilitiesList.forEach((f: any) => {
              fMap[f.id] = f.name;
            });
            setFacilitiesMap(fMap);

            // Fetch Teacher Name logic
            if (fetchedClass.teacherId) {
              const t = teachersList.find(
                (u: any) => u.id === fetchedClass.teacherId,
              );
              if (t) {
                setTeacherName(t.name);
              } else {
                // Try fetch individual user if not in list
                fetchUserById(fetchedClass.teacherId)
                  .then((teacher) => {
                    setTeacherName(teacher?.name || "Chi tiết gv không có");
                  })
                  .catch(() => setTeacherName("Lỗi lấy tên gv"));
              }
            } else {
              setTeacherName("Chưa phân công");
            }
          } catch (auxError) {
            console.error("Failed to load auxiliary data", auxError);
          }
        } else {
          // Class not found
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to load class", error);
        setIsLoading(false);
      }
    };

    if (id) {
      initData();
    }
  }, [id]);

  const getFacilityName = (organizationId: number | null): string => {
    if (organizationId === null) return "Online";
    if (organizationId === undefined) return "Không xác định";
    return facilitiesMap[organizationId] || `Cơ sở #${organizationId}`;
  };

  const handleSave = async () => {
    if (classItem && editForm) {
      try {
        // Optimistic update
        const updatedItem = { ...classItem, ...editForm } as ClassItem;
        setClassItem(updatedItem);
        setIsEditing(false);

        await updateClass(classItem.id, editForm);
      } catch (error) {
        console.error("Failed to update class", error);
        // Revert or show error
      }
    }
  };

  const handleDelete = async () => {
    if (classItem) {
      try {
        await deleteClass(classItem.id);
        router.push("/classes-management");
      } catch (error) {
        console.error("Failed to delete class", error);
      }
    }
  };

  if (!classItem) {
    if (isLoading)
      return (
        <div className="flex justify-center py-20 text-gray-500">
          Đang tải...
        </div>
      );
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Không tìm thấy lớp học
        </h2>
        <button
          onClick={() => router.push("/classes-management")}
          className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const statusMap: Record<string, { label: string; color: string }> = {
    APPROVED: { label: "Đã duyệt", color: "bg-green-100 text-green-800" },
    PENDING: { label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-800" },
    REJECTED: { label: "từ chối", color: "bg-red-100 text-red-800" },
    ongoing: { label: "Đang diễn ra", color: "bg-green-100 text-green-800" },
    upcoming: { label: "Sắp diễn ra", color: "bg-blue-100 text-blue-800" },
    completed: { label: "Đã hoàn thành", color: "bg-gray-100 text-gray-800" },
  };

  const statusInfo = statusMap[classItem.status] || {
    label: classItem.status,
    color: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <button
          onClick={() => router.push("/classes-management")}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-white rounded-xl transition-all font-medium border border-transparent hover:border-gray-200 hover:shadow-sm group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Quay lại danh sách</span>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                {classItem.name.split(" ").pop()}
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{classItem.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-white/20">
                    {statusInfo.label}
                  </span>
                  {classItem.classLevel && (
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-white/20">
                      {classItem.classLevel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Tên lớp học
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all text-lg font-medium"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 text-lg font-bold">
                  {classItem.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Giáo viên phụ trách
              </label>
              {isEditing ? (
                <select
                  value={editForm.teacherId || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      teacherId: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                >
                  <option value="">Chọn giáo viên</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                  <User size={18} className="text-gray-400" />
                  {teacherName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Cơ sở đào tạo
              </label>
              {isEditing ? (
                <select
                  value={editForm.organizationId || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      organizationId: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                >
                  <option value="">Học Online</option>
                  {facilities.map((facility) => (
                    <option key={facility.id} value={facility.id}>
                      {facility.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                  <Building size={18} className="text-gray-400" />
                  {getFacilityName(classItem.organizationId)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Trạng thái
              </label>
              {isEditing ? (
                <select
                  value={editForm.status || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      status: e.target.value as ClassItem["status"],
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                >
                  <option value="ongoing">Đang diễn ra</option>
                  <option value="upcoming">Sắp diễn ra</option>
                  <option value="completed">Đã hoàn thành</option>
                </select>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl">
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </p>
              )}
            </div>

            {(classItem.description || isEditing) && (
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">
                  Mô tả
                </label>
                {isEditing ? (
                  <textarea
                    value={editForm.description || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                    {classItem.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditForm({ ...classItem });
                }}
                className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-white transition-colors font-medium flex items-center gap-2"
              >
                <X size={18} />
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium flex items-center gap-2"
              >
                <Save size={18} />
                Lưu thay đổi
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-white transition-colors font-medium flex items-center gap-2"
              >
                <Edit size={18} />
                Chỉnh sửa
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
              >
                <Trash2 size={18} />
                Xóa
              </button>
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa lớp học "${classItem.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
}
