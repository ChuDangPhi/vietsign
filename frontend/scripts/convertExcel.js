const XLSX = require('xlsx');
const fs = require('fs');

// Read Excel file
const wb = XLSX.readFile('Danh-muc-Phuong-xa_moi.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

// Skip header row
const rows = data.slice(1);

// Group by province
const provinceMap = new Map();

rows.forEach(row => {
  const provinceCode = row[1]; // Mã tỉnh (BNV)
  const provinceName = row[2]; // Tên tỉnh/TP mới
  const communeCode = row[7]; // Mã phường/xã mới
  const communeName = row[8]; // Tên Phường/Xã mới
  
  if (!provinceName || !communeName) return;
  
  if (!provinceMap.has(provinceCode)) {
    provinceMap.set(provinceCode, {
      id: provinceCode,
      name: provinceName,
      communes: []
    });
  }
  
  // Determine type from name
  let type = 'xã';
  if (communeName.startsWith('Phường')) {
    type = 'phường';
  } else if (communeName.startsWith('Thị trấn')) {
    type = 'thị trấn';
  } else if (communeName.includes('Đặc khu') || communeName.includes('đặc khu')) {
    type = 'đặc khu';
  }
  
  // Clean commune name (remove prefix)
  let cleanName = communeName
    .replace(/^Phường\s+/, '')
    .replace(/^Xã\s+/, '')
    .replace(/^Thị trấn\s+/, '');
  
  provinceMap.get(provinceCode).communes.push({
    id: String(communeCode),
    name: cleanName,
    type: type
  });
});

// Generate TypeScript content
let tsContent = `// Dữ liệu đơn vị hành chính Việt Nam sau sáp nhập 2025
// Nguồn: Danh mục phường xã mới sau sáp nhập
// 34 tỉnh/thành phố - 3321 phường/xã/đặc khu

export interface Commune {
  id: string;
  name: string;
  type: 'phường' | 'xã' | 'thị trấn' | 'đặc khu';
}

export interface Province {
  id: string;
  name: string;
  type: 'tỉnh' | 'thành phố trung ương';
  code: string;
  communes: Commune[];
}

export const provinces: Province[] = [
`;

// Sort by province code
const sortedProvinces = Array.from(provinceMap.values()).sort((a, b) => 
  String(a.id).localeCompare(String(b.id), undefined, { numeric: true })
);

sortedProvinces.forEach((province, idx) => {
  // Determine province type
  const isCity = province.name.includes('Thành phố') || province.name.includes('Tp ');
  const type = isCity ? 'thành phố trung ương' : 'tỉnh';
  
  // Create code from name
  let code = province.name
    .replace(/^Thành phố\s+/, '')
    .replace(/^Tp\s+/, '')
    .replace(/^Tỉnh\s+/, '')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase();
  
  // Clean province name
  let cleanName = province.name
    .replace(/^Thành phố\s+/, '')
    .replace(/^Tp\s+/, '')
    .replace(/^Tỉnh\s+/, '');
    
  tsContent += `  {
    id: "${province.id}",
    name: "${cleanName}",
    type: "${type}",
    code: "${code}",
    communes: [
`;
  
  province.communes.forEach((commune, cIdx) => {
    const comma = cIdx < province.communes.length - 1 ? ',' : '';
    tsContent += `      { id: "${commune.id}", name: "${commune.name}", type: "${commune.type}" }${comma}\n`;
  });
  
  const provinceComma = idx < sortedProvinces.length - 1 ? ',' : '';
  tsContent += `    ]
  }${provinceComma}
`;
});

tsContent += `];

// Helper functions
export function getProvinceById(id: string): Province | undefined {
  return provinces.find(p => p.id === id);
}

export function getCommunesByProvinceId(provinceId: string): Commune[] {
  const province = getProvinceById(provinceId);
  return province?.communes || [];
}

export function searchProvinces(query: string): Province[] {
  const lowerQuery = query.toLowerCase();
  return provinces.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.code.toLowerCase().includes(lowerQuery)
  );
}

export function searchCommunes(query: string): { province: Province; commune: Commune }[] {
  const lowerQuery = query.toLowerCase();
  const results: { province: Province; commune: Commune }[] = [];
  
  for (const province of provinces) {
    for (const commune of province.communes) {
      if (commune.name.toLowerCase().includes(lowerQuery)) {
        results.push({ province, commune });
      }
    }
  }
  
  return results;
}

export function getCities(): Province[] {
  return provinces.filter(p => p.type === 'thành phố trung ương');
}

export function getProvincesList(): Province[] {
  return provinces.filter(p => p.type === 'tỉnh');
}

// Statistics
export const stats = {
  totalProvinces: provinces.length,
  totalCommunes: provinces.reduce((sum, p) => sum + p.communes.length, 0),
  totalPhuong: provinces.reduce((sum, p) => sum + p.communes.filter(c => c.type === 'phường').length, 0),
  totalXa: provinces.reduce((sum, p) => sum + p.communes.filter(c => c.type === 'xã').length, 0),
  totalThiTran: provinces.reduce((sum, p) => sum + p.communes.filter(c => c.type === 'thị trấn').length, 0),
};
`;

fs.writeFileSync('src/data/vietnamLocationsData.ts', tsContent, 'utf8');
console.log('File created successfully!');
console.log('Total provinces:', sortedProvinces.length);
console.log('Total communes:', sortedProvinces.reduce((sum, p) => sum + p.communes.length, 0));
