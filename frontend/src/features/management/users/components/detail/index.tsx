"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
  Phone,
  Mail,
  Building,
  Calendar,
  UserCheck,
  UserX,
  RotateCcw,
  Lock,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getFacilityById, mockFacilities } from "@/data";
import {
  UserItem,
  fetchUserById,
  updateUser,
  deleteUser,
  restoreUser,
  resetPassword,
  changeUserRole,
  roleLabels,
  roleColors,
} from "@/services/userService";
import { ConfirmModal } from "@/shared/components/common/ConfirmModal";
import { Modal } from "@/shared/components/common/Modal";

export function UserManagementDetail() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);
  const [user, setUser] = useState<UserItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserItem>>({});

  // Modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [newPassword, setNewPassword] = useState("");

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUserById(id);
      if (data) {
        setUser(data);
        setEditForm({ ...data });
      }
    } catch (error) {
      console.error("Failed to load user", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id]);

  const handleSave = async () => {
    if (user && editForm) {
      try {
        // Check if role changed
        if (editForm.role && editForm.role !== user.role) {
          await changeUserRole(user.id, editForm.role);
        }

        // Check if isDeleted (status) changed
        if (
          editForm.isDeleted !== undefined &&
          editForm.isDeleted !== user.isDeleted
        ) {
          if (editForm.isDeleted) {
            await deleteUser(user.id);
          } else {
            await restoreUser(user.id);
          }
        }

        const updateData: Partial<UserItem> = { ...editForm };
        delete updateData.role; // Handle role change separately
        delete updateData.isDeleted; // Handle status change separately

        await updateUser(user.id, {
          ...updateData,
          organizationId: editForm.organizationId
            ? Number(editForm.organizationId)
            : null,
        });
        await loadUser();
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to update user", error);
      }
    }
  };

  const handleDelete = async () => {
    if (user) {
      if (id === 0) {
        // Assuming 'message' is a global or imported object, otherwise this will cause an error.
        // For now, I'll comment it out or replace with a console log to ensure syntax correctness.
        // message.info("Không tìm thấy người dùng");
        console.info("Không tìm thấy người dùng (ID is 0)");
        router.push("/users-management");
        return;
      }
      try {
        await deleteUser(user.id);
        router.push("/users-management");
      } catch (error) {
        console.error("Failed to delete user", error);
      }
    }
  };

  const handleRestore = async () => {
    if (user) {
      try {
        await restoreUser(user.id);
        await loadUser();
        setIsRestoreModalOpen(false);
      } catch (error) {
        console.error("Failed to restore user", error);
      }
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && newPassword) {
      try {
        await resetPassword(user.id, newPassword);
        setIsResetPasswordModalOpen(false);
        setNewPassword("");
        alert("Đã reset mật khẩu thành công!");
      } catch (error) {
        console.error("Failed to reset password", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500">Đang tải thông tin...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Không tìm thấy người dùng
        </h2>
        <button
          onClick={() => router.push("/users-management")}
          className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <button
          onClick={() => router.push("/users-management")}
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
        {/* Header với Avatar */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-primary-600 text-3xl font-bold overflow-hidden border-4 border-white shadow-lg">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                (user.name || "U").charAt(0)
              )}
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-white/80">{user.email}</p>
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium mt-2 bg-white/20 text-white">
                {roleLabels[user.role]}
              </span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Họ và tên
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                  {user.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editForm.email || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                  <Mail size={18} className="text-gray-400" />
                  {user.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Số điện thoại
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editForm.phone || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                  <Phone size={18} className="text-gray-400" />
                  {user.phone || "Chưa cập nhật"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Vai trò
              </label>
              {isEditing ? (
                <select
                  value={editForm.role || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                >
                  {Object.entries(roleLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      roleColors[user.role]
                    }`}
                  >
                    {roleLabels[user.role]}
                  </span>
                </p>
              )}
            </div>

            {(isEditing ||
              user.parentOrganizationName ||
              user.organizationName ||
              user.organizationId) && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Cơ sở / Đơn vị
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
                    <option value="">Chọn cơ sở...</option>
                    {mockFacilities.map((facility) => (
                      <option key={facility.id} value={facility.id}>
                        {facility.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                    <Building size={18} className="text-gray-400" />
                    {(() => {
                      const parts = [];
                      if (user.parentOrganizationName)
                        parts.push(user.parentOrganizationName);
                      if (user.organizationName)
                        parts.push(user.organizationName);

                      if (parts.length > 0) return parts.join(" > ");

                      return user.organizationId
                        ? getFacilityById(user.organizationId)?.name ||
                            `Cơ sở #${user.organizationId}`
                        : "";
                    })()}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Trạng thái
              </label>
              {isEditing ? (
                <select
                  value={editForm.isDeleted ? "inactive" : "active"}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      isDeleted: e.target.value === "inactive",
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl">
                  {!user.isDeleted ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <UserCheck size={14} />
                      Hoạt động
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      <UserX size={14} />
                      Không hoạt động
                    </span>
                  )}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Ngày tạo tài khoản
              </label>
              <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                <Calendar size={18} className="text-gray-400" />
                {user.createdAt}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 flex-wrap">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditForm({ ...user });
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
                onClick={() => setIsResetPasswordModalOpen(true)}
                className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-white transition-colors font-medium flex items-center gap-2"
                title="Reset mật khẩu"
              >
                <Lock size={18} />
                Reset Password
              </button>
              {user.isDeleted && (
                <button
                  onClick={() => setIsRestoreModalOpen(true)}
                  className="px-6 py-2.5 border border-green-200 text-green-700 bg-green-50 rounded-xl hover:bg-green-100 transition-colors font-medium flex items-center gap-2"
                  title="Khôi phục"
                >
                  <RotateCcw size={18} />
                  Khôi phục
                </button>
              )}
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
        message={`Bạn có chắc chắn muốn xóa người dùng "${user.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />

      <ConfirmModal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        onConfirm={handleRestore}
        title="Xác nhận khôi phục"
        message={`Bạn có chắc chắn muốn khôi phục người dùng "${user.name}"?`}
        confirmText="Khôi phục"
        cancelText="Hủy"
        type="info"
      />

      <Modal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        title="Reset mật khẩu"
      >
        <form className="space-y-4" onSubmit={handleResetPassword}>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              required
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsResetPasswordModalOpen(false)}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm"
            >
              Lưu
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
