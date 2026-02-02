"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Play,
  CheckCircle,
  ChevronRight,
  BarChart,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  getSelfLearnCourseById,
  getLessonsByCourseId,
  SelfLearnCourse,
  SelfLearnLesson,
} from "@/data/selfLearnData";
import Link from "next/link";

export function CourseDetail() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);

  const [course, setCourse] = useState<SelfLearnCourse | null>(null);
  const [lessons, setLessons] = useState<SelfLearnLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const foundCourse = getSelfLearnCourseById(courseId);
        setCourse(foundCourse || null);

        if (foundCourse) {
          const courseLessons = getLessonsByCourseId(courseId);
          setLessons(courseLessons);
        }
      } catch (error) {
        console.error("Failed to load course", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-gray-500">Đang tải...</div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Không tìm thấy khóa học
        </h2>
        <button
          onClick={() => router.push("/learn")}
          className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const completedLessons = lessons.filter((l) => l.completed).length;
  const progress = Math.round((completedLessons / lessons.length) * 100) || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Navigation */}
      <div className="flex items-center">
        <button
          onClick={() => router.push("/learn")}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-white rounded-xl transition-all font-medium border border-transparent hover:border-gray-200 hover:shadow-sm group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Quay lại danh sách khóa học</span>
        </button>
      </div>

      {/* Course Header Information */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div
          className={`${course.colorClass} p-8 text-white relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32 opacity-10 blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm border border-white/10">
                  {course.level}
                </span>
                <span className="inline-flex items-center gap-1 text-sm">
                  <Clock size={14} />
                  {course.duration}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-3 leading-tight">
                {course.title}
              </h1>
              <p className="text-white/80 text-lg mb-6 max-w-2xl">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="opacity-80" />
                  <span>{lessons.length} bài học</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart size={18} className="opacity-80" />
                  <span>{completedLessons} đã hoàn thành</span>
                </div>
              </div>
            </div>

            {/* Progress Circle */}
            <div className="flex items-center justify-center">
              <div className="w-32 h-32 bg-white/20 rounded-full flex flex-col items-center justify-center backdrop-blur-sm border border-white/10">
                <span className="text-3xl font-bold">{progress}%</span>
                <span className="text-sm opacity-80">Hoàn thành</span>
              </div>
            </div>
          </div>
        </div>

        {/* Header for Lessons section */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <BookOpen size={18} className="text-primary-600" />
          <span className="text-sm font-medium text-gray-900">
            Danh sách bài học
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-primary-100 text-primary-700">
            {lessons.length}
          </span>
        </div>
      </div>

      {/* Lessons List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {lessons.map((lesson, index) => (
            <Link
              key={lesson.id}
              href={`/learn/${courseId}/${lesson.id}`}
              className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group"
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
                  <span className="font-bold text-lg">{index + 1}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className={`font-medium truncate ${
                    lesson.completed ? "text-gray-900" : "text-gray-700"
                  }`}
                >
                  {lesson.title}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {lesson.description} • {lesson.stepsCount} bước học
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {lesson.duration}
                  </span>
                </div>
                <ChevronRight
                  size={20}
                  className="text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Start Learning Button */}
      {lessons.length > 0 && (
        <div className="text-center">
          <Link
            href={`/learn/${courseId}/${
              lessons.find((l) => !l.completed)?.id || lessons[0].id
            }`}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold shadow-lg shadow-primary-600/25"
          >
            <Play size={20} fill="white" />
            {completedLessons > 0 ? "Tiếp tục học" : "Bắt đầu học"}
          </Link>
        </div>
      )}
    </div>
  );
}
