"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Plus,
  GripVertical,
  Video,
  FileText,
  HelpCircle,
  Layers,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SelfLearnCourse, SelfLearnLesson } from "@/data/selfLearnData";
import {
  fetchCourseById,
  fetchLessonsByCourseId,
  fetchStepsByLessonId,
} from "@/services/learnService";
import {
  BaseStepItem,
  StepType,
  stepTypeMeta,
} from "@/shared/components/common/step";
import { ConfirmModal } from "@/shared/components/common/ConfirmModal";
import { Modal } from "@/shared/components/common/Modal";

// Step type options for creating/editing steps
const stepTypeOptions: { value: StepType; label: string }[] = [
  { value: "vocabulary", label: "Từ vựng" },
  { value: "sentence", label: "Câu mẫu" },
  { value: "quiz-video-to-text", label: "Quiz: Video → Chữ" },
  { value: "quiz-text-to-video", label: "Quiz: Chữ → Video" },
  { value: "quiz-input", label: "Quiz: Nhập đáp án" },
  { value: "match-video-to-text", label: "Nối video với chữ" },
  { value: "flip-card", label: "Lật thẻ" },
  { value: "true-false", label: "Đúng/Sai" },
];

export function LearningManagementDetail() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);
  const [course, setCourse] = useState<SelfLearnCourse | null>(null);
  const [lessons, setLessons] = useState<SelfLearnLesson[]>([]);
  const [stepsMap, setStepsMap] = useState<Record<number, BaseStepItem[]>>({});

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<SelfLearnCourse>>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Expanded lessons state
  const [expandedLessons, setExpandedLessons] = useState<number[]>([]);

  // Step editing states
  const [editingStep, setEditingStep] = useState<BaseStepItem | null>(null);
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [stepFormData, setStepFormData] = useState<Partial<BaseStepItem>>({});
  const [currentLessonId, setCurrentLessonId] = useState<number | null>(null);

  // Lesson editing states
  const [editingLesson, setEditingLesson] = useState<SelfLearnLesson | null>(
    null,
  );
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [lessonFormData, setLessonFormData] = useState<
    Partial<SelfLearnLesson>
  >({});

  useEffect(() => {
    const initData = async () => {
      try {
        const foundCourse = await fetchCourseById(id);
        if (foundCourse) {
          setCourse(foundCourse);
          setEditForm({ ...foundCourse });

          // Load lessons
          const courseLessons = await fetchLessonsByCourseId(id);
          setLessons(courseLessons);

          // Pre-load steps for all lessons
          const stepsData: Record<number, BaseStepItem[]> = {};
          for (const lesson of courseLessons) {
            stepsData[lesson.id] = await fetchStepsByLessonId(lesson.id);
          }
          setStepsMap(stepsData);
        }
      } catch (error) {
        console.error("Failed to load course", error);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, [id]);

  // Toggle lesson expansion
  const toggleLesson = (lessonId: number) => {
    setExpandedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId],
    );
  };

  // Open step edit modal
  const openStepEditModal = (step: BaseStepItem, lessonId: number) => {
    setEditingStep(step);
    setStepFormData({ ...step });
    setCurrentLessonId(lessonId);
    setIsStepModalOpen(true);
  };

  // Open step create modal
  const openStepCreateModal = (lessonId: number) => {
    setEditingStep(null);
    setStepFormData({
      title: "",
      type: "vocabulary" as StepType,
      word: "",
      videoUrl: "",
      description: "",
    });
    setCurrentLessonId(lessonId);
    setIsStepModalOpen(true);
  };

  // Save step changes
  const handleSaveStep = () => {
    if (!currentLessonId) return;

    setStepsMap((prev) => {
      const lessonSteps = [...(prev[currentLessonId] || [])];

      if (editingStep) {
        // Update existing step
        const idx = lessonSteps.findIndex((s) => s.id === editingStep.id);
        if (idx !== -1) {
          lessonSteps[idx] = {
            ...lessonSteps[idx],
            ...stepFormData,
          } as BaseStepItem;
        }
      } else {
        // Create new step
        const newId = currentLessonId * 100 + (lessonSteps.length + 1);
        const newStep: BaseStepItem = {
          id: newId,
          title: stepFormData.title || "Bước mới",
          type: stepFormData.type || "vocabulary",
          order: lessonSteps.length + 1,
          completed: false,
          ...stepFormData,
        };
        lessonSteps.push(newStep);
      }

      return { ...prev, [currentLessonId]: lessonSteps };
    });

    setIsStepModalOpen(false);
    setEditingStep(null);
    setStepFormData({});
  };

  // Delete step
  const handleDeleteStep = (stepId: number, lessonId: number) => {
    setStepsMap((prev) => {
      const lessonSteps = (prev[lessonId] || []).filter((s) => s.id !== stepId);
      return { ...prev, [lessonId]: lessonSteps };
    });
  };

  // Open lesson create modal
  const openLessonCreateModal = () => {
    setEditingLesson(null);
    setLessonFormData({
      title: "",
      description: "",
      duration: "15 phút",
    });
    setIsLessonModalOpen(true);
  };

  // Open lesson edit modal
  const openLessonEditModal = (lesson: SelfLearnLesson) => {
    setEditingLesson(lesson);
    setLessonFormData({ ...lesson });
    setIsLessonModalOpen(true);
  };

  // Save lesson changes
  const handleSaveLesson = () => {
    if (editingLesson) {
      // Update existing lesson
      setLessons((prev) =>
        prev.map((l) =>
          l.id === editingLesson.id
            ? ({ ...l, ...lessonFormData } as SelfLearnLesson)
            : l,
        ),
      );
    } else {
      // Create new lesson
      const newId = id * 100 + lessons.length + 1;
      const newLesson: SelfLearnLesson = {
        id: newId,
        courseId: id,
        title: lessonFormData.title || "Bài học mới",
        description: lessonFormData.description || "",
        duration: lessonFormData.duration || "15 phút",
        order: lessons.length + 1,
        completed: false,
        stepsCount: 0,
      };
      setLessons((prev) => [...prev, newLesson]);
      // Initialize empty steps for new lesson
      setStepsMap((prev) => ({ ...prev, [newId]: [] }));
    }

    setIsLessonModalOpen(false);
    setEditingLesson(null);
    setLessonFormData({});
  };

  // Delete lesson
  const handleDeleteLesson = (lessonId: number) => {
    setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    setStepsMap((prev) => {
      const newMap = { ...prev };
      delete newMap[lessonId];
      return newMap;
    });
  };

  // Save course changes
  const handleSave = async () => {
    if (course && editForm) {
      try {
        const updatedCourse = { ...course, ...editForm } as SelfLearnCourse;
        setCourse(updatedCourse);
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to update course", error);
      }
    }
  };

  // Delete course
  const handleDelete = async () => {
    if (course) {
      try {
        router.push("/learning-management");
      } catch (error) {
        console.error("Failed to delete course", error);
      }
    }
  };

  // Get icon for step type
  const getStepIcon = (type: StepType) => {
    switch (type) {
      case "vocabulary":
        return <FileText size={16} className="text-blue-500" />;
      case "sentence":
        return <Layers size={16} className="text-green-500" />;
      case "quiz-video-to-text":
      case "quiz-text-to-video":
      case "quiz-input":
        return <HelpCircle size={16} className="text-purple-500" />;
      default:
        return <Video size={16} className="text-gray-500" />;
    }
  };

  if (!course) {
    if (isLoading)
      return (
        <div className="flex justify-center py-20 text-gray-500">
          Đang tải...
        </div>
      );
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Không tìm thấy khóa học
        </h2>
        <button
          onClick={() => router.push("/learning-management")}
          className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const progress = course.progress || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <button
          onClick={() => router.push("/learning-management")}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-white rounded-xl transition-all font-medium border border-transparent hover:border-gray-200 hover:shadow-sm group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Quay lại danh sách</span>
        </button>
      </div>

      {/* Course Info Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header with gradient */}
        <div className={`${course.colorClass} p-8`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                {course.title.split(" ").pop()?.substring(0, 1)}
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  {course.level && (
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-white/20">
                      {course.level}
                    </span>
                  )}
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-white/20">
                    {lessons.length} bài học
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center text-white">
              <div className="w-20 h-20 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="white"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${progress * 2.26} 226`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                  {Math.round(progress)}%
                </span>
              </div>
              <p className="text-xs text-white/80 mt-1">Tiến độ</p>
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="p-6 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Tên khóa học
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.title || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                  {course.title}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Cấp độ
              </label>
              {isEditing ? (
                <select
                  value={editForm.level || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, level: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="Cơ bản">Cơ bản</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Nâng cao">Nâng cao</option>
                </select>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                  {course.level}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Mô tả
              </label>
              {isEditing ? (
                <textarea
                  value={editForm.description || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                  {course.description || course.subtitle}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Thời lượng
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.duration || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, duration: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                  <Clock size={18} className="text-gray-400" />
                  {course.duration}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Lessons & Steps Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BookOpen size={20} className="text-primary-600" />
              Danh sách bài học & bước học
              <span className="text-sm font-normal text-gray-500">
                ({lessons.length} bài)
              </span>
            </h2>
            {isEditing && (
              <button
                onClick={openLessonCreateModal}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <Plus size={16} />
                Thêm bài học
              </button>
            )}
          </div>

          <div className="space-y-3">
            {lessons.map((lesson) => {
              const isExpanded = expandedLessons.includes(lesson.id);
              const lessonSteps = stepsMap[lesson.id] || [];

              return (
                <div
                  key={lesson.id}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  {/* Lesson Header */}
                  <div
                    onClick={() => toggleLesson(lesson.id)}
                    className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown size={20} className="text-gray-500" />
                      ) : (
                        <ChevronRight size={20} className="text-gray-500" />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {lesson.description} • {lessonSteps.length} bước
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {lesson.duration}
                      </span>
                      {lesson.completed && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          Hoàn thành
                        </span>
                      )}
                      {isEditing && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openLessonEditModal(lesson);
                            }}
                            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Sửa bài học"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLesson(lesson.id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa bài học"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Steps List */}
                  {isExpanded && (
                    <div className="p-4 bg-white space-y-2">
                      {lessonSteps.map((step, stepIndex) => {
                        const meta = stepTypeMeta[step.type] || {
                          label: step.type,
                          color: "bg-gray-100 text-gray-700",
                        };

                        return (
                          <div
                            key={step.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 flex items-center justify-center text-xs font-medium text-gray-500 bg-white rounded-full border">
                                {stepIndex + 1}
                              </span>
                              {getStepIcon(step.type)}
                              <div>
                                <p className="font-medium text-gray-900 text-sm">
                                  {step.title}
                                </p>
                                <span
                                  className={`inline-flex px-2 py-0.5 text-xs rounded-full ${meta.color}`}
                                >
                                  {meta.label}
                                </span>
                              </div>
                            </div>

                            {isEditing && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openStepEditModal(step, lesson.id);
                                  }}
                                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                  title="Chỉnh sửa"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteStep(step.id, lesson.id);
                                  }}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Xóa"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Add Step Button - only in edit mode */}
                      {isEditing && (
                        <button
                          onClick={() => openStepCreateModal(lesson.id)}
                          className="flex items-center gap-2 w-full p-3 text-sm text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary-300 transition-colors"
                        >
                          <Plus size={16} />
                          Thêm bước học mới
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditForm({ ...course });
                }}
                className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-white transition-colors font-medium flex items-center gap-2"
              >
                <X size={18} />
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium flex items-center gap-2"
              >
                <Save size={18} />
                Lưu thay đổi
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-white transition-colors font-medium flex items-center gap-2"
              >
                <Edit size={18} />
                Chỉnh sửa thông tin
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
              >
                <Trash2 size={18} />
                Xóa khóa học
              </button>
            </>
          )}
        </div>
      </div>

      {/* Step Edit Modal */}
      <Modal
        isOpen={isStepModalOpen}
        onClose={() => setIsStepModalOpen(false)}
        title={editingStep ? "Chỉnh sửa bước học" : "Thêm bước học mới"}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={stepFormData.title || ""}
              onChange={(e) =>
                setStepFormData({ ...stepFormData, title: e.target.value })
              }
              placeholder="Nhập tiêu đề bước học"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Loại bước <span className="text-red-500">*</span>
            </label>
            <select
              value={stepFormData.type || "vocabulary"}
              onChange={(e) =>
                setStepFormData({
                  ...stepFormData,
                  type: e.target.value as StepType,
                })
              }
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              {stepTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic fields based on step type */}
          {(stepFormData.type === "vocabulary" ||
            stepFormData.type === "sentence") && (
            <>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Từ vựng / Câu
                </label>
                <input
                  type="text"
                  value={stepFormData.word || stepFormData.sentence || ""}
                  onChange={(e) =>
                    setStepFormData({
                      ...stepFormData,
                      word: e.target.value,
                      sentence: e.target.value,
                    })
                  }
                  placeholder="Nhập từ vựng hoặc câu"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  URL Video
                </label>
                <input
                  type="text"
                  value={stepFormData.videoUrl || ""}
                  onChange={(e) =>
                    setStepFormData({
                      ...stepFormData,
                      videoUrl: e.target.value,
                    })
                  }
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </>
          )}

          {(stepFormData.type === "quiz-video-to-text" ||
            stepFormData.type === "quiz-input") && (
            <>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  URL Video câu hỏi
                </label>
                <input
                  type="text"
                  value={stepFormData.questionVideoUrl || ""}
                  onChange={(e) =>
                    setStepFormData({
                      ...stepFormData,
                      questionVideoUrl: e.target.value,
                    })
                  }
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {stepFormData.type === "quiz-input" && (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Đáp án đúng
                  </label>
                  <input
                    type="text"
                    value={stepFormData.correctAnswer || ""}
                    onChange={(e) =>
                      setStepFormData({
                        ...stepFormData,
                        correctAnswer: e.target.value,
                      })
                    }
                    placeholder="Nhập đáp án đúng"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Mô tả (tùy chọn)
            </label>
            <textarea
              value={stepFormData.description || ""}
              onChange={(e) =>
                setStepFormData({
                  ...stepFormData,
                  description: e.target.value,
                })
              }
              placeholder="Nhập mô tả cho bước học"
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsStepModalOpen(false)}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSaveStep}
              className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
            >
              {editingStep ? "Lưu thay đổi" : "Thêm bước"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Lesson Edit Modal */}
      <Modal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        title={editingLesson ? "Chỉnh sửa bài học" : "Thêm bài học mới"}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={lessonFormData.title || ""}
              onChange={(e) =>
                setLessonFormData({ ...lessonFormData, title: e.target.value })
              }
              placeholder="Nhập tiêu đề bài học"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Mô tả</label>
            <textarea
              value={lessonFormData.description || ""}
              onChange={(e) =>
                setLessonFormData({
                  ...lessonFormData,
                  description: e.target.value,
                })
              }
              placeholder="Nhập mô tả bài học"
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Thời lượng
            </label>
            <input
              type="text"
              value={lessonFormData.duration || ""}
              onChange={(e) =>
                setLessonFormData({
                  ...lessonFormData,
                  duration: e.target.value,
                })
              }
              placeholder="VD: 15 phút"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsLessonModalOpen(false)}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSaveLesson}
              className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
            >
              {editingLesson ? "Lưu thay đổi" : "Thêm bài học"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa khóa học "${course.title}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
}
