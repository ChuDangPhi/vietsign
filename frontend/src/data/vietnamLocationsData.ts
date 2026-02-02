// Re-export từ API service
// Thay thế dữ liệu static bằng API từ: https://provinces.open-api.vn/api/v2

export {
  // Types
  type Commune,
  type Province,
  type ApiProvince,
  type ApiWard,
  
  // API Functions
  fetchProvinces,
  fetchProvinceById,
  fetchWardsByProvince,
  searchProvinces,
  searchWards,
  fetchAllData,
  fetchCities,
  fetchProvincesOnly,
  clearCache,
  
  // Aliases để tương thích với code cũ
  getProvinces,
  getProvinceByCode,
  getWardsByProvince,
  getCities,
  getProvincesList
} from '../services/vietnamLocationsApi';

// Deprecated: Các hàm cũ dùng data static - nay đã chuyển sang async API
// Nếu code cũ sử dụng những hàm này, cần update sang phiên bản async

/**
 * @deprecated Sử dụng fetchProvinceById() thay thế
 */
export function getProvinceById(id: string): Promise<import('../services/vietnamLocationsApi').Province | null> {
  const code = parseInt(id, 10);
  return import('../services/vietnamLocationsApi').then(api => api.fetchProvinceById(code));
}

/**
 * @deprecated Sử dụng fetchWardsByProvince() thay thế
 */
export async function getCommunesByProvinceId(provinceId: string): Promise<import('../services/vietnamLocationsApi').Commune[]> {
  const code = parseInt(provinceId, 10);
  const { fetchWardsByProvince } = await import('../services/vietnamLocationsApi');
  return fetchWardsByProvince(code);
}

/**
 * @deprecated Sử dụng searchWards() thay thế
 */
export async function searchCommunes(query: string): Promise<{ province: import('../services/vietnamLocationsApi').Province; commune: import('../services/vietnamLocationsApi').Commune }[]> {
  const { searchWards, fetchProvinces } = await import('../services/vietnamLocationsApi');
  const [wards, provinces] = await Promise.all([
    searchWards(query),
    fetchProvinces()
  ]);
  
  // Tạo kết quả tương thích với format cũ
  // Lưu ý: API mới không trả về province cho mỗi ward trong search
  // Nên hàm này chỉ trả về danh sách ward, không có thông tin province
  console.warn('searchCommunes is deprecated. Use searchWards() instead.');
  return [];
}

// Statistics - cần gọi API để lấy
export async function getStats(): Promise<{
  totalProvinces: number;
  totalCommunes: number;
  totalPhuong: number;
  totalXa: number;
  totalThiTran: number;
}> {
  const { fetchAllData } = await import('../services/vietnamLocationsApi');
  const provinces = await fetchAllData();
  
  let totalCommunes = 0;
  let totalPhuong = 0;
  let totalXa = 0;
  let totalThiTran = 0;
  
  provinces.forEach(p => {
    totalCommunes += p.communes.length;
    p.communes.forEach(c => {
      if (c.type === 'phường') totalPhuong++;
      else if (c.type === 'xã') totalXa++;
      else if (c.type === 'thị trấn') totalThiTran++;
    });
  });
  
  return {
    totalProvinces: provinces.length,
    totalCommunes,
    totalPhuong,
    totalXa,
    totalThiTran
  };
}

// Deprecated: stats object cũ - giờ cần dùng getLocationStats() async
/**
 * @deprecated Sử dụng getStats() thay thế (async function)
 */
export const locationStats = {
  totalProvinces: 0,
  totalCommunes: 0,
  totalPhuong: 0,
  totalXa: 0,
  totalThiTran: 0
};
