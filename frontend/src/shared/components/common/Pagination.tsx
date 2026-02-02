// Pagination component chung cho các danh sách
"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;       // Tổng số items gốc (mockData.length)
  filteredItems: number;    // Số items sau khi lọc (filteredData.length)
  itemName: string;         // Ví dụ: "người dùng", "lớp học", "bài kiểm tra"
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  filteredItems,
  itemName,
  onPageChange,
}: PaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Tính toán range hiển thị
  const startItem = filteredItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredItems);

  // Tạo danh sách các trang để hiển thị
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const sideItems = 2; // Số trang hiển thị ở mỗi bên của trang hiện tại

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Luôn hiển thị trang đầu
      pages.push(1);

      // Tính khoảng range xung quanh trang hiện tại
      let startPage = Math.max(2, currentPage - sideItems);
      let endPage = Math.min(totalPages - 1, currentPage + sideItems);

      // Điều chỉnh để luôn hiển thị 5 số nếu có thể
      if (currentPage <= sideItems + 1) {
        endPage = sideItems * 2 + 1;
      } else if (currentPage >= totalPages - sideItems) {
        startPage = totalPages - sideItems * 2;
      }

      // Thêm dấu ... nếu cần ở phía trước
      if (startPage > 2) {
        pages.push('...');
      }

      // Thêm các trang trong range
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Thêm dấu ... nếu cần ở phía sau
      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      // Luôn hiển thị trang cuối
      pages.push(totalPages);
    }
    
    return pages;
  };


  if (filteredItems === 0) return null;

  return (
    <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-b-2xl">
      <p className="text-sm text-gray-600">
        Hiển thị <span className="font-medium">{startItem}-{endItem}</span> trong tổng số{" "}
        <span className="font-medium">{filteredItems}</span> {itemName}
        {filteredItems !== totalItems && (
          <span className="text-gray-400"> (lọc từ {totalItems})</span>
        )}
      </p>
      
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            Trước
          </button>
          
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-2 text-gray-400">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Sau
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

// Hook tiện ích cho pagination
export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = React.useState(1);
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);
  
  // Tạo mảng với độ dài cố định để tránh nhảy layout
  const paddedItems = [...paginatedItems];
  if (items.length > 0) {
    while (paddedItems.length < itemsPerPage) {
      paddedItems.push(null as any);
    }
  }
  
  // Reset về trang 1 khi items thay đổi
  React.useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);
  
  return {
    currentPage,
    totalPages,
    paginatedItems,
    paddedItems, // Trả về mảng đã được fill null
    setCurrentPage,
    itemsPerPage,
    totalItems: items.length,
  };
}
