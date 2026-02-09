"use client";

import {
  UserPlus,
  Search,
  Calendar,
  Clock,
  Users,
  MapPin,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { removeVietnameseTones } from "@/shared/utils/text";
import { fetchAllClasses } from "@/services/classService";
import { fetchUsersByRole } from "@/services/userService";
import { mockOrganizations as mockFacilities } from "@/data/organizationsData";
import { ClassItem } from "@/data/classesData";

interface ClassRegistrationItem extends ClassItem {
  registered?: boolean;
  teacherName?: string;
  facilityName?: string;
}

export function ClassRegistrationManagement() {
  const [classes, setClasses] = useState<ClassRegistrationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [allClasses, teachers] = await Promise.all([
          fetchAllClasses(),
          fetchUsersByRole("TEACHER"),
        ]);

        const teacherMap: Record<number, string> = {};
        teachers.forEach((t: any) => (teacherMap[t.id] = t.name));

        const facilityMap: Record<number, string> = {};
        mockFacilities.forEach((f) => (facilityMap[f.id] = f.name));

        const enrichedClasses = allClasses.map((c) => ({
          ...c,
          teacherName: teacherMap[c.teacherId] || "Không xác định",
          facilityName: c.organizationId
            ? facilityMap[c.organizationId] || "Không xác định"
            : "Online",
          registered: false, // Default to false as we don't have user registration API yet
        }));

        // Filter only upcoming or ongoing classes for registration?
        // For now, show all valid classes
        setClasses(enrichedClasses);
      } catch (error) {
        console.error("Failed to load classes", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredClasses = classes.filter((cls) => {
    const normalizedQuery = removeVietnameseTones(searchQuery);
    return (
      removeVietnameseTones(cls.name).includes(normalizedQuery) ||
      removeVietnameseTones(cls.teacherName || "").includes(normalizedQuery)
    );
  });

  const handleRegister = (id: number) => {
    // In a real app, call API to register
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === id
          ? { ...cls, registered: true, students: cls.students + 1 }
          : cls,
      ),
    );
    // Optionally show success toast
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <UserPlus className="w-8 h-8 text-primary-600" />
          Đăng ký lớp học
        </h1>
        <p className="text-gray-600 mt-1">Đăng ký tham gia các lớp học mới</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm lớp học, giáo viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl">
                  {cls.name.split(" ").pop()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{cls.name}</h3>
                    {cls.registered && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        <CheckCircle size={14} />
                        Đã đăng ký
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    Giáo viên: {cls.teacherName}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} className="text-gray-400" />
                      {cls.schedule}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={16} className="text-gray-400" />
                      Bắt đầu: {cls.startDate}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-gray-400" />
                      {cls.facilityName}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">
                    {cls.students}/{cls.maxStudents ?? "∞"}
                  </p>
                  <p className="text-xs text-gray-500">Sĩ số</p>
                </div>
                {cls.registered || cls.students >= (cls.maxStudents ?? 999) ? (
                  <button
                    disabled
                    className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-xl cursor-not-allowed"
                  >
                    {cls.registered ? "Đã đăng ký" : "Hết chỗ"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegister(cls.id)}
                    className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-xl hover:bg-primary-700"
                  >
                    Đăng ký <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClasses.length === 0 && !isLoading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy lớp học
          </h3>
          <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
        </div>
      )}
    </div>
  );
}
