"use client";

import {
  Building,
  Search,
  Plus,
  MapPin,
  Users,
  Phone,
  Mail,
  Edit,
  Trash2,
  MoreVertical,
  Map,
  User,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OrganizationItem } from "@/data";
import {
  fetchProvinces,
  fetchProvinceById,
  type Province,
  type Commune,
} from "@/services/vietnamLocationsApi";
import { fetchUsersByRole } from "@/services/userService";
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
  const [modalWards, setModalWards] = useState<Commune[]>([]);
  const [loadingWards, setLoadingWards] = useState(false);
  const [managerMap, setManagerMap] = useState<Record<number, string>>({});

  // API Hooks
  const { data: organizationsData, isLoading, isError } = useOrganizations();
  const createMutation = useCreateOrganization();
  const deleteMutation = useDeleteOrganization();

  // Chuyển đổi dữ liệu từ API - chỉ lấy DEPARTMENT (Sở GD)
  const allOrganizations: OrganizationItem[] = Array.isArray(organizationsData)
    ? organizationsData
    : [];

  // Chỉ hiển thị Sở Giáo dục (DEPARTMENT) trên trang danh sách
  const departments = allOrganizations.filter(
    (org) => org.type === "DEPARTMENT",
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] =
    useState<OrganizationItem | null>(null);

  // Lấy danh sách tỉnh/thành phố từ API
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

  // Lấy tên phường/xã từ API khi có danh sách tỉnh và organizations
  useEffect(() => {
    async function loadWards() {
      if (provinces.length === 0 || allOrganizations.length === 0) return;

      // Lấy danh sách province code từ organizations hiện có, loại bỏ các giá trị không hợp lệ
      const uniqueCityCodes: number[] = [
        ...new Set(
          allOrganizations
            .map((f: OrganizationItem) => f.city)
            .filter((city) => city && typeof city === "number" && !isNaN(city)),
        ),
      ];
      const wardNames: Record<number, string> = {};

      // Lấy thông tin phường/xã cho từng tỉnh có cơ sở song song
      await Promise.all(
        uniqueCityCodes.map(async (cityCode) => {
          try {
            const provinceDetail = await fetchProvinceById(cityCode);
            if (provinceDetail && provinceDetail.communes) {
              const wardsInCity = allOrganizations
                .filter((f: OrganizationItem) => f.city === cityCode)
                .map((f: OrganizationItem) => f.ward);

              for (const commune of provinceDetail.communes) {
                const wardCode = parseInt(commune.id);
                if (wardsInCity.includes(wardCode)) {
                  wardNames[wardCode] = commune.name;
                }
              }
            }
          } catch (error) {
            console.error(
              `Failed to load wards for province ${cityCode}:`,
              error,
            );
          }
        }),
      );

      setLocationNames((prev) => ({ ...prev, wards: wardNames }));
    }
    loadWards();
  }, [provinces, organizationsData]);

  // Helper để lấy tên tỉnh
  const getProvinceName = (provinceCode: number): string => {
    if (!provinceCode || provinceCode <= 0) return "";
    return locationNames.provinces[provinceCode] || `Tỉnh #${provinceCode}`;
  };

  // Helper để lấy tên phường/xã
  const getWardName = (wardCode: number): string => {
    if (!wardCode || wardCode <= 0) return "";
    return locationNames.wards[wardCode] || "";
  };

  // Helper để tạo địa chỉ đầy đủ
  const getFullAddress = (organization: OrganizationItem): string => {
    const parts = [];
    if (organization.street) parts.push(organization.street);

    const wardName = getWardName(organization.ward);
    if (wardName) parts.push(wardName);

    const provinceName = getProvinceName(organization.city);
    if (provinceName) parts.push(provinceName);

    return parts.length > 0 ? parts.join(", ") : "Chưa có địa chỉ";
  };

  // Lọc Sở GD theo tìm kiếm và tỉnh/thành phố
  const filteredOrganizations = departments.filter((organization) => {
    const provinceName = getProvinceName(organization.city);
    const fullAddress = getFullAddress(organization);
    const normalizedQuery = removeVietnameseTones(searchQuery);
    const matchesSearch =
      removeVietnameseTones(organization.name).includes(normalizedQuery) ||
      removeVietnameseTones(fullAddress).includes(normalizedQuery) ||
      removeVietnameseTones(provinceName).includes(normalizedQuery);
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

    if (provinceCode) {
      setLoadingWards(true);
      try {
        const provinceDetail = await fetchProvinceById(Number(provinceCode));
        if (provinceDetail && provinceDetail.communes) {
          setModalWards(provinceDetail.communes);
        }
      } catch (error) {
        console.error("Failed to load wards for modal:", error);
      } finally {
        setLoadingWards(false);
      }
    }
  };

  // Mở trang chi tiết
  const openDetailPage = (organization: OrganizationItem) => {
    if (!organization.id || isNaN(organization.id)) {
      message.error("Không thể xác định mã tổ chức này.");
      console.error("Link to detail failed: ID is missing", organization);
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

    // Kiểm tra xem Sở có trường con không
    const childSchoolCount = allOrganizations.filter(
      (org) => org.type === "SCHOOL" && org.parentId === organization.id,
    ).length;
    if (childSchoolCount > 0) {
      message.warning(
        `Không thể xóa Sở "${organization.name}" vì còn ${childSchoolCount} trường thuộc Sở này. Vui lòng xóa các trường trước.`,
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
            "Xóa thất bại. Có thể tổ chức này có dữ liệu liên quan (trường con, quản lý...).";
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

    // Lookup names for address construction
    const provinceObj = provinces.find((p) => p.id === city);
    const wardObj = modalWards.find((w) => Number(w.id) === ward);

    // Construct full address: Street, Ward, Province
    const addressParts = [street];
    if (wardObj) addressParts.push(wardObj.name);
    if (provinceObj) addressParts.push(provinceObj.name);
    const fullAddress = addressParts.join(", ");

    // Thu thập dữ liệu từ form - Tạo Sở Giáo dục
    const newData = {
      name: formData.get("name") as string,
      type: "DEPARTMENT" as const, // Trang này chỉ tạo Sở GD
      parentId: null, // Sở không có Sở cha
      street,
      city, // Map to city (code)
      ward, // Map to ward (code)
      address: fullAddress,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
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
  };

  if (isLoading) {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Building className="w-8 h-8 text-primary-600" />
            Quản lý Sở Giáo dục
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý các Sở Giáo dục và Đào tạo trong hệ thống (
            {departments.length} Sở)
          </p>
        </div>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setSelectedModalProvince("");
            setModalWards([]);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm"
        >
          <Plus size={20} /> Thêm Sở GD mới
        </button>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Tổng Sở GD</p>
          <p className="text-2xl font-bold text-gray-900">
            {departments.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Tổng Trường</p>
          <p className="text-2xl font-bold text-green-600">
            {allOrganizations.filter((o) => o.type === "SCHOOL").length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Số tỉnh/TP</p>
          <p className="text-2xl font-bold text-purple-600">
            {new Set(departments.map((f) => f.city)).size}
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
              placeholder="Tìm kiếm theo tên, địa chỉ hoặc tỉnh/thành phố..."
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
              <option value="all">Tất cả tỉnh/TP</option>
              {[
                ...new Set(
                  allOrganizations
                    .map((f: OrganizationItem) => f.city)
                    .filter(
                      (city) =>
                        city && typeof city === "number" && !isNaN(city),
                    ),
                ),
              ].map((code) => (
                <option key={code} value={code}>
                  {getProvinceName(code)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Danh sách tổ chức */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paddedItems.map((organization, index) => {
          if (!organization)
            return (
              <div
                key={`empty-${index}`}
                className="h-[350px]"
                aria-hidden="true"
              />
            );

          const fullAddress = getFullAddress(organization);
          const provinceName = getProvinceName(organization.city);
          const schoolCount = allOrganizations.filter(
            (org) => org.type === "SCHOOL" && org.parentId === organization.id,
          ).length;

          return (
            <div
              key={organization.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => openDetailPage(organization)}
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors shrink-0">
                    <Building size={24} className="text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                      {organization.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {provinceName}
                      </span>
                      <span className="inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-100">
                        {schoolCount} trường
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
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <MapPin
                      size={16}
                      className="text-gray-400 shrink-0 mt-0.5"
                    />
                    <span className="line-clamp-1">{fullAddress}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} className="text-gray-400 shrink-0" />
                      <span className="truncate">{organization.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={16} className="text-gray-400 shrink-0" />
                      <span className="truncate">{organization.email}</span>
                    </div>
                  </div>
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
                <button
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  onClick={(e) => openDeleteModal(organization, e)}
                >
                  <Trash2 size={16} />
                  Xóa
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOrganizations.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy tổ chức
          </h3>
          <p className="text-gray-500">
            Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={departments.length}
            filteredItems={filteredOrganizations.length}
            itemName="Sở GD"
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modal thêm Sở GD mới */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm Sở Giáo dục mới"
      >
        <form className="space-y-4" onSubmit={handleCreate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Tên Sở Giáo dục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Ví dụ: Sở Giáo dục và Đào tạo Hà Nội"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Địa chỉ chi tiết <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="street"
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
                Phường / Xã <span className="text-red-500">*</span>
              </label>
              <select
                name="ward"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                required
                disabled={!selectedModalProvince || loadingWards}
              >
                <option value="">
                  {loadingWards ? "Đang tải..." : "Chọn phường/xã"}
                </option>
                {modalWards.map((w) => (
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
                placeholder="organization@vietsign.edu.vn"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                required
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
              {createMutation.isPending ? "Đang lưu..." : "Lưu tổ chức"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal xác nhận xóa */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa tổ chức "${organizationToDelete?.name}" ư? Hành động này không thể hoàn tác.`}
        confirmText={deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
}
