import React, { useState, useEffect } from "react";
import { X, Search, Calendar, User, MapPin } from "lucide-react";
import { ClassItem } from "@/data/classesData";
import { fetchAllClasses } from "@/services/classService";
import { fetchUsersByRole } from "@/services/userService";
import { mockOrganizations } from "@/data/organizationsData";

interface ClassRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (classItem: ClassItem) => void;
}

export const ClassRegistrationModal: React.FC<ClassRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegister,
}) => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [teachersMap, setTeachersMap] = useState<Record<number, string>>({});

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allClasses, teachers] = await Promise.all([
        fetchAllClasses(),
        fetchUsersByRole("TEACHER"),
      ]);
      setClasses(allClasses);

      const map: Record<number, string> = {};
      teachers.forEach((t: any) => {
        map[t.id] = t.name;
      });
      setTeachersMap(map);
    } catch (error) {
      console.error("Failed to load registration data", error);
    } finally {
      setLoading(false);
    }
  };

  const getFacilityName = (organizationId: number | null) => {
    if (organizationId === null) return "Online";
    const facility = mockOrganizations.find((f) => f.id === organizationId);
    return facility ? facility.name : "Không xác định";
  };

  const filteredClasses = classes.filter(
    (c) =>
      c.status === "upcoming" &&
      c.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Đăng ký lớp học mới
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Chọn lớp học phù hợp với trình độ của bạn
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Tìm kiếm lớp học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-primary-200 transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-block px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-lg">
                      {cls.classLevel || "Cơ bản"}
                    </span>
                    <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      {cls.schedule?.split(" - ")[1] || "N/A"}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {cls.name}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <span>{teachersMap[cls.teacherId] || "Giáo viên"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span>
                        {cls.schedule?.split(" - ")[0] || "Chưa có lịch"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{getFacilityName(cls.organizationId)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRegister(cls)}
                    className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors shadow-sm"
                  >
                    Đăng ký ngay
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Không tìm thấy lớp học phù hợp
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
