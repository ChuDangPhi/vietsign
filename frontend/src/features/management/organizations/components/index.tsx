"use client";

import {
  Building,
  Search,
  Plus,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  School,
  ChevronRight,
  Loader2,
  GraduationCap,
  Building2,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store";
import { OrganizationItem } from "@/data";
import {
  fetchProvinces,
  fetchProvinceById,
  type Province,
  type Commune,
} from "@/services/vietnamLocationsApi";
import {
  Pagination,
  usePagination,
} from "@/shared/components/common/Pagination";
import { Modal } from "@/shared/components/common/Modal";
import { ConfirmModal } from "@/shared/components/common/ConfirmModal";
import {
  useOrganizations,
  useCreateOrganization,
  useDeleteOrganization,
} from "@/shared/hooks/useOrganizations";
import { message } from "antd";
import { removeVietnameseTones } from "@/shared/utils/text";
import { useQuery } from "@tanstack/react-query";
import { fetchUserManagedOrganizations } from "@/services/organizationService";

const ITEMS_PER_PAGE = 9;

export function OrganizationsManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "DEPARTMENT" | "SCHOOL">(
    "all",
  );

  // Lấy thông tin user từ Redux store
  const { user } = useSelector((state: RootState) => state.admin);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [locationNames, setLocationNames] = useState<Record<number, string>>(
    {},
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"DEPARTMENT" | "SCHOOL">(
    "DEPARTMENT",
  );
  const [selectedProvince, setSelectedProvince] = useState<
    number | string | ""
  >("");
  const [modalWards, setModalWards] = useState<Commune[]>([]);
  const [loadingWards, setLoadingWards] = useState(false);

  // For School creation - select parent Department
  const [selectedParentDept, setSelectedParentDept] = useState<number | "">("");

  // API Hooks
  const { data: organizationsData, isLoading, isError } = useOrganizations();
  const createMutation = useCreateOrganization();
  const deleteMutation = useDeleteOrganization();

  // Chuyển đổi dữ liệu từ API
  const allOrganizations: OrganizationItem[] = Array.isArray(organizationsData)
    ? organizationsData
    : [];

  // Lấy danh sách Sở GD (DEPARTMENT) - trực thuộc Bộ GD&ĐT (parentId === -1 hoặc null)
  const departments = allOrganizations.filter(
    (org) => org.type === "DEPARTMENT",
  );

  // Lấy danh sách Trường
  const schools = allOrganizations.filter((org) => org.type === "SCHOOL");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] =
    useState<OrganizationItem | null>(null);

  // ===== ROLE-BASED ACCESS CONTROL =====
  // user is already destructured above at line 56

  // Prioritize code for facility managers if role object is generic "User"
  const rawUserCode = user?.code || "";
  const facilityManagerRoles = [
    "FacilityManager",
    "FACILITY_MANAGER",
    "CENTER_ADMIN",
    "SCHOOL_ADMIN",
  ];

  const userRole = facilityManagerRoles.includes(rawUserCode)
    ? rawUserCode
    : user?.role?.role || user?.code;

  const isAdmin = ["Admin", "ADMIN", "SUPER_ADMIN", "TEST"].includes(userRole);
  const isFacilityManager = facilityManagerRoles.includes(userRole);

  // Get user ID for fetching managed organizations
  const userId = user?.id || (user as any)?.user_id;

  // Fetch organizations that this user manages (from organization_managers table)
  const { data: userManagedOrgIds = [] } = useQuery({
    queryKey: ["user-managed-orgs", userId],
    queryFn: async () => {
      if (!userId) return [];
      return await fetchUserManagedOrganizations(Number(userId));
    },
    enabled: !!userId && isFacilityManager,
  });

  // If FACILITY_MANAGER, redirect to their organization's detail page
  useEffect(() => {
    if (
      !isLoading &&
      isFacilityManager &&
      userManagedOrgIds.length > 0 &&
      allOrganizations.length > 0
    ) {
      // Redirect to the first organization they manage
      const firstManagedOrgId = userManagedOrgIds[0];
      router.replace(`/organizations-management/${firstManagedOrgId}`);
    }
  }, [
    isLoading,
    isFacilityManager,
    userManagedOrgIds,
    allOrganizations,
    router,
  ]);

  // Lấy danh sách tỉnh/thành phố từ API Locations
  useEffect(() => {
    async function loadProvinces() {
      try {
        const data = await fetchProvinces();
        setProvinces(data);

        const provinceNames: Record<number, string> = {};
        data.forEach((p: Province) => {
          provinceNames[typeof p.id === "string" ? parseInt(p.id) : p.id] =
            p.name;
        });
        setLocationNames(provinceNames);
      } catch (error) {
        console.error("Failed to load provinces:", error);
      } finally {
        setLoadingProvinces(false);
      }
    }
    loadProvinces();
  }, []);

  // Helper để lấy tên tỉnh
  const getProvinceName = (provinceCode: number | string): string => {
    if (!provinceCode) return "";
    // Nếu là string không phải dạng số, giả sử đó là tên tỉnh luôn
    if (typeof provinceCode === "string" && isNaN(Number(provinceCode))) {
      return provinceCode;
    }
    const code = Number(provinceCode);
    if (code <= 0) return "";
    return locationNames[code] || "";
  };

  // Helper lấy số trường thuộc Sở
  const getSchoolCount = (deptId: number) => {
    return schools.filter((s) => s.parentId === deptId).length;
  };

  // Filter organizations based on search and type
  const filteredOrganizations = allOrganizations.filter((org) => {
    // Exclude PROVINCE type (Bộ GD&ĐT level)
    if (org.type === "PROVINCE") return false;

    const normalizedQuery = removeVietnameseTones(searchQuery);
    const matchesSearch =
      removeVietnameseTones(org.name).includes(normalizedQuery) ||
      removeVietnameseTones(getProvinceName(org.city)).includes(
        normalizedQuery,
      );

    const matchesType = filterType === "all" || org.type === filterType;

    return matchesSearch && matchesType;
  });

  // Pagination
  const { currentPage, totalPages, paginatedItems, setCurrentPage } =
    usePagination(filteredOrganizations, ITEMS_PER_PAGE);

  // Xử lý khi chọn tỉnh trong modal
  const handleProvinceChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const provinceCode = e.target.value;
    setSelectedProvince(provinceCode ? Number(provinceCode) : "");
    setModalWards([]);

    if (provinceCode) {
      setLoadingWards(true);
      try {
        const provinceDetail = await fetchProvinceById(Number(provinceCode));
        if (provinceDetail && provinceDetail.communes) {
          setModalWards(provinceDetail.communes);
        }
      } catch (error) {
        console.error("Failed to load wards:", error);
      } finally {
        setLoadingWards(false);
      }
    }
  };

  // Mở trang chi tiết
  const openDetailPage = (organization: OrganizationItem) => {
    if (!organization.id || isNaN(organization.id)) {
      message.error("Không thể xác định mã tổ chức này.");
      return;
    }
    router.push(`/organizations-management/${organization.id}`);
  };

  // Mở modal xác nhận xóa
  const openDeleteModal = (
    organization: OrganizationItem,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();

    // Check children
    const childCount = allOrganizations.filter(
      (o) => o.parentId === organization.id,
    ).length;
    if (childCount > 0) {
      const childType =
        organization.type === "DEPARTMENT" ? "trường" : "đơn vị";
      message.warning(
        `Không thể xóa "${organization.name}" vì còn ${childCount} ${childType} trực thuộc.`,
      );
      return;
    }

    setOrganizationToDelete(organization);
    setIsDeleteModalOpen(true);
  };

  // Xử lý xóa
  const handleDelete = () => {
    if (organizationToDelete) {
      deleteMutation.mutate(organizationToDelete.id, {
        onSuccess: () => {
          message.success("Đã xóa tổ chức thành công");
          setIsDeleteModalOpen(false);
          setOrganizationToDelete(null);
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message || error?.message || "Xóa thất bại.";
          message.error(errorMessage);
          setIsDeleteModalOpen(false);
        },
      });
    }
  };

  // Open add modal
  const openAddModal = (type: "DEPARTMENT" | "SCHOOL") => {
    setModalType(type);
    setSelectedProvince("");
    setSelectedParentDept("");
    setModalWards([]);
    setIsModalOpen(true);
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const street = formData.get("street") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const ward = Number(formData.get("ward") || 0);

    if (modalType === "DEPARTMENT") {
      // Tạo Sở GD - trực thuộc Bộ (parentId = -1)
      const newData = {
        name,
        type: "DEPARTMENT" as const,
        parentId: -1, // Trực thuộc Bộ GD&ĐT
        street,
        city: Number(selectedProvince),
        ward,
        phone,
        email,
      };

      createMutation.mutate(newData as any, {
        onSuccess: () => {
          message.success("Thêm Sở Giáo dục mới thành công");
          setIsModalOpen(false);
        },
        onError: (error: any) => {
          message.error(error.message || "Thêm mới thất bại");
        },
      });
    } else {
      // Tạo Trường - thuộc Sở
      const parentDept = departments.find((d) => d.id === selectedParentDept);

      const newData = {
        name,
        type: "SCHOOL" as const,
        parentId: selectedParentDept,
        street,
        city: parentDept?.city || Number(selectedProvince),
        ward,
        phone,
        email,
      };

      createMutation.mutate(newData as any, {
        onSuccess: () => {
          message.success("Thêm Trường mới thành công");
          setIsModalOpen(false);
        },
        onError: (error: any) => {
          message.error(error.message || "Thêm mới thất bại");
        },
      });
    }
  };

  // Show loading while checking role
  if (isLoading || (isFacilityManager && userManagedOrgIds.length > 0)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500">
        <p>Không thể tải dữ liệu tổ chức.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Count stats
  const countStats = {
    departments: departments.length,
    schools: schools.length,
  };

  return (
    <div className="space-y-6">
      {/* Header với thông tin Bộ GD&ĐT */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
              <GraduationCap size={32} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                Bộ Giáo dục và Đào tạo
              </h1>
              <p className="text-white/80 text-sm mt-1">
                Hệ thống quản lý tổ chức giáo dục 3 cấp
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center px-4">
              <p className="text-3xl font-bold">{countStats.departments}</p>
              <p className="text-xs text-white/70">Sở GD&ĐT</p>
            </div>
            <div className="text-center px-4 border-l border-white/20">
              <p className="text-3xl font-bold">{countStats.schools}</p>
              <p className="text-xs text-white/70">Trường học</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm Sở GD hoặc Trường..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
          />
        </div>

        {/* Filter by type */}
        <select
          value={filterType}
          onChange={(e) =>
            setFilterType(e.target.value as "all" | "DEPARTMENT" | "SCHOOL")
          }
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white min-w-[160px]"
        >
          <option value="all">Tất cả đơn vị</option>
          <option value="DEPARTMENT">Sở Giáo dục</option>
          <option value="SCHOOL">Trường học</option>
        </select>

        {/* Add buttons - Only for Admin */}
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => openAddModal("DEPARTMENT")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm whitespace-nowrap"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Thêm Sở GD</span>
            </button>
            <button
              onClick={() => openAddModal("SCHOOL")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-sm whitespace-nowrap"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Thêm Trường</span>
            </button>
          </div>
        )}
      </div>

      {/* Danh sách tổ chức */}
      {paginatedItems.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy tổ chức
          </h3>
          <p className="text-gray-500">Thêm mới hoặc thay đổi bộ lọc</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedItems.map((org) => {
            const isDepartment = org.type === "DEPARTMENT";
            const provinceName = getProvinceName(org.city);
            const childCount = isDepartment ? getSchoolCount(org.id) : 0;

            // Find parent for schools
            const parentDept = !isDepartment
              ? departments.find((d) => d.id === org.parentId)
              : null;

            return (
              <div
                key={org.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer group"
                onClick={() => openDetailPage(org)}
              >
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isDepartment
                          ? "bg-indigo-50 group-hover:bg-indigo-100"
                          : "bg-green-50 group-hover:bg-green-100"
                      }`}
                    >
                      {isDepartment ? (
                        <Building2 size={22} className="text-indigo-600" />
                      ) : (
                        <School size={22} className="text-green-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            isDepartment
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {isDepartment ? "Sở GD&ĐT" : "Trường"}
                        </span>
                        {isDepartment && childCount > 0 && (
                          <span className="text-xs text-gray-500">
                            {childCount} trường
                          </span>
                        )}
                      </div>
                      <h3
                        className={`font-semibold text-gray-900 group-hover:text-${
                          isDepartment ? "indigo" : "green"
                        }-600 transition-colors line-clamp-2`}
                      >
                        {org.name}
                      </h3>
                    </div>
                    <ChevronRight
                      size={20}
                      className="text-gray-300 group-hover:text-gray-500 shrink-0"
                    />
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-50 space-y-1.5">
                    {provinceName && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={14} className="text-gray-400 shrink-0" />
                        <span className="truncate">{provinceName}</span>
                      </div>
                    )}
                    {!isDepartment && parentDept && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Building2
                          size={14}
                          className="text-gray-400 shrink-0"
                        />
                        <span className="truncate">
                          thuộc {parentDept.name}
                        </span>
                      </div>
                    )}
                    {org.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone size={14} className="text-gray-400 shrink-0" />
                        <span className="truncate">{org.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div
                  className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    onClick={() => openDetailPage(org)}
                  >
                    <Edit size={14} />
                    Chi tiết
                  </button>
                  {isAdmin && (
                    <button
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={(e) => openDeleteModal(org, e)}
                    >
                      <Trash2 size={14} />
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {filteredOrganizations.length > ITEMS_PER_PAGE && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filteredOrganizations.length}
            filteredItems={filteredOrganizations.length}
            itemName="đơn vị"
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modal thêm mới */}
      {isAdmin && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={
            modalType === "DEPARTMENT"
              ? "Thêm Sở Giáo dục mới"
              : "Thêm Trường mới"
          }
        >
          <form className="space-y-4" onSubmit={handleCreate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">
                  Tên {modalType === "DEPARTMENT" ? "Sở GD&ĐT" : "Trường"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder={
                    modalType === "DEPARTMENT"
                      ? "Ví dụ: Sở Giáo dục và Đào tạo Hà Nội"
                      : "Ví dụ: Trường THPT Chu Văn An"
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  required
                />
              </div>

              {/* Sở GD - chọn tỉnh */}
              {modalType === "DEPARTMENT" && (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Tỉnh / Thành phố <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                    required
                  >
                    <option value="">Chọn tỉnh/TP</option>
                    {provinces.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Trường - chọn Sở cha */}
              {modalType === "SCHOOL" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Thuộc Sở GD&ĐT <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedParentDept}
                      onChange={(e) => {
                        setSelectedParentDept(
                          e.target.value ? Number(e.target.value) : "",
                        );
                        // Auto-select province based on department
                        const dept = departments.find(
                          (d) => d.id === Number(e.target.value),
                        );
                        if (dept) {
                          if (dept.city) {
                            setSelectedProvince(dept.city);
                            // Load wards for the province
                            if (typeof dept.city === "number") {
                              setLoadingWards(true);
                              fetchProvinceById(dept.city)
                                .then((prov) => {
                                  if (prov?.communes)
                                    setModalWards(prov.communes);
                                })
                                .finally(() => setLoadingWards(false));
                            }
                          }
                        }
                      }}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                      required
                    >
                      <option value="">Chọn Sở GD&ĐT</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Tỉnh / Thành phố
                    </label>
                    <input
                      type="text"
                      value={getProvinceName(Number(selectedProvince)) || "---"}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                      disabled
                    />
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Phường / Xã
                </label>
                <select
                  name="ward"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                  disabled={
                    (modalType === "DEPARTMENT" && !selectedProvince) ||
                    (modalType === "SCHOOL" && !selectedParentDept) ||
                    loadingWards
                  }
                >
                  <option value="0">
                    {loadingWards ? "Đang tải..." : "Chọn phường/xã"}
                  </option>
                  {modalWards.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  name="street"
                  placeholder="Số nhà, đường..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder=""
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder=""
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                className={`flex-1 px-4 py-2.5 text-white rounded-xl transition-colors font-medium shadow-sm ${
                  modalType === "DEPARTMENT"
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending
                  ? "Đang lưu..."
                  : `Lưu ${modalType === "DEPARTMENT" ? "Sở GD" : "Trường"}`}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal xác nhận xóa */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa "${organizationToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmText={deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
}
