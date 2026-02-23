"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BookOpen,
  Gamepad2,
  Calendar,
  TrendingUp,
  Clock,
  Award,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { fetchAllCourses } from "@/services/learnService";
import { SelfLearnCourse } from "@/data/selfLearnData";

export const Home: React.FC = () => {
  const user = useSelector((state: any) => state.admin.user);
  const [coursesInProgress, setCoursesInProgress] = useState<any[]>([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const courses = await fetchAllCourses();

        // Get courses in progress (progress > 0 and < 100)
        const coursesWithProgress = courses.map(
          (course: SelfLearnCourse, index: number) => {
            // Map colors simply for demo consistency with the image
            let themeColor = "bg-primary-600";
            let lightColor = "bg-primary-50";
            let textColor = "text-primary-600";
            let badgeColor = "bg-primary-100 text-primary-600";
            let progressColor = "bg-primary-500";

            if (index === 0) {
              themeColor = "bg-orange-500";
              lightColor = "bg-orange-50";
              textColor = "text-orange-600";
              badgeColor = "bg-orange-100 text-orange-600";
              progressColor = "bg-orange-500";
            } else if (index === 1) {
              themeColor = "bg-blue-600";
              lightColor = "bg-blue-50";
              textColor = "text-blue-600";
              badgeColor = "bg-blue-100 text-blue-600";
              progressColor = "bg-blue-600";
            }

            return {
              ...course,
              themeColor,
              lightColor,
              textColor,
              badgeColor,
              progressColor,
              lastUpdated: index === 0 ? "2 giờ trước" : "1 ngày trước",
            };
          },
        );

        const inProgress = coursesWithProgress
          .filter(
            (course: any) =>
              course.progress !== undefined && course.progress > 0,
          )
          .sort((a: any, b: any) => (b.progress || 0) - (a.progress || 0))
          .slice(0, 2);

        setCoursesInProgress(inProgress);
      } catch (error) {
        console.error("Error loading courses for home:", error);
      }
    };
    loadCourses();
  }, []);

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Section */}
      <div className="bg-[#00875A] text-white p-8 rounded-3xl shadow-sm relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span>👋</span>
            <span className="text-[#8cd2ba] text-sm font-medium">
              Xin chào!
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Chào mừng trở lại, {user?.name || "Linh K"}!
          </h1>
          <p className="text-[#e6f4ef] max-w-lg">
            Tiếp tục hành trình học ngôn ngữ ký hiệu với các công cụ tương tác
            của chúng tôi.
          </p>
        </div>
      </div>

      {/* Continue Learning Section */}
      {coursesInProgress.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">Tiếp tục học</h2>
            </div>
            <Link
              href="/learn"
              className="text-sm text-[#00875A] hover:text-[#006c48] font-medium flex items-center gap-1"
            >
              Tất cả khóa học →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coursesInProgress.map((course, index) => (
              <Link
                key={course.id}
                href={`/learn/${course.id}`}
                className="block group h-full"
              >
                <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 h-full flex flex-col relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      {/* Badge */}
                      <span
                        className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${course.badgeColor} mb-3`}
                      >
                        {index === 1 ? "Chủ đề" : course.level}
                      </span>

                      {/* Title & Subtitle */}
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        Bài {course.id}: {course.subtitle}
                      </p>
                    </div>

                    {/* Progress Icon Block */}
                    <div className="ml-4 relative flex-shrink-0">
                      <div
                        className={`w-14 h-16 ${course.lightColor} rounded-xl flex items-center justify-center opacity-80`}
                      >
                        <BookOpen className={`w-6 h-6 ${course.textColor}`} />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-white shadow-sm rounded-full w-8 h-8 flex items-center justify-center border border-gray-50 text-xs font-bold">
                        {course.progress}%
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${course.progressColor}`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-xs text-gray-400 font-medium">
                      Cập nhật {course.lastUpdated}
                    </span>
                    <button
                      className={`${course.themeColor} text-white px-5 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2`}
                    >
                      Học tiếp
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dictionary Card */}
        <Link href="/vocabularies" className="block group">
          <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 h-full relative">
            <div className="flex justify-between items-start mb-8">
              <div className="bg-blue-100 p-3 rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">
                Mới
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Từ điển</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              Tra cứu và học từ vựng mới mỗi ngày
            </p>
          </div>
        </Link>

        {/* Sign of the Day Card */}
        <Link href="/daily-signs" className="block group">
          <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 h-full relative">
            <div className="flex justify-between items-start mb-8">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md uppercase tracking-wider">
                Hàng ngày
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Ký hiệu mỗi ngày
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              Thử thách bản thân với ký hiệu mới
            </p>
          </div>
        </Link>

        {/* Learning Games Card */}
        <Link href="/games" className="block group">
          <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 h-full relative">
            <div className="flex justify-between items-start mb-8">
              <div className="bg-green-100 p-3 rounded-xl">
                <Gamepad2 className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md uppercase tracking-wider">
                Vui nhộn
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Trò chơi</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              Vừa học vừa chơi với các game thú vị
            </p>
          </div>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-3">
            <BookOpen size={24} className="text-primary-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">24</p>
          <p className="text-sm text-gray-500">Từ đã học</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-3">
            <TrendingUp size={24} className="text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">5</p>
          <p className="text-sm text-gray-500">Ngày liên tiếp</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
            <Clock size={24} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">2.5h</p>
          <p className="text-sm text-gray-500">Thời gian học</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-3">
            <Award size={24} className="text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">3</p>
          <p className="text-sm text-gray-500">Huy hiệu</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Hoạt động gần đây</h2>
          <Link
            href="/history"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Xem tất cả →
          </Link>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">✅</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Hoàn thành: Số 1-10
                </p>
                <p className="text-xs text-gray-500">2 giờ trước</p>
              </div>
            </div>
            <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
              Hoàn thành
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">📚</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Đang học: Chào hỏi
                </p>
                <p className="text-xs text-gray-500">1 ngày trước</p>
              </div>
            </div>
            <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
              Đang tiến hành
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">🎮</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Chơi game: Ghép ký hiệu
                </p>
                <p className="text-xs text-gray-500">2 ngày trước</p>
              </div>
            </div>
            <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
              Đạt 85 điểm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
