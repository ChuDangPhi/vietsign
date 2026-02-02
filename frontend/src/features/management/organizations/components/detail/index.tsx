"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
  MapPin,
  Phone,
  Mail,
  Users,
  User,
  Calendar,
  Building,
  Loader2,
  GraduationCap,
  School,
  UserCheck,
  UserX,
  Plus,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { OrganizationItem } from "@/data";
import {
  fetchProvinces,
  fetchProvinceById,
  type Province,
  type Commune,
} from "@/services/vietnamLocationsApi";
import { ConfirmModal } from "@/shared/components/common/ConfirmModal";
import {
  useOrganization,
  useUpdateOrganization,
  useDeleteOrganization,
  useCreateOrganization,
} from "@/shared/hooks/useOrganizations";
import { message } from "antd";
import { roleLabels, roleColors, UserItem } from "@/services/userService";
import {
  Pagination,
  usePagination,
} from "@/shared/components/common/Pagination";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsersByFacility, fetchUsersByRole } from "@/services/userService";
import {
  assignOrganizationManager,
  revokeOrganizationManager,
} from "@/services/organizationService";
import { Modal } from "@/shared/components/common/Modal";
import { useOrganizations } from "@/shared/hooks/useOrganizations";

// --- Sub-component for User Table ---
const UserListTable = ({
  users,
  emptyMessage,
  onRevoke,
}: {
  users: UserItem[];
  emptyMessage: string;
  onRevoke?: (user: UserItem) => void;
}) => {
  const router = useRouter();
  const {
    currentPage,
    totalPages,
    paginatedItems,
    setCurrentPage,
    itemsPerPage,
    totalItems,
  } = usePagination(users || [], 10);

  if (!users || users.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-[40%]">
                Người dùng
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-[20%]">
                Vai trò
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-[20%]">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 w-[20%]">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedItems.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => router.push(`/users-management/${user.id}`)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 min-w-[40px] rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold overflow-hidden border border-gray-100 shadow-sm">
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
                    <div className="min-w-0">
                      <p
                        className="font-medium text-gray-900 truncate"
                        title={user.name}
                      >
                        {user.name}
                      </p>
                      <p
                        className="text-sm text-gray-500 truncate"
                        title={user.email}
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      roleColors[user.role] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {roleLabels[user.role] || user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
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
                </td>
                <td className="px-6 py-4">
                  <div
                    className="flex items-center justify-end gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/users-management/${user.id}`);
                      }}
                      title="Xem chi tiết"
                    >
                      <Edit size={18} />
                    </button>
                    {onRevoke && (
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRevoke(user);
                        }}
                        title="Hủy quyền quản lý"
                      >
                        <UserX size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          filteredItems={totalItems}
          itemName="người dùng"
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export function OrganizationDetail() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  // API Hooks
  const { data: organization, isLoading, isError } = useOrganization(id);
  const updateMutation = useUpdateOrganization();
  const deleteMutation = useDeleteOrganization();
  const createMutation = useCreateOrganization();

  // Fetch users separately - with error handling
  const { data: facilityUsers = [], isError: usersError } = useQuery({
    queryKey: ["users", "facility", id],
    queryFn: async () => {
      try {
        return await fetchUsersByFacility(id);
      } catch (e) {
        console.error("Failed to fetch facility users:", e);
        return [];
      }
    },
    enabled: !!id,
    retry: false, // Don't retry on user API failures
  });

  const managers = (facilityUsers || []).filter(
    (u) => u.role === "FACILITY_MANAGER",
  );
  const teachers = (facilityUsers || []).filter((u) => u.role === "TEACHER");
  const students = (facilityUsers || []).filter((u) => u.role === "STUDENT");

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<OrganizationItem>>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Add School Modal State
  const [isAddSchoolModalOpen, setIsAddSchoolModalOpen] = useState(false);
  const [addSchoolProvince, setAddSchoolProvince] = useState<number | "">("");
  const [addSchoolWards, setAddSchoolWards] = useState<Commune[]>([]);
  const [loadingAddSchoolWards, setLoadingAddSchoolWards] = useState(false);

  // Manager Assignment State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAssignUser, setSelectedAssignUser] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: potentialManagers = [] } = useQuery({
    queryKey: ["users", "potential-managers"],
    queryFn: async () => {
      const teachers = await fetchUsersByRole("TEACHER");
      // Filter out those who are already managers of THIS facility is handled in UI render
      return teachers;
    },
    enabled: isAssignModalOpen,
  });

  const assignMutation = useMutation({
    mutationFn: assignOrganizationManager,
    onSuccess: () => {
      message.success("Gán quản lý thành công");
      setIsAssignModalOpen(false);
      setSelectedAssignUser("");
      queryClient.invalidateQueries({ queryKey: ["users", "facility", id] });
    },
    onError: (error: any) => {
      message.error(error.message || "Gán quản lý thất bại");
    },
  });

  const revokeMutation = useMutation({
    mutationFn: revokeOrganizationManager,
    onSuccess: () => {
      message.success("Hủy quyền quản lý thành công");
      queryClient.invalidateQueries({ queryKey: ["users", "facility", id] });
    },
    onError: (error: any) => {
      message.error(error.message || "Hủy quyền thất bại");
    },
  });

  const handleAssignManager = () => {
    if (!selectedAssignUser) return;
    assignMutation.mutate({
      organization_id: id,
      user_id: Number(selectedAssignUser),
      role_in_org: "FACILITY_MANAGER",
      is_primary: true, // Default to true or let user choose? Requirement says "is_primary: true -> others demoted". For simplicity, set true.
    });
  };

  const handleRevokeManager = (user: UserItem) => {
    // Confirm logic handled by window.confirm below
    // Since I don't want to add another modal state right now, and the requirement was just "DELETE" endpoint support,
    // I will use window.confirm for now or trusting the user.
    // Wait, I should better use a confirmation.
    if (
      window.confirm(
        `Bạn có chắc chắn muốn hủy quyền quản lý của ${user.name}?`,
      )
    ) {
      revokeMutation.mutate({
        organization_id: id,
        user_id: user.id,
      });
    }
  };

  const [provinceName, setProvinceName] = useState<string>("");
  const [wardName, setWardName] = useState<string>("");

  const [activeTab, setActiveTab] = useState<
    "info" | "managers" | "teachers" | "students" | "schools"
  >("info");

  // Fetch all organizations to find children/parent
  const { data: allOrgs = [] } = useOrganizations();

  // Lấy danh sách trường con nếu là Sở Giáo dục
  const childSchools = React.useMemo(() => {
    if (organization?.type !== "DEPARTMENT" || !Array.isArray(allOrgs))
      return [];
    return allOrgs.filter(
      (org: OrganizationItem) =>
        org.type === "SCHOOL" && org.parentId === organization.id,
    );
  }, [organization, allOrgs]);

  // Lấy thông tin Sở cha nếu là Trường
  const parentDepartment = React.useMemo(() => {
    if (
      organization?.type !== "SCHOOL" ||
      !organization.parentId ||
      !Array.isArray(allOrgs)
    )
      return null;
    return allOrgs.find(
      (org: OrganizationItem) => org.id === organization.parentId,
    );
  }, [organization, allOrgs]);

  const [provincesList, setProvincesList] = useState<Province[]>([]);
  const [activeWards, setActiveWards] = useState<Commune[]>([]);

  useEffect(() => {
    fetchProvinces().then(setProvincesList).catch(console.error);
  }, []);

  useEffect(() => {
    if (organization) {
      setEditForm({ ...organization });
      loadLocationNames(organization.city, organization.ward);
    }
  }, [organization]);

  // Load wards when province changes in editForm
  useEffect(() => {
    if (editForm.city) {
      fetchProvinceById(editForm.city).then((p) => {
        if (p && p.communes) setActiveWards(p.communes);
        else setActiveWards([]);
      });
    } else {
      setActiveWards([]);
    }
  }, [editForm.city]);

  const loadLocationNames = async (cityCode: number, wardCode: number) => {
    if (!cityCode || isNaN(cityCode) || cityCode <= 0) return;

    try {
      const provinces = await fetchProvinces();
      const province = provinces.find((p: Province) => p.id === cityCode);
      if (province) {
        setProvinceName(province.name);

        if (!wardCode || isNaN(wardCode) || wardCode <= 0) return;
        const provinceDetail = await fetchProvinceById(cityCode);
        if (provinceDetail?.communes) {
          const ward = provinceDetail.communes.find(
            (c: Commune) => Number(c.id) === wardCode,
          );
          if (ward) setWardName(ward.name);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load location names for:",
        { cityCode, wardCode },
        error,
      );
    }
  };

  // Load wards when province changes in Add School form
  useEffect(() => {
    if (addSchoolProvince) {
      setLoadingAddSchoolWards(true);
      fetchProvinceById(addSchoolProvince)
        .then((p) => {
          if (p && p.communes) setAddSchoolWards(p.communes);
          else setAddSchoolWards([]);
        })
        .finally(() => setLoadingAddSchoolWards(false));
    } else {
      setAddSchoolWards([]);
    }
  }, [addSchoolProvince]);

  // Handler to create a new school under this department
  const handleCreateSchool = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newSchoolData = {
      name: formData.get("name") as string,
      type: "SCHOOL" as const,
      parentId: id, // This department's ID
      street: formData.get("address") as string,
      city: Number(addSchoolProvince),
      ward: Number(formData.get("ward")),
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
    };

    createMutation.mutate(newSchoolData as any, {
      onSuccess: () => {
        message.success("Thêm trường mới thành công");
        setIsAddSchoolModalOpen(false);
        setAddSchoolProvince("");
        setAddSchoolWards([]);
        queryClient.invalidateQueries({ queryKey: ["organizations"] });
      },
      onError: (error: any) => {
        message.error(error.message || "Thêm trường thất bại");
      },
    });
  };

  const handleSave = () => {
    if (organization && editForm) {
      // Construct full address
      const province = provincesList.find((p) => p.id === editForm.city);
      const ward = activeWards.find((w) => Number(w.id) === editForm.ward);

      const addressParts = [editForm.street];
      if (ward) addressParts.push(ward.name);
      if (province) addressParts.push(province.name);
      const fullAddress = addressParts.filter(Boolean).join(", ");

      const payload = { ...editForm, address: fullAddress };

      updateMutation.mutate(
        { id: organization.id, data: payload },
        {
          onSuccess: () => {
            message.success("Cập nhật thành công");
            setIsEditing(false);
          },
          onError: (error: any) => {
            message.error(error.message || "Cập nhật thất bại");
          },
        },
      );
    }
  };

  const handleDelete = () => {
    if (organization) {
      deleteMutation.mutate(organization.id, {
        onSuccess: () => {
          message.success("Xóa thành công");
          router.push("/organizations-management");
        },
        onError: (error: any) => {
          message.error(error.message || "Xóa thất bại");
        },
      });
    }
  };

  const getFullAddress = () => {
    if (!organization) return "";
    const parts = [];
    if (organization.street) parts.push(organization.street);
    if (wardName) parts.push(wardName);
    if (provinceName) parts.push(provinceName); // Province name lấy từ API locations
    return parts.length > 0 ? parts.join(", ") : "Chưa cập nhật địa chỉ";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  // Handle case where organization is null or undefined after loading
  const currentOrganization = organization;

  if (isError || !currentOrganization) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Không tìm thấy tổ chức
        </h2>
        <button
          onClick={() => router.push("/organizations-management")}
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
          onClick={() => {
            // Nếu là Trường, quay lại trang chi tiết Sở cha
            if (currentOrganization.type === "SCHOOL" && parentDepartment) {
              router.push(`/organizations-management/${parentDepartment.id}`);
            } else {
              // Nếu là Sở, quay lại danh sách
              router.push("/organizations-management");
            }
          }}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-white rounded-xl transition-all font-medium border border-transparent hover:border-gray-200 hover:shadow-sm group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>
            {currentOrganization.type === "SCHOOL" && parentDepartment
              ? `Quay lại ${parentDepartment.name}`
              : "Quay lại danh sách"}
          </span>
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner Header */}
        <div
          className={`bg-gradient-to-r ${currentOrganization.type === "DEPARTMENT" ? "from-indigo-500 to-purple-600" : "from-primary-500 to-primary-600"} p-8`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <Building size={32} className="text-white" />
              </div>
              <div className="text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${currentOrganization.type === "DEPARTMENT" ? "bg-white/30" : "bg-white/20"}`}
                  >
                    {currentOrganization.type === "DEPARTMENT"
                      ? "Sở Giáo dục"
                      : "Trường"}
                  </span>
                </div>
                <h1 className="text-2xl font-bold">
                  {currentOrganization.name}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  {provinceName && (
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-white/20">
                      {provinceName}
                    </span>
                  )}
                  {parentDepartment && (
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-white/20">
                      thuộc {parentDepartment.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-6 text-white text-center">
              {currentOrganization.type === "DEPARTMENT" ? (
                <>
                  <div>
                    <p className="text-3xl font-bold">{childSchools.length}</p>
                    <p className="text-xs text-white/80">Trường</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{managers.length}</p>
                    <p className="text-xs text-white/80">Quản lý</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-3xl font-bold">{students.length}</p>
                    <p className="text-xs text-white/80">Học sinh</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{teachers.length}</p>
                    <p className="text-xs text-white/80">Giáo viên</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-8 pt-4 gap-6 bg-white overflow-x-auto">
          <button
            onClick={() => setActiveTab("info")}
            className={`pb-4 px-2 font-medium text-sm flex items-center gap-2 transition-colors relative ${
              activeTab === "info"
                ? "text-primary-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Building size={18} />
            Thông tin chung
            {activeTab === "info" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
            )}
          </button>

          {/* Tab Trường - chỉ hiện với DEPARTMENT */}
          {currentOrganization.type === "DEPARTMENT" && (
            <button
              onClick={() => setActiveTab("schools")}
              className={`pb-4 px-2 font-medium text-sm flex items-center gap-2 transition-colors relative ${
                activeTab === "schools"
                  ? "text-primary-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <School size={18} />
              Danh sách Trường ({childSchools.length})
              {activeTab === "schools" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
              )}
            </button>
          )}

          <button
            onClick={() => setActiveTab("managers")}
            className={`pb-4 px-2 font-medium text-sm flex items-center gap-2 transition-colors relative ${
              activeTab === "managers"
                ? "text-primary-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <User size={18} />
            Quản lý ({managers.length})
            {activeTab === "managers" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
            )}
          </button>

          {/* Tab Giáo viên/Học sinh - chỉ hiện với SCHOOL */}
          {currentOrganization.type === "SCHOOL" && (
            <>
              <button
                onClick={() => setActiveTab("teachers")}
                className={`pb-4 px-2 font-medium text-sm flex items-center gap-2 transition-colors relative ${
                  activeTab === "teachers"
                    ? "text-primary-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <School size={18} />
                Giáo viên ({teachers.length})
                {activeTab === "teachers" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("students")}
                className={`pb-4 px-2 font-medium text-sm flex items-center gap-2 transition-colors relative ${
                  activeTab === "students"
                    ? "text-primary-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <GraduationCap size={18} />
                Học sinh ({students.length})
                {activeTab === "students" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
                )}
              </button>
            </>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-8 bg-white min-h-[400px]">
          {activeTab === "info" && (
            <div className="animate-in fade-in duration-300">
              {/* Info Section (Old Content) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Tên tổ chức
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
                      {currentOrganization.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Địa chỉ chi tiết
                  </label>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">
                            Tỉnh / Thành phố
                          </label>
                          <select
                            value={editForm.city || ""}
                            onChange={(e) => {
                              setEditForm({
                                ...editForm,
                                city: Number(e.target.value),
                                ward: 0, // Reset ward
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="">Chọn Tỉnh/TP</option>
                            {provincesList.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">
                            Phường / Xã
                          </label>
                          <select
                            value={editForm.ward || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                ward: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                            disabled={!editForm.city}
                          >
                            <option value="">Chọn Phường/Xã</option>
                            {activeWards.map((w) => (
                              <option key={w.id} value={w.id}>
                                {w.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Số nhà, đường
                        </label>
                        <input
                          type="text"
                          value={editForm.street || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              street: e.target.value,
                            })
                          }
                          placeholder="Số nhà, tên đường..."
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                      <MapPin
                        size={18}
                        className="text-gray-400 flex-shrink-0"
                      />
                      {getFullAddress()}
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
                      {currentOrganization.phone}
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
                      {currentOrganization.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Quản lý
                  </label>
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                    <User size={18} className="text-gray-400" />
                    {managers.length > 0
                      ? managers.map((m) => m.name).join(", ")
                      : "Chưa có quản lý"}
                  </p>
                </div>

                {currentOrganization.createdAt && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Ngày tạo
                    </label>
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                      <Calendar size={18} className="text-gray-400" />
                      {currentOrganization.createdAt}
                    </p>
                  </div>
                )}

                {/* Edit Controls for Info Tab */}
                <div className="md:col-span-2 flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({ ...currentOrganization });
                        }}
                        className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-white transition-colors font-medium flex items-center gap-2"
                      >
                        <X size={18} />
                        Hủy
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium flex items-center gap-2"
                        disabled={updateMutation.isPending}
                      >
                        <Save size={18} />
                        {updateMutation.isPending
                          ? "Đang lưu..."
                          : "Lưu thay đổi"}
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
            </div>
          )}

          {activeTab === "managers" && (
            <div className="animate-in fade-in duration-300 space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition"
                >
                  <Plus size={16} /> Thêm quản lý
                </button>
              </div>
              <UserListTable
                users={managers}
                emptyMessage="Chưa có quản lý nào được gán cho cơ sở này"
                onRevoke={handleRevokeManager}
              />
            </div>
          )}

          {/* Schools Tab - Danh sách trường thuộc Sở */}
          {activeTab === "schools" &&
            currentOrganization.type === "DEPARTMENT" && (
              <div className="animate-in fade-in duration-300">
                {/* Add School Button */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setIsAddSchoolModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition"
                  >
                    <Plus size={18} /> Thêm trường
                  </button>
                </div>

                {childSchools.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                    <School className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Chưa có trường nào thuộc Sở Giáo dục này</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {childSchools.map((school) => (
                      <div
                        key={school.id}
                        onClick={() =>
                          router.push(`/organizations-management/${school.id}`)
                        }
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                      >
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors shrink-0">
                              <School size={24} className="text-primary-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                                {school.name}
                              </h3>
                              <div className="flex items-center gap-3 mt-2">
                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                  <MapPin
                                    size={16}
                                    className="text-gray-400 shrink-0"
                                  />
                                  <span className="line-clamp-1">
                                    {school.street || "Chưa có địa chỉ"}
                                  </span>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-50">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone
                                    size={16}
                                    className="text-gray-400 shrink-0"
                                  />
                                  <span className="truncate">
                                    {school.phone}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Mail
                                    size={16}
                                    className="text-gray-400 shrink-0"
                                  />
                                  <span className="truncate">
                                    {school.email}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          {activeTab === "teachers" && (
            <div className="animate-in fade-in duration-300">
              <UserListTable
                users={teachers}
                emptyMessage="Chưa có giáo viên nào tại cơ sở này"
              />
            </div>
          )}

          {activeTab === "students" && (
            <div className="animate-in fade-in duration-300">
              <UserListTable
                users={students}
                emptyMessage="Chưa có học sinh nào tại cơ sở này"
              />
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa tổ chức "${currentOrganization.name}"? Hành động này không thể hoàn tác.`}
        confirmText={deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
        cancelText="Hủy"
        type="danger"
      />

      {/* Modal Assign Manager */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Gán quản lý cơ sở"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Chọn người dùng
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
              value={selectedAssignUser}
              onChange={(e) => setSelectedAssignUser(e.target.value)}
            >
              <option value="">-- Chọn người dùng --</option>
              {potentialManagers
                .filter((u) => !managers.some((m) => m.id === u.id)) // Exclude existing managers
                .map((user: UserItem) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email}) - {roleLabels[user.role]}
                  </option>
                ))}
            </select>
          </div>
          <p className="text-sm text-gray-500">
            Người được chọn sẽ trở thành quản lý chính của cơ sở này.
          </p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setIsAssignModalOpen(false)}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              onClick={handleAssignManager}
              disabled={!selectedAssignUser || assignMutation.isPending}
              className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {assignMutation.isPending ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal thêm Trường */}
      <Modal
        isOpen={isAddSchoolModalOpen}
        onClose={() => {
          setIsAddSchoolModalOpen(false);
          setAddSchoolProvince("");
          setAddSchoolWards([]);
        }}
        title="Thêm Trường mới"
      >
        <form className="space-y-4" onSubmit={handleCreateSchool}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Tên Trường <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Ví dụ: Trường THPT Nguyễn Huệ"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                placeholder="Số nhà, tên đường..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Tỉnh / Thành phố <span className="text-red-500">*</span>
              </label>
              <select
                value={addSchoolProvince}
                onChange={(e) => setAddSchoolProvince(Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                required
              >
                <option value="">Chọn Tỉnh/TP</option>
                {provincesList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Phường / Xã <span className="text-red-500">*</span>
              </label>
              <select
                name="ward"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                required
                disabled={!addSchoolProvince || loadingAddSchoolWards}
              >
                <option value="">
                  {loadingAddSchoolWards ? "Đang tải..." : "Chọn Phường/Xã"}
                </option>
                {addSchoolWards.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="024..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="school@vietsign.edu.vn"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsAddSchoolModalOpen(false);
                setAddSchoolProvince("");
                setAddSchoolWards([]);
              }}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Đang lưu..." : "Lưu trường"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
