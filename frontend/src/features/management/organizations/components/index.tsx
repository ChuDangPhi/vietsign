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
  MoreVertical,
  Map,
  Loader2,
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

const ITEMS_PER_PAGE = 6;

// Cache cho tên tỉnh và phường/xã
interface LocationNames {
  provinces: Record<number, string>;
  wards: Record<number, string>;
}

import { removeVietnameseTones } from "@/shared/utils/text";

export function OrganizationsManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProvince, setFilterProvince] = useState<number | "all">("all");

  // Lấy thông tin user từ Redux store
  const { user } = useSelector((state: RootState) => state.admin);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [locationNames, setLocationNames] = useState<LocationNames>({
    provinces: {},
    wards: {},
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModalProvince, setSelectedModalProvince] = useState<
    number | ""
  >("");
  // Province organization creation doesn't necessarily need ward, but keeping standard address fields
  const [modalWards, setModalWards] = useState<Commune[]>([]);
  const [loadingWards, setLoadingWards] = useState(false);

  // API Hooks
  const { data: organizationsData, isLoading, isError } = useOrganizations();
  const createMutation = useCreateOrganization();
  const deleteMutation = useDeleteOrganization();

  // Chuyển đổi dữ liệu từ API
  const allOrganizations: OrganizationItem[] = Array.isArray(organizationsData)
    ? organizationsData
    : [];

  // Lấy danh sách Tỉnh/TP (Level 1: parentId === -1)
  const provinceOrgs = allOrganizations.filter(
    (org) => org.type === "PROVINCE" || org.parentId === -1,
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] =
    useState<OrganizationItem | null>(null);

  // ===== ROLE-BASED ACCESS CONTROL =====
  const userRole = user?.role?.role || user?.code;
  const isAdmin = ["Admin", "ADMIN", "SUPER_ADMIN", "TEST"].includes(userRole);
  const isFacilityManager =
    userRole === "FacilityManager" || userRole === "FACILITY_MANAGER";
  const userOrgId = user?.organizationId || (user as any)?.organization_id;

  // If FACILITY_MANAGER, redirect to their organization's detail page
  useEffect(() => {
    if (
      !isLoading &&
      isFacilityManager &&
      userOrgId &&
      allOrganizations.length > 0
    ) {
      // Tìm tổ chức của user
      const userOrg = allOrganizations.find((org) => org.id === userOrgId);

      if (userOrg) {
        // Redirect đến trang chi tiết của tổ chức họ quản lý
        router.replace(`/organizations-management/${userOrg.id}`);
      } else {
        // Nếu là Manager nhưng không tìm thấy tổ chức được phân công,
        // thử tìm tổ chức cha (Province hoặc Department)
        // Hoặc hiển thị thông báo lỗi
        message.warning(
          "Không tìm thấy tổ chức được phân công. Vui lòng liên hệ quản trị viên.",
        );
      }
    }
  }, [isLoading, isFacilityManager, userOrgId, allOrganizations, router]);

  // Lấy danh sách tỉnh/thành phố từ API Locations để hiển thị tên
  useEffect(() => {
    async function loadProvinces() {
      try {
        const data = await fetchProvinces();
        setProvinces(data);

        // Lưu tên tỉnh vào cache
        const provinceNames: Record<number, string> = {};
        data.forEach((p: Province) => {
          provinceNames[typeof p.id === "string" ? parseInt(p.id) : p.id] =
            p.name;
        });

        // Cập nhật tên tỉnh vào cache
        setLocationNames((prev) => ({ ...prev, provinces: provinceNames }));
      } catch (error) {
        console.error("Failed to load provinces:", error);
      } finally {
        setLoadingProvinces(false);
      }
    }
    loadProvinces();
  }, []);

  // Removed Ward loading for list view as Provinces usually represent the City itself

  // Helper để lấy tên tỉnh
  const getProvinceName = (provinceCode: number): string => {
    if (!provinceCode || provinceCode <= 0) return "";
    return locationNames.provinces[provinceCode] || `Tỉnh #${provinceCode}`;
  };

  // Helper danh sách Department (Sở) thuộc Tỉnh
  const getChildDepartments = (provinceId: number) => {
    return allOrganizations.filter(
      (org) => org.type === "DEPARTMENT" && org.parentId === provinceId,
    );
  };

  // Lọc Province Org theo tìm kiếm
  const filteredOrganizations = provinceOrgs.filter((organization) => {
    const provinceName = getProvinceName(organization.city);
    const normalizedQuery = removeVietnameseTones(searchQuery);

    // Search by Org Name or Location Name
    const matchesSearch =
      removeVietnameseTones(organization.name).includes(normalizedQuery) ||
      removeVietnameseTones(provinceName).includes(normalizedQuery);

    // Filter by specific location code if used
    const matchesProvince =
      filterProvince === "all" || organization.city === filterProvince;

    return matchesSearch && matchesProvince;
  });

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedItems,
    paddedItems,
    setCurrentPage,
  } = usePagination(filteredOrganizations, ITEMS_PER_PAGE);

  // Xử lý khi chọn tỉnh trong modal
  const handleProvinceChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const provinceCode = e.target.value;
    setSelectedModalProvince(provinceCode ? Number(provinceCode) : "");
    setModalWards([]);
    // Load wards if we want to add address details to Province Entry
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

  // Mở trang chi tiết ở chế độ sửa
  const openEditPage = (
    organization: OrganizationItem,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
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

    // Kiểm tra xem Tỉnh có Sở con không
    const childDepartmentCount = getChildDepartments(organization.id).length;
    if (childDepartmentCount > 0) {
      message.warning(
        `Không thể xóa "${organization.name}" vì còn ${childDepartmentCount} Sở thuộc Tỉnh/TP này. Vui lòng xóa các Sở trước.`,
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
            error?.response?.data?.message ||
            error?.message ||
            "Xóa thất bại. Có thể tổ chức này có dữ liệu liên quan.";
          message.error(errorMessage);
          setIsDeleteModalOpen(false);
        },
      });
    }
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Thu thập dữ liệu từ form
    const street = formData.get("street") as string;
    const city = Number(selectedModalProvince);
    const ward = Number(formData.get("ward"));
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;

    // Thu thập dữ liệu từ form - Tạo Province Organization (Level 1)
    const newData = {
      name,
      type: "PROVINCE" as const,
      parentId: -1,
      street,
      city,
      ward,
      address: street, // Simplified for Province
      phone,
      email,
    };

    createMutation.mutate(newData as any, {
      onSuccess: () => {
        message.success("Thêm Tỉnh/Thành phố mới thành công");
        setIsModalOpen(false);
      },
      onError: (error: any) => {
        message.error(error.message || "Thêm mới thất bại");
      },
    });
  };

  // Show loading while checking role and potentially redirecting
  if (isLoading || (isFacilityManager && userOrgId)) {
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
    provinces: provinceOrgs.length,
    departments: allOrganizations.filter((o) => o.type === "DEPARTMENT").length,
    schools: allOrganizations.filter((o) => o.type === "SCHOOL").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Building className="w-8 h-8 text-primary-600" />
            Quản lý Tổ chức
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý cơ cấu tổ chức theo 3 cấp: Tỉnh/TP {">"} Sở GD {">"} Trường
          </p>
        </div>
        {/* Only show Add button for Admin */}
        {isAdmin && (
          <button
            onClick={() => {
              setIsModalOpen(true);
              setSelectedModalProvince("");
              setModalWards([]);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm"
          >
            <Plus size={20} /> Thêm Tỉnh/TP mới
          </button>
        )}
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Tỉnh/Thành phố</p>
          <p className="text-2xl font-bold text-purple-600">
            {countStats.provinces}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Sở Giáo dục</p>
          <p className="text-2xl font-bold text-gray-900">
            {countStats.departments}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Trường học</p>
          <p className="text-2xl font-bold text-green-600">
            {countStats.schools}
          </p>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm Tỉnh/TP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Map size={20} className="text-gray-400" />
            <select
              value={filterProvince}
              onChange={(e) =>
                setFilterProvince(
                  e.target.value === "all" ? "all" : Number(e.target.value),
                )
              }
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white min-w-[180px]"
              disabled={loadingProvinces}
            >
              <option value="all">Tất cả Tỉnh/TP</option>
              {provinces.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Danh sách Tỉnh/TP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paddedItems.map((organization, index) => {
          if (!organization)
            return (
              <div
                key={`empty-${index}`}
                className="h-[300px]"
                aria-hidden="true"
              />
            );

          const provinceName = getProvinceName(organization.city);
          const departmentCount = getChildDepartments(organization.id).length;

          return (
            <div
              key={organization.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => openDetailPage(organization)}
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors shrink-0">
                    <Map size={24} className="text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                      {organization.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {provinceName}
                      </span>
                      <span className="inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full bg-orange-50 text-orange-700 border border-orange-100">
                        {departmentCount} Sở GD
                      </span>
                    </div>
                  </div>
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building size={16} className="text-gray-400 shrink-0" />
                    <span>Cấp quản lý: Tỉnh/Thành phố</span>
                  </div>
                  {organization.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} className="text-gray-400 shrink-0" />
                      <span className="truncate">{organization.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  onClick={(e) => openEditPage(organization, e)}
                >
                  <Edit size={16} />
                  Chỉnh sửa
                </button>
                {/* Only show Delete for Admin */}
                {isAdmin && (
                  <button
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={(e) => openDeleteModal(organization, e)}
                  >
                    <Trash2 size={16} />
                    Xóa
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredOrganizations.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy Tỉnh/Thành phố
          </h3>
          <p className="text-gray-500">Thêm mới hoặc thay đổi bộ lọc</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={provinceOrgs.length}
            filteredItems={filteredOrganizations.length}
            itemName="Tỉnh/TP"
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modal thêm Tỉnh/TP mới - Only for Admin */}
      {isAdmin && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Thêm Tỉnh/Thành phố mới"
        >
          <form className="space-y-4" onSubmit={handleCreate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">
                  Tên Tỉnh/Thành phố <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ví dụ: Ủy ban Nhân dân TP Hà Nội"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Tỉnh / Thành phố (Địa lý){" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedModalProvince}
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
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Phường / Xã (Trụ sở)
                </label>
                <select
                  name="ward"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                  disabled={!selectedModalProvince || loadingWards}
                >
                  <option value="0">
                    {loadingWards
                      ? "Đang tải..."
                      : "Chọn phường/xã (Không bắt buộc)"}
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
                className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Đang lưu..." : "Lưu Tỉnh/TP"}
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
        message={`Bạn có chắc chắn muốn xóa Tỉnh/TP "${organizationToDelete?.name}" ư? Hành động này không thể hoàn tác.`}
        confirmText={deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
}
