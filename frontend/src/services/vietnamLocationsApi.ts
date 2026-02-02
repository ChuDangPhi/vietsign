import axios from "axios";

// Constants
const BASE_URL = "https://provinces.open-api.vn/api/v2"; // Updated to v2 API as requested

// Direct API Types
export interface ApiProvince {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  phone_code: number;
  districts: ApiDistrict[];
  wards?: ApiWard[];
}

export interface ApiDistrict {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  province_code: number;
  wards: ApiWard[];
}

export interface ApiWard {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  district_code: number;
}

// Application Interfaces (Mapped)
export interface Commune {
  id: string;
  name: string;
  type: string;
  latitude?: number;
  longitude?: number;
  districtId?: string;
}

export interface District {
  id: string;
  name: string;
  type: string;
  communes?: Commune[];
}

export interface Province {
  id: number;
  name: string;
  code: number;
  districts: District[];
  communes: Commune[]; // Flattened list for backward compatibility if needed, or just empty if we use districts
}

// Cache to prevent too many requests
let provincesCache: Province[] | null = null;
let provinceDetailsCache: Record<number, Province> = {};

// Fetch raw provinces (depth 1)
export async function fetchProvincesOnly(): Promise<ApiProvince[]> {
  try {
    const response = await axios.get(`${BASE_URL}/p/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return [];
  }
}

// Fetch full province details (depth 2 for wards in v2)
export async function fetchProvinceDetails(
  code: number,
): Promise<ApiProvince | null> {
  if (!code || isNaN(code)) {
    console.error(
      "Invalid province code provided to fetchProvinceDetails:",
      code,
    );
    return null;
  }

  try {
    // V2 uses depth=2 to get wards. V2 does not have districts layer for provinces.
    const response = await axios.get(`${BASE_URL}/p/${code}?depth=2`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && !error.response) {
      console.error(
        `Network Error fetching province ${code}. Check your connection or API availability.`,
      );
    } else {
      console.error(`Error fetching province ${code}:`, error);
    }
    return null;
  }
}

// Main function to get provinces with minimal data (depth 1) but mapped to App Interface
export async function fetchProvinces(): Promise<Province[]> {
  if (provincesCache) return provincesCache;

  const apiProvinces = await fetchProvincesOnly();

  const mappedProvinces: Province[] = apiProvinces.map((p) => ({
    id: p.code,
    name: p.name,
    code: p.code,
    districts: [], // Depth 1 doesn't have districts
    communes: [],
  }));

  provincesCache = mappedProvinces;
  return mappedProvinces;
}

// Get province by ID with full details (depth 2)
export async function fetchProvinceById(id: number): Promise<Province | null> {
  if (provinceDetailsCache[id]) return provinceDetailsCache[id];

  const apiProvince = await fetchProvinceDetails(id);
  if (!apiProvince) return null;

  // Map Districts and Wards
  // Check if we have districts (V1) or wards directly (V2)
  let districts: District[] = [];
  let allCommunes: Commune[] = [];

  if (apiProvince.districts && apiProvince.districts.length > 0) {
    // V1 Structure with Districts
    districts = apiProvince.districts.map((d) => ({
      id: String(d.code),
      name: d.name,
      type: d.division_type,
      communes: (d.wards || []).map((w) => ({
        id: String(w.code),
        name: w.name,
        type: w.division_type,
        districtId: String(d.code),
      })),
    }));
    allCommunes = districts.flatMap((d) => d.communes || []);
  } else if (apiProvince.wards && apiProvince.wards.length > 0) {
    // V2 Structure with direct Wards
    allCommunes = apiProvince.wards.map((w) => ({
      id: String(w.code),
      name: w.name,
      type: w.division_type,
      districtId: String(apiProvince.code), // Use province code as districtId proxy if needed
    }));
    // We leave districts empty as V2 flattens this
  }

  const mappedProvince: Province = {
    id: apiProvince.code,
    name: apiProvince.name,
    code: apiProvince.code,
    districts: districts,
    communes: allCommunes,
  };

  provinceDetailsCache[id] = mappedProvince;
  return mappedProvince;
}

// Get all wards for a province (requires fetching province details depth 3)
export async function fetchWardsByProvince(
  provinceCode: number,
): Promise<Commune[]> {
  const province = await fetchProvinceById(provinceCode);
  return province ? province.communes : [];
}

// Search (Client-side filtering after fetch)
export async function searchProvinces(query: string): Promise<Province[]> {
  const provinces = await fetchProvinces();
  const lowerQuery = query.toLowerCase();
  return provinces.filter((p) => p.name.toLowerCase().includes(lowerQuery));
}

export async function searchWards(query: string): Promise<Commune[]> {
  // This is expensive as it requires fetching all province details.
  // Ideally, search should be scoped to a province or district.
  // For now, return empty or implement if strictly needed.
  return [];
}

export async function fetchAllData(): Promise<Province[]> {
  return fetchProvinces();
}

export async function fetchCities(): Promise<Province[]> {
  return fetchProvinces(); // API doesn't distinguish City/Province in the list endpoint easily without checking division_type
}

export function clearCache() {
  provincesCache = null;
  provinceDetailsCache = {};
}

// Aliases
export const getProvinces = fetchProvinces;
export const getProvinceByCode = fetchProvinceById;
export const getWardsByProvince = fetchWardsByProvince;
export const getCities = fetchCities;
export const getProvincesList = fetchProvinces;
