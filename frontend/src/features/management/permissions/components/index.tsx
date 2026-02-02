"use client";

import {
  Shield,
  Search,
  Filter,
  Lock,
  Unlock,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Permission,
  Role,
  fetchAllPermissions,
  fetchAllRoles,
  fetchRolePermissions,
  addPermissionToRole,
  removePermissionFromRole,
} from "@/services/permissionService";
import { roleLabels, roleColors } from "@/services/userService";
import { Modal } from "@/shared/components/common/Modal";

export function PermissionsManagement() {
  const [activeTab, setActiveTab] = useState<"roles" | "permissions">("roles");
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Editing state
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const [rolesData, permsData] = await Promise.all([
          fetchAllRoles(),
          fetchAllPermissions(),
        ]);
        setRoles(rolesData);
        setPermissions(permsData);
      } catch (error) {
        console.error("Failed to load initial data", error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // Open modal to edit permissions for a role
  const openEditRole = async (role: Role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
    // Fetch current permissions for this role
    try {
      const currentPerms = await fetchRolePermissions(role.code);
      setRolePermissions(currentPerms);
    } catch (error) {
      console.error("Failed to fetch role permissions", error);
      setRolePermissions([]);
    }
  };

  // Toggle permission for the selected role
  const togglePermission = async (
    permissionCode: string,
    isChecked: boolean
  ) => {
    if (!selectedRole) return;

    // Optimistic UI update could be tricky if API fails, so let's try direct API calls
    // Or we handle local state and save at the end?
    // The API provided is add/remove single permission.
    // So "Save" button approach matches better for bulk changes conceptually,
    // but the API is atomic.
    // Let's do atomic updates for now, or queue them.
    // Given the prompt lists "Add permission to role" and "Remove permission from role",
    // interactive toggling seems appropriate.

    try {
      if (isChecked) {
        await addPermissionToRole(selectedRole.code, permissionCode);
        setRolePermissions((prev) => [
          ...prev,
          permissions.find((p) => p.code === permissionCode)!,
        ]);
      } else {
        await removePermissionFromRole(selectedRole.code, permissionCode);
        setRolePermissions((prev) =>
          prev.filter((p) => p.code !== permissionCode)
        );
      }
    } catch (error) {
      console.error("Failed to update permission", error);
      // Revert local state if needed (not implemented for simplicity here)
    }
  };

  const isPermissionChecked = (code: string) => {
    return rolePermissions.some((p) => p.code === code);
  };

  // Group permissions by 'group' field
  const groupedPermissions = permissions.reduce((acc, perm) => {
    const group = perm.group || "Khác";
    if (!acc[group]) acc[group] = [];
    acc[group].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary-600" />
            Quản lý phân quyền
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý vai trò và quyền hạn trong hệ thống
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("roles")}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === "roles"
              ? "text-primary-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Vai trò hệ thống
          {activeTab === "roles" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("permissions")}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === "permissions"
              ? "text-primary-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Danh sách quyền
          {activeTab === "permissions" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></span>
          )}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : activeTab === "roles" ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Vai trò
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Mã vai trò
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Mô tả
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {roles.map((role) => (
                  <tr
                    key={role.code}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          roleColors[role.code] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {roleLabels[role.code] || role.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {role.code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {role.description || "Chưa có mô tả"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditRole(role)}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center gap-1"
                      >
                        <Lock size={16} />
                        Phân quyền
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Mã quyền
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Tên quyền
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Nhóm
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Mô tả
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {permissions.map((perm) => (
                  <tr
                    key={perm.code}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-mono text-primary-600 font-medium">
                      {perm.code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {perm.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="inline-flex px-2 py-0.5 rounded text-xs bg-gray-100 border border-gray-200 text-gray-600">
                        {perm.group || "Khác"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {perm.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Role Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Phân quyền cho vai trò: ${selectedRole?.name}`}
        maxWidth="max-w-4xl"
      >
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([group, perms]) => (
              <div key={group}>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100 sticky top-0 bg-white z-10">
                  {group}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {perms.map((perm) => {
                    const checked = isPermissionChecked(perm.code);
                    return (
                      <label
                        key={perm.code}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          checked
                            ? "bg-primary-50 border-primary-200"
                            : "bg-white border-gray-200 hover:border-primary-200 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                            checked
                              ? "bg-primary-600 border-primary-600 text-white"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          {checked && <Check size={14} strokeWidth={3} />}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={checked}
                          onChange={(e) =>
                            togglePermission(perm.code, e.target.checked)
                          }
                        />
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              checked ? "text-primary-800" : "text-gray-900"
                            }`}
                          >
                            {perm.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {perm.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-6 border-t border-gray-100 mt-6 flex justify-end">
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm"
          >
            Hoàn tất
          </button>
        </div>
      </Modal>
    </div>
  );
}
