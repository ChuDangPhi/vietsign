"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  Video,
  FileText,
  Play,
  CheckCircle,
  ChevronRight,
  GraduationCap,
  Download,
  Users,
  ClipboardCheck,
  FolderOpen,
  File,
  Link as LinkIcon,
  Plus,
  Pencil,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ClassItem, statusConfig, getClassStudents } from "@/data/classesData";
import { fetchClassById } from "@/services/classService";
import { fetchUserById } from "@/services/userService";
import {
  fetchLessonsByClassroom,
  Lesson,
  deleteLesson,
} from "@/services/lessonService";
import { mockOrganizations } from "@/data/organizationsData";
import { getUserById } from "@/data/usersData";
import {
  getExamsByClassId,
  getDocumentsByClassId,
  DocumentItem,
  ExamItem,
} from "@/data/lessonsData";
import Link from "next/link";
import { ConfirmModal } from "@/shared/components/common/ConfirmModal";
import { toast } from "react-hot-toast";

type TabType = "lessons" | "exams" | "documents" | "members";
type DeleteType = "lesson" | "exam" | "document" | "member" | null;

export function StudyDetail() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [classItem, setClassItem] = useState<ClassItem | null>(null);
  const [teacherName, setTeacherName] = useState<string>("Đang tải...");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("lessons");

  // Permission state (Simulate current user is teacher for demo)
  // In real app, check auth context -> user.id === classItem.teacherId
  const [isTeacher, setIsTeacher] = useState(false);

  // Data states
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [exams, setExams] = useState<
    (ExamItem & { studentStatus: string; score?: number })[]
  >([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: DeleteType;
    itemId: number | null;
    itemName: string;
  }>({
    isOpen: false,
    type: null,
    itemId: null,
    itemName: "",
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch class from API
        const fetchedClass = await fetchClassById(id);
        if (fetchedClass) {
          setClassItem(fetchedClass);
          if (fetchedClass.teacherId) {
            const teacher = await fetchUserById(fetchedClass.teacherId);
            setTeacherName(teacher?.name || "Không xác định");
          }
          // Simulate: If loaded, set permissions
          setIsTeacher(true);
        } else {
          setClassItem(null);
        }

        // Load lessons from API, exams and documents from mock
        const lessonsData = await fetchLessonsByClassroom(id);
        setLessons(lessonsData);
        setExams(getExamsByClassId(id));
        setDocuments(getDocumentsByClassId(id));
      } catch (error) {
        console.error("Failed to load class", error);
        setClassItem(null);
        setTeacherName("Không xác định");
        setLessons([]);
        setExams(getExamsByClassId(id));
        setDocuments(getDocumentsByClassId(id));
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  // Handlers
  const handleAdd = (type: TabType) => {
    toast.success(`Chức năng thêm ${type} (Demo)`);
    // Router push to create page or open modal
  };

  const handleEdit = (type: TabType, itemId: number) => {
    toast.success(`Chức năng sửa ${type} ${itemId} (Demo)`);
  };

  const handleDeleteClick = (
    type: DeleteType,
    itemId: number,
    itemName: string,
  ) => {
    setDeleteModal({
      isOpen: true,
      type,
      itemId,
      itemName,
    });
  };

  const handleConfirmDelete = async () => {
    const { type, itemId } = deleteModal;
    if (!type || !itemId) return;

    try {
      switch (type) {
        case "lesson":
          await deleteLesson(itemId);
          setLessons((prev) => prev.filter((i) => i.id !== itemId));
          break;
        case "exam":
          setExams((prev) => prev.filter((i) => i.id !== itemId));
          break;
        case "document":
          setDocuments((prev) => prev.filter((i) => i.id !== itemId));
          break;
        case "member":
          toast.success("Đã xóa thành viên khỏi lớp");
          break;
      }
      toast.success("Đã xóa thành công");
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Xóa thất bại");
    }
    setDeleteModal({ isOpen: false, type: null, itemId: null, itemName: "" });
  };

  const getFacilityName = (organizationId: number | null): string => {
    if (organizationId === null) return "Online";
    const facility = mockOrganizations.find((f) => f.id === organizationId);
    return facility?.name || "Không xác định";
  };

  const getDocIcon = (type: DocumentItem["type"]) => {
    switch (type) {
      case "pdf":
        return <File className="text-red-500" size={20} />;
      case "doc":
        return <FileText className="text-blue-500" size={20} />;
      case "video":
        return <Video className="text-purple-500" size={20} />;
      case "link":
        return <LinkIcon className="text-green-500" size={20} />;
      default:
        return <File className="text-gray-500" size={20} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-gray-500">Đang tải...</div>
    );
  }

  if (!classItem) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Không tìm thấy lớp học
        </h2>
        <button
          onClick={() => router.push("/study")}
          className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const statusInfo = statusConfig[classItem.status];
  const completedLessons = lessons.filter((l) => l.completed).length;
  const progress = Math.round((completedLessons / lessons.length) * 100) || 0;
  const students = getClassStudents(classItem.id);
  const teacher = getUserById(classItem.teacherId);

  const tabs = [
    {
      id: "lessons" as TabType,
      label: "Bài học",
      icon: BookOpen,
      count: lessons.length,
    },
    {
      id: "exams" as TabType,
      label: "Kiểm tra",
      icon: ClipboardCheck,
      count: exams.length,
    },
    {
      id: "documents" as TabType,
      label: "Tài liệu",
      icon: FolderOpen,
      count: documents.length,
    },
    {
      id: "members" as TabType,
      label: "Thành viên",
      icon: Users,
      count: students.length + 1,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Navigation */}
      <div className="flex items-center">
        <button
          onClick={() => router.push("/study")}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-white rounded-xl transition-all font-medium border border-transparent hover:border-gray-200 hover:shadow-sm group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Quay lại khóa học</span>
        </button>
        <div className="ml-auto">
          <span
            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
          >
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Class Header Information */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32 opacity-10 blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm border border-white/10">
                  {/* classItem.level doesn't exist on type, use hardcoded or remove */}
                  Cơ bản
                </span>
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm border border-white/10">
                  {classItem.classLevel}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-3 leading-tight">
                {classItem.name}
              </h1>
              <p className="text-primary-100 text-lg mb-6 max-w-2xl">
                {classItem.description ||
                  "Khóa học ngôn ngữ ký hiệu chuyên sâu"}
              </p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-primary-200" />
                  <span>GV: {teacherName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-primary-200" />
                  <span>{getFacilityName(classItem.organizationId)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-primary-200" />
                  <span>
                    {classItem.startDate} - {classItem.endDate}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-primary-200" />
                  <span>{classItem.schedule}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto justify-between items-center pr-4">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50/50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? "bg-primary-100 text-primary-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          {isTeacher && (
            <button
              onClick={() => handleAdd(activeTab)}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition"
            >
              <Plus size={16} /> Thêm mới
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Lessons Tab */}
        {activeTab === "lessons" && (
          <div className="divide-y divide-gray-100">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    lesson.completed
                      ? "bg-green-100 text-green-600"
                      : "bg-primary-50 text-primary-600"
                  }`}
                >
                  {lesson.completed ? (
                    <CheckCircle size={24} />
                  ) : (
                    <Play size={24} />
                  )}
                </div>

                <Link
                  href={`/study/${classItem.id}/${lesson.id}`}
                  className="flex-1 min-w-0 cursor-pointer block"
                >
                  <h3
                    className={`font-medium truncate ${
                      lesson.completed ? "text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {lesson.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {lesson.description}
                  </p>
                </Link>

                <div className="flex items-center gap-2">
                  {isTeacher && (
                    <>
                      <button
                        onClick={() => handleEdit("lessons", lesson.id)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteClick("lesson", lesson.id, lesson.name)
                        }
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                  <Link href={`/study/${classItem.id}/${lesson.id}`}>
                    <ChevronRight
                      size={20}
                      className="text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Exams Tab */}
        {activeTab === "exams" && (
          <div className="divide-y divide-gray-100">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    exam.studentStatus === "completed"
                      ? "bg-green-100 text-green-600"
                      : exam.status === "completed" // Check general status if student status is not relevant for color
                        ? "bg-amber-100 text-amber-600" // Ongoing/Expired logic might be different
                        : "bg-amber-100 text-amber-600"
                  }`}
                >
                  <ClipboardCheck size={24} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {exam.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {exam.questions} câu hỏi • {exam.duration} • Hạn:{" "}
                    {exam.date}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {isTeacher && (
                    <>
                      <button
                        onClick={() => handleEdit("exams", exam.id)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteClick("exam", exam.id, exam.title)
                        }
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                  {exam.studentStatus === "completed" &&
                  exam.score !== undefined ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {exam.score} điểm
                    </span>
                  ) : exam.studentStatus === "pending" ? (
                    <button
                      onClick={() =>
                        router.push(`/study/${id}/exam/${exam.id}`)
                      }
                      className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      Làm bài
                    </button>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      Hết hạn
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {getDocIcon(doc.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {doc.size && `${doc.size} • `}Tải lên: {doc.uploadedAt}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {isTeacher && (
                    <>
                      <button
                        onClick={() => handleEdit("documents", doc.id)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteClick("document", doc.id, doc.title)
                        }
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                  <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors">
                    <Download size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-[40%]">
                      Thành viên
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-[20%]">
                      Vai trò
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-[20%]">
                      Ngày tham gia
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-[20%]">
                      Trạng thái
                    </th>
                    {isTeacher && (
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 w-[10%]">
                        Hành động
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* Teacher Row */}
                  {teacher && (
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 min-w-[40px] rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold overflow-hidden border border-gray-100 shadow-sm">
                            {teacher.avatar ? (
                              <img
                                src={teacher.avatar}
                                alt={teacher.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              (teacher.name || "T").charAt(0)
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {teacher.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {teacher.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          Giáo viên
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {classItem.startDate}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
                          Trực tuyến
                        </span>
                      </td>
                      {isTeacher && <td className="px-6 py-4"></td>}
                    </tr>
                  )}

                  {/* Students Rows */}
                  {students.map((student) => {
                    // Mock online status: random based on ID roughly 70% online
                    const isOnline =
                      (student.id + (classItem?.id || 0)) % 3 !== 0;

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 min-w-[40px] rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-semibold overflow-hidden border border-gray-100 shadow-sm">
                              {student.avatar ? (
                                <img
                                  src={student.avatar}
                                  alt={student.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                (student.name || "S").charAt(0)
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {student.name}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Học viên
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {classItem.startDate}
                        </td>
                        <td className="px-6 py-4">
                          {isOnline ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <div className="w-2 h-2 rounded-full bg-green-600"></div>
                              Trực tuyến
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                              Ngoại tuyến
                            </span>
                          )}
                        </td>
                        {isTeacher && (
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() =>
                                handleDeleteClick(
                                  "member",
                                  student.id,
                                  student.name,
                                )
                              }
                              className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                              title="Xóa học viên khỏi lớp"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {students.length === 0 && !teacher && (
                <div className="p-12 text-center text-gray-500">
                  Chưa có thành viên nào trong lớp học này.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa ${
          deleteModal.type === "lesson"
            ? "bài học"
            : deleteModal.type === "exam"
              ? "bài kiểm tra"
              : deleteModal.type === "document"
                ? "tài liệu"
                : "thành viên"
        } "${deleteModal.itemName}" không? Hành động này không thể hoàn tác.`}
        confirmText="Xóa ngay"
        cancelText="Để tôi suy nghĩ lại"
      />
    </div>
  );
}
