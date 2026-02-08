import { useState, useEffect } from "react";
import { Modal } from "@/shared/components/common/Modal";
import { createExam, updateExam, ExamItem } from "@/services/examService";
import { toast } from "react-hot-toast";

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classId: number;
  organizationId: number | null;
  initialData?: ExamItem | null;
}

export function ExamModal({
  isOpen,
  onClose,
  onSuccess,
  classId,
  organizationId,
  initialData,
}: ExamModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration_minutes: 60,
    exam_type: "QUIZ", // QUIZ or PRACTICE
    passing_score: 5,
    total_points: 10,
    is_private: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || initialData.name || "",
        description: initialData.description || "",
        duration_minutes:
          parseInt(String(initialData.duration).replace(/\D/g, "")) || 60,
        exam_type: initialData.examType || "QUIZ",
        passing_score: initialData.passingScore || 5,
        total_points: initialData.questions || 10,
        is_private: initialData.isPrivate ? 1 : 0,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        duration_minutes: 60,
        exam_type: "QUIZ",
        passing_score: 5,
        total_points: 10,
        is_private: 0,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        class_room_id: classId,
        organization_id: organizationId,
        // Ensure defaults
        practice_questions: [],
        question_ids: [],
      };

      if (initialData) {
        await updateExam(initialData.id, payload);
        toast.success("Cập nhật bài kiểm tra thành công");
      } else {
        await createExam(payload);
        toast.success("Tạo bài kiểm tra thành công");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(initialData ? "Cập nhật thất bại" : "Tạo mới thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Chỉnh sửa bài kiểm tra" : "Thêm bài kiểm tra mới"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên bài kiểm tra <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại bài thi
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
              value={formData.exam_type}
              onChange={(e) =>
                setFormData({ ...formData, exam_type: e.target.value })
              }
            >
              <option value="QUIZ">Trắc nghiệm (Quiz)</option>
              <option value="PRACTICE">Thực hành (Practice)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian (phút)
            </label>
            <input
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
              value={formData.duration_minutes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration_minutes: parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Điểm tối đa
            </label>
            <input
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
              value={formData.total_points}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  total_points: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Điểm đạt
            </label>
            <input
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
              value={formData.passing_score}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  passing_score: parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isLoading
              ? "Đang lưu..."
              : initialData
                ? "Lưu thay đổi"
                : "Tạo bài kiểm tra"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
