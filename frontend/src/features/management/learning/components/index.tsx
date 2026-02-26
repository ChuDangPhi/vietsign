"use client";

import {
  BookOpen,
  Search,
  Plus,
  Users,
  Clock,
  Filter,
  Edit,
  Trash2,
  Star,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SelfLearnCourse } from "@/data/selfLearnData";
import {
  fetchAllCourses,
  createCourse,
  deleteCourse,
} from "@/services/learnService";
import { toast } from "react-hot-toast";
import { removeVietnameseTones } from "@/shared/utils/text";
import {
  Pagination,
  usePagination,
} from "@/shared/components/common/Pagination";
import { Modal } from "@/shared/components/common/Modal";
import { ConfirmModal } from "@/shared/components/common/ConfirmModal";

const ITEMS_PER_PAGE = 6;

// Status config for learning
const learningStatusConfig: Record<string, { label: string; color: string }> = {
  "not-started": {
    label: "Chưa bắt đầu",
    color: "bg-gray-100 text-gray-700",
  },
  "in-progress": {
    label: "Đang học",
    color: "bg-blue-100 text-blue-700",
  },
  completed: {
    label: "Hoàn thành",
    color: "bg-green-100 text-green-700",
  },
};

export function LearningManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for learning items
  const [learnings, setLearnings] = useState<SelfLearnCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [learningToDelete, setLearningToDelete] =
    useState<SelfLearnCourse | null>(null);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newLevel, setNewLevel] = useState("");
  const [newTotalLessons, setNewTotalLessons] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load learning items from API
        const allItems = await fetchAllCourses();
        setLearnings(allItems);
      } catch (error) {
        console.error("Failed to load learning data", error);
        setLearnings([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Get unique levels
  const uniqueLevels = Array.from(
    new Set(learnings.map((item) => item.level).filter(Boolean)),
  );

  // Filter logic
  const filteredLearnings = learnings.filter((item) => {
    const normalizedQuery = removeVietnameseTones(searchQuery);
    const matchesSearch =
      removeVietnameseTones(item.title).includes(normalizedQuery) ||
      removeVietnameseTones(item.subtitle).includes(normalizedQuery);

    const matchesLevel = filterLevel === "all" || item.level === filterLevel;

    return matchesSearch && matchesLevel;
  });

  const {
    currentPage,
    totalPages,
    paginatedItems,
    paddedItems,
    setCurrentPage,
  } = usePagination(filteredLearnings, ITEMS_PER_PAGE);

  // Get status based on progress
  const getStatus = (progress?: number) => {
    if (!progress) return "not-started";
    if (progress >= 100) return "completed";
    return "in-progress";
  };

  // Open detail page
  const openDetailPage = (learning: SelfLearnCourse) => {
    router.push(`/learning-management/${learning.id}`);
  };

  // Open edit page
  const openEditPage = (learning: SelfLearnCourse, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/learning-management/${learning.id}`);
  };

  // Open delete modal
  const openDeleteModal = (learning: SelfLearnCourse, e: React.MouseEvent) => {
    e.stopPropagation();
    setLearningToDelete(learning);
    setIsDeleteModalOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (learningToDelete) {
      try {
        await deleteCourse(learningToDelete.id);
        toast.success("Xóa khóa học thành công");
        setLearnings((prev) =>
          prev.filter((l) => l.id !== learningToDelete.id),
        );
      } catch (error) {
        toast.error("Khoá học đang được sử dụng, không thể xoá!");
      } finally {
        setIsDeleteModalOpen(false);
        setLearningToDelete(null);
      }
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    setIsSubmitting(true);
    try {
      await createCourse({
        title: newTitle,
        subtitle: newSubtitle,
        description: newSubtitle,
        level: newLevel,
        total_lessons: parseInt(newTotalLessons) || 0,
        duration: newDuration,
      });
      toast.success("Tạo khóa học thành công!");
      setIsModalOpen(false);

      // Reload data
      const allItems = await fetchAllCourses();
      setLearnings(allItems);

      // Reset form
      setNewTitle("");
      setNewSubtitle("");
      setNewLevel("");
      setNewTotalLessons("");
      setNewDuration("");
    } catch (error) {
      console.error(error);
      toast.error("Tạo khóa học thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary-600" />
            Quản lý khóa học
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý các khóa học trong hệ thống ({learnings.length} khóa học)
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm"
        >
          <Plus size={20} /> Tạo khóa học mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none bg-white"
            >
              <option value="all">Tất cả cấp độ</option>
              {uniqueLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {paddedItems.map((learning, index) => {
          if (!learning)
            return (
              <div
                key={`empty-${index}`}
                className="h-[180px]"
                aria-hidden="true"
              />
            );

          const status = getStatus(learning.progress);
          const statusInfo = learningStatusConfig[status];

          return (
            <div
              key={learning.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => openDetailPage(learning)}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl ${learning.colorClass} flex items-center justify-center text-white font-bold text-xl`}
                    >
                      {learning.title.split(" ").pop()?.substring(0, 1)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-gray-900">
                          {learning.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {learning.subtitle}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        {learning.level && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                            {learning.level}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        {learning.totalLessons && (
                          <div className="flex items-center gap-1.5">
                            <BookOpen size={16} className="text-gray-400" />
                            <span>{learning.totalLessons} bài học</span>
                          </div>
                        )}
                        {learning.duration && (
                          <div className="flex items-center gap-1.5">
                            <Clock size={16} className="text-gray-400" />
                            <span>{learning.duration}</span>
                          </div>
                        )}
                        {/* 
                            Note: 'students' and 'rating' are not in SelfLearnCourse interface currently.
                            I will comment them out or remove them.
                         */}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="flex items-center gap-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 relative">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="#E5E7EB"
                          strokeWidth="6"
                          fill="none"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="#10B981"
                          strokeWidth="6"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${
                            ((learning.progress || 0) / 100) * 175.9
                          } 175.9`}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                        {learning.progress || 0}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Tiến độ</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      onClick={(e) => openEditPage(learning, e)}
                      title="Chỉnh sửa"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={(e) => openDeleteModal(learning, e)}
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLearnings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy khóa học
          </h3>
          <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={learnings.length}
            filteredItems={filteredLearnings.length}
            itemName="khóa học"
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title="Tạo khóa học mới"
      >
        <form className="space-y-4" onSubmit={handleCreateCourse}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Tên khóa học <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập tên khóa học"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Nhập mô tả khóa học"
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                required
              />
            </div>
            {/* Category selection removed as it's not in selfLearnData */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Cấp độ <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                value={newLevel}
                onChange={(e) => setNewLevel(e.target.value)}
                required
              >
                <option value="">Chọn cấp độ</option>
                <option value="Cơ bản">Cơ bản</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Nâng cao">Nâng cao</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Số bài học <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="10"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                value={newTotalLessons}
                onChange={(e) => setNewTotalLessons(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Thời lượng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: 4 giờ"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? "Đang tạo..." : "Tạo khóa học"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa khóa học "${learningToDelete?.title}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
}
