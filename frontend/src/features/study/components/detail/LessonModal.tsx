import { useState, useEffect } from "react";
import { Modal } from "@/shared/components/common/Modal";
import { createLesson, updateLesson, Lesson } from "@/services/lessonService";
import { toast } from "react-hot-toast";
import { fetchTopicsByClassroom, TopicItem } from "@/services/topicService";

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classId: number;
  organizationId: number | null;
  initialData?: Lesson | null;
}

export function LessonModal({
  isOpen,
  onClose,
  onSuccess,
  classId,
  organizationId,
  initialData,
}: LessonModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    content: "",
    video_url: "",
    difficulty_level: "BEGINNER",
    order_number: 1,
    is_active: 1,
    topic_id: "",
  });
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || "",
        content: initialData.content || "",
        video_url: "", // Video URL might not be in basic lesson object or separate
        difficulty_level: initialData.difficulty_level || "BEGINNER",
        order_number: initialData.order_number || 1,
        is_active: initialData.is_active || 1,
        topic_id: String(initialData.topic_id || ""),
      });
    } else {
      setFormData({
        name: "",
        description: "",
        content: "",
        video_url: "",
        difficulty_level: "BEGINNER",
        order_number: 1,
        is_active: 1,
        topic_id: "",
      });
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (isOpen && classId) {
      fetchTopicsByClassroom(classId).then(setTopics).catch(console.error);
    }
  }, [isOpen, classId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        classroom_id: classId,
        organization_id: organizationId,
        topic_id: formData.topic_id ? Number(formData.topic_id) : null,
      };

      if (initialData) {
        await updateLesson(initialData.id, payload);
        toast.success("Cập nhật bài học thành công");
      } else {
        await createLesson(payload);
        toast.success("Tạo bài học thành công");
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
      title={initialData ? "Chỉnh sửa bài học" : "Thêm bài học mới"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên bài học <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chủ đề
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
            value={formData.topic_id}
            onChange={(e) =>
              setFormData({ ...formData, topic_id: e.target.value })
            }
          >
            <option value="">Chọn chủ đề (Tùy chọn)</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Độ khó
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
              value={formData.difficulty_level}
              onChange={(e) =>
                setFormData({ ...formData, difficulty_level: e.target.value })
              }
            >
              <option value="BEGINNER">Cơ bản</option>
              <option value="INTERMEDIATE">Trung bình</option>
              <option value="ADVANCED">Nâng cao</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thứ tự
            </label>
            <input
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
              value={formData.order_number}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order_number: parseInt(e.target.value),
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
                : "Tạo bài học"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
