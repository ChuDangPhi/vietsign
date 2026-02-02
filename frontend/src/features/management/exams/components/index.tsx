"use client";

import {
  ClipboardCheck,
  Plus,
  Calendar,
  Clock,
  Users,
  FileText,
  Filter,
  BookOpen,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ExamItem } from "@/data/examsData";
import { fetchAllExams, createExam, deleteExam } from "@/services/examService";
import { fetchAllClasses } from "@/services/classService";
import {
  fetchTopicsByClassroom,
  fetchVocabulariesByTopic,
  TopicItem,
} from "@/services/topicService";
import {
  Pagination,
  usePagination,
} from "@/shared/components/common/Pagination";
import { Modal } from "@/shared/components/common/Modal";
import { ConfirmModal } from "@/shared/components/common/ConfirmModal";
import { ModalChooseQuestions } from "./ModalChooseQuestions";
import { QuestionItem } from "@/data/questionsData";

const ITEMS_PER_PAGE = 8;

export function ExamsManagement() {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [classesMap, setClassesMap] = useState<Record<number, string>>({});

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [examsData, classesData] = await Promise.all([
        fetchAllExams(),
        fetchAllClasses(),
      ]);

      // Normalize exams data if needed
      // Backend returns: exam_id, name, class_room_id, is_active, etc.
      // Need to map to ExamItem interface expected by UI or update UI
      // For now, let's map commonly used fields.
      const mappedExams = examsData.map((e: any) => ({
        ...e,
        id: e.exam_id || e.id,
        title: e.name || e.title,
        classId: e.class_room_id || e.classId,
        date: new Date(e.created_at).toLocaleDateString("vi-VN"), // Use created_at as date placeholder
        time: new Date(e.created_at).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        duration: (e.duration_minutes || 60) + " phút",
        questions: e.total_points || 0, // Placeholder
        students: 0, // Placeholder
        status: e.is_active ? "ongoing" : "completed", // Simple mapping
        type: e.exam_type || "Định kỳ",
      }));

      // Ensure unique classes by id
      const uniqueClasses = Array.isArray(classesData)
        ? classesData.filter(
            (c: any, index: number, self: any[]) =>
              index === self.findIndex((t) => t.id === c.id),
          )
        : [];

      setExams(mappedExams);
      setClasses(uniqueClasses);

      const map: Record<number, string> = {};
      classesData.forEach((c: any) => {
        map[c.id] = c.name;
      });
      setClassesMap(map);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<ExamItem | null>(null);

  const getClassName = (classId: number): string => {
    return classesMap[classId] || "Không xác định";
  };

  const filteredExams = exams.filter(
    (exam) => filterStatus === "all" || exam.status === filterStatus,
  );

  const {
    currentPage,
    totalPages,
    paginatedItems,
    paddedItems,
    setCurrentPage,
  } = usePagination(filteredExams, ITEMS_PER_PAGE);

  const openDetailPage = (exam: ExamItem) => {
    router.push(`/exams-management/${exam.id}`);
  };

  const openEditPage = (exam: ExamItem, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/exams-management/${exam.id}?edit=true`);
  };

  const openDeleteModal = (exam: ExamItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setExamToDelete(exam);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (examToDelete) {
      try {
        await deleteExam(examToDelete.id);
        setExams((prev) => prev.filter((e) => e.id !== examToDelete.id));
        setIsDeleteModalOpen(false);
        setExamToDelete(null);
      } catch (error) {
        console.error("Delete failed", error);
        alert("Xóa thất bại");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <ClipboardCheck className="w-8 h-8 text-primary-600" />
            Quản lý kiểm tra
          </h1>
          <p className="text-gray-600 mt-1">
            Tạo và quản lý các bài kiểm tra ({exams.length} bài)
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium shadow-sm"
        >
          <Plus size={20} /> Tạo bài kiểm tra
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <Filter size={20} className="text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none bg-white"
          >
            <option value="all">Tất cả</option>
            <option value="ongoing">Đang diễn ra (Active)</option>
            <option value="completed">Đã kết thúc (Inactive)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-[45%]">
                  Bài kiểm tra
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-[30%]">
                  Lớp học
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-[15%]">
                  Số câu hỏi
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 w-[10%]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : (
                paginatedItems.map((exam) => {
                  const className = getClassName(exam.classId);

                  return (
                    <tr
                      key={exam.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => openDetailPage(exam)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 min-w-[40px] rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white shadow-sm overflow-hidden border border-gray-100">
                            <FileText size={20} />
                          </div>
                          <div className="min-w-0">
                            <p
                              className="font-medium text-gray-900 truncate"
                              title={exam.title}
                            >
                              {exam.title}
                            </p>
                            <p className="text-xs text-gray-500">{exam.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BookOpen size={14} className="text-gray-400" />
                          <span className="truncate">{className}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ClipboardCheck size={14} className="text-gray-400" />
                          <span>{exam.questions} câu hỏi</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            onClick={(e) => openEditPage(exam, e)}
                            title="Chỉnh sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            onClick={(e) => openDeleteModal(exam, e)}
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredExams.length === 0 && (
          <div className="p-12 text-center border-t border-gray-100">
            <ClipboardCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy bài kiểm tra
            </h3>
            <p className="text-gray-500">Thử tìm kiếm với nội dung khác</p>
          </div>
        )}
      </div>

      {filteredExams.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={exams.length}
            filteredItems={filteredExams.length}
            itemName="bài kiểm tra"
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tạo bài kiểm tra mới"
        maxWidth="max-w-3xl"
      >
        <CreateExamForm
          onClose={() => setIsModalOpen(false)}
          classes={classes}
          refresh={loadData}
        />
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa bài kiểm tra "${examToDelete?.title}"?`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
}

function CreateExamForm({
  onClose,
  classes,
  refresh,
}: {
  onClose: () => void;
  classes: any[];
  refresh: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    classId: "",
    examType: "QUIZ", // QUIZ or PRACTICE
  });

  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<QuestionItem[]>(
    [],
  );
  const [practiceQuestions, setPracticeQuestions] = useState<any[]>([
    { content: "", topicId: "", vocabularyId: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChooseModalOpen, setIsChooseModalOpen] = useState(false);

  // Mock available questions/topics for demo/selection
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [vocabMap, setVocMap] = useState<Record<number, any[]>>({});

  useEffect(() => {
    // If classId changes, fetch relevant topics
    if (formData.classId) {
      loadTopics(Number(formData.classId));
    }
  }, [formData.classId]);

  const loadTopics = async (cid: number) => {
    const data = await fetchTopicsByClassroom(cid);
    setTopics(data);
  };

  const loadVocabs = async (tid: number) => {
    if (vocabMap[tid]) return;
    const data = await fetchVocabulariesByTopic(tid);
    setVocMap((prev) => ({ ...prev, [tid]: data }));
  };

  const addPracticeQuestion = () => {
    setPracticeQuestions([
      ...practiceQuestions,
      { content: "", topicId: "", vocabularyId: "" },
    ]);
  };

  const updatePracticeQuestion = (index: number, field: string, value: any) => {
    const list = [...practiceQuestions];
    list[index][field] = value;
    setPracticeQuestions(list);

    if (field === "topicId" && value) {
      loadVocabs(Number(value));
    }
  };

  const removePracticeQuestion = (index: number) => {
    setPracticeQuestions(practiceQuestions.filter((_, i) => i !== index));
  };

  const removeSelectedQuestion = (id: number) => {
    setSelectedQuestionIds((prev) => prev.filter((i) => i !== id));
    setSelectedQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleQuestionsSelected = (questions: QuestionItem[]) => {
    setSelectedQuestions(questions);
    setSelectedQuestionIds(questions.map((q) => q.id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createExam({
        name: formData.title,
        description: "",
        examType: formData.examType,
        classroomId: Number(formData.classId),
        durationMinutes: 60,
        totalPoints: 10,
        passingScore: 5,
        questionIds: formData.examType === "QUIZ" ? selectedQuestionIds : [],
        practiceQuestions:
          formData.examType === "PRACTICE" ? practiceQuestions : [],
        creatorId: 1,
      });
      refresh();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Tạo bài kiểm tra thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-sm font-semibold text-gray-700">
            Tên bài kiểm tra <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Nhập tên bài kiểm tra..."
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Lớp học <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.classId}
            onChange={(e) =>
              setFormData({ ...formData, classId: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            required
          >
            <option value="">Chọn lớp học</option>
            {classes.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Loại bài thi <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.examType}
            onChange={(e) =>
              setFormData({ ...formData, examType: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            required
          >
            <option value="QUIZ">Trắc nghiệm</option>
            <option value="PRACTICE">Thực hành</option>
          </select>
        </div>

        {formData.examType === "QUIZ" && (
          <div className="md:col-span-2 p-4 border-2 border-dashed border-gray-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Danh sách câu hỏi
              </span>
              <span className="text-xs text-primary-600 font-bold bg-primary-50 px-2 py-1 rounded-lg">
                {selectedQuestionIds.length} câu đã chọn
              </span>
            </div>
            <button
              type="button"
              disabled={!formData.classId}
              onClick={() => setIsChooseModalOpen(true)}
              className="w-full py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Plus size={16} /> Chọn câu hỏi từ ngân hàng
            </button>
            <p className="text-[10px] text-gray-500 italic text-center">
              Vui lòng chọn lớp học trước khi chọn câu hỏi
            </p>

            {selectedQuestions.length > 0 && (
              <div className="pt-2 space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                {selectedQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 text-xs shadow-sm"
                  >
                    <span className="truncate flex-1 font-medium">
                      {q.content}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSelectedQuestion(q.id)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <ModalChooseQuestions
          isOpen={isChooseModalOpen}
          onClose={() => setIsChooseModalOpen(false)}
          onConfirm={handleQuestionsSelected}
          classId={formData.classId}
          initialSelectedIds={selectedQuestionIds}
        />

        {formData.examType === "PRACTICE" && (
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">
                Câu hỏi thực hành
              </label>
              <button
                type="button"
                onClick={addPracticeQuestion}
                className="text-xs text-primary-600 font-bold hover:underline flex items-center gap-1"
              >
                <Plus size={14} /> Thêm câu hỏi
              </button>
            </div>
            <div className="space-y-3">
              {practiceQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 relative group"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      placeholder="Nội dung câu hỏi..."
                      value={q.content}
                      onChange={(e) =>
                        updatePracticeQuestion(idx, "content", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 md:col-span-2"
                      required
                    />
                    <select
                      value={q.topicId}
                      onChange={(e) =>
                        updatePracticeQuestion(idx, "topicId", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none bg-white"
                      required
                    >
                      <option value="">Chọn chủ đề</option>
                      {topics.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={q.vocabularyId}
                      onChange={(e) =>
                        updatePracticeQuestion(
                          idx,
                          "vocabularyId",
                          e.target.value,
                        )
                      }
                      className="px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none bg-white font-medium italic"
                      required
                      disabled={!q.topicId}
                    >
                      <option value="">Chọn từ vựng</option>
                      {(vocabMap[Number(q.topicId)] || []).map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.word}
                        </option>
                      ))}
                    </select>
                  </div>
                  {practiceQuestions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePracticeQuestion(idx)}
                      className="absolute -right-2 -top-2 w-6 h-6 bg-white border border-red-100 text-red-500 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-6 sticky bottom-0 bg-white">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm flex items-center justify-center gap-2"
        >
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          {isSubmitting ? "Đang xử lý..." : "Tạo bài thi"}
        </button>
      </div>
    </form>
  );
}
