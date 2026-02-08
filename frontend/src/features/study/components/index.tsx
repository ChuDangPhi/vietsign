"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Info,
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
} from "lucide-react";
import { ClassItem } from "@/data/classesData";
import { fetchAllClasses } from "@/services/classService";
import { fetchUsersByRole } from "@/services/userService";

import Link from "next/link";

import { ClassRegistrationModal } from "./ClassRegistrationModal";

import { useSelector } from "react-redux";
import { RootState } from "@/core/store";

export const Study: React.FC = () => {
  // Get user from Redux store for consistency
  const { user: currentUser } = useSelector((state: RootState) => state.admin);

  const [registeredClasses, setRegisteredClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teachersMap, setTeachersMap] = useState<Record<number, string>>({});
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const userId = currentUser?.id || (currentUser as any)?.user_id;
        const userRole =
          currentUser?.role?.role ||
          currentUser?.role ||
          (currentUser as any)?.code;

        const teachers = await fetchUsersByRole("TEACHER");

        // Create teacher map
        const map: Record<number, string> = {};
        teachers.forEach((t: any) => {
          map[t.id] = t.name;
        });
        setTeachersMap(map);

        let myClasses: ClassItem[] = [];

        if (currentUser && userId) {
          if (userRole === "TEACHER" || userRole === "Teacher") {
            // Giáo viên: Lấy các lớp mình phụ trách
            // Pass correct teacherId parameters
            myClasses = await fetchAllClasses({ teacherId: userId });
          } else {
            // STUDENT & TEST roles: Lấy các lớp đã đăng ký qua endpoint /my-classes
            try {
              const ClassModel = (await import("@/domain/entities/Class"))
                .default;
              const response = await ClassModel.getStudentClasses();
              const data = response.data || response;
              myClasses = Array.isArray(data)
                ? data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    teacherId: item.teacherId,
                    organizationId: item.organizationId,
                    organizationName: item.organizationName,
                    schedule: item.schedule,
                    status: item.status,
                    students: item.students || 0,
                    maxStudents: item.maxStudents,
                    startDate: item.startDate,
                    endDate: item.endDate,
                    classLevel: item.classLevel,
                    code: item.classCode,
                    thumbnail: item.thumbnailPath,
                  }))
                : [];
            } catch (e) {
              console.error("Error fetching student classes:", e);
              // Fallback to studentId query
              myClasses = await fetchAllClasses({ studentId: userId });
            }
          }
        }

        setRegisteredClasses(myClasses);
      } catch (error) {
        console.error("Failed to load classes", error);
        setRegisteredClasses([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  // Helper to get teacher name
  const getTeacherName = (teacherId: number) => {
    return teachersMap[teacherId] || `GV ID: ${teacherId}`;
  };

  const handleRegisterSuccess = (newClass: ClassItem) => {
    // Check if class already exists
    if (!registeredClasses.some((c) => c.id === newClass.id)) {
      setRegisteredClasses([...registeredClasses, newClass]);
    }
    setIsRegistrationModalOpen(false);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary-600" />
            Lớp học của tôi
          </h1>
          <p className="text-gray-600 mt-1">
            {currentUser?.role === "TEACHER"
              ? `Danh sách các lớp bạn đang giảng dạy (${registeredClasses.length} lớp)`
              : `Danh sách các lớp học bạn đã đăng ký (${registeredClasses.length} lớp)`}
          </p>
        </div>
        {currentUser?.role !== "TEACHER" && (
          <button
            onClick={() => setIsRegistrationModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm"
          >
            Đăng ký lớp mới
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* Class List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {registeredClasses.length > 0 ? (
          registeredClasses.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
            >
              <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600 p-6 relative">
                <div className="absolute top-4 right-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm border border-white/10`}
                  >
                    {cls.classLevel || "Cơ bản"}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-white font-bold text-xl line-clamp-2">
                    {cls.name}
                  </h3>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-primary-500" />
                    <span>GV: {getTeacherName(cls.teacherId)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-primary-500" />
                    <span>
                      {cls.startDate} - {cls.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary-500" />
                    <span>{cls.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary-500" />
                    <span>{cls.organizationName || "Online"}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <Link
                    href={`/study/${cls.id}`}
                    className="w-full py-2.5 bg-primary-50 text-primary-600 font-medium rounded-xl hover:bg-primary-600 hover:text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                  >
                    {currentUser?.role === "TEACHER"
                      ? "Quản lý lớp học"
                      : "Vào lớp học"}
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-100 border-dashed">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {currentUser?.role === "TEACHER"
                ? "Chưa có lớp giảng dạy"
                : "Chưa có lớp học nào"}
            </h3>
            <p className="text-gray-500 mb-6">
              {currentUser?.role === "TEACHER"
                ? "Bạn chưa được phân công giảng dạy lớp nào."
                : "Bạn chưa đăng ký lớp học nào. Hãy đăng ký ngay!"}
            </p>
            {currentUser?.role !== "TEACHER" && (
              <button
                onClick={() => setIsRegistrationModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
              >
                Đăng ký lớp học
              </button>
            )}
          </div>
        )}
      </div>

      {/* Registration Modal */}
      <ClassRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        onRegister={handleRegisterSuccess}
      />
    </div>
  );
};
