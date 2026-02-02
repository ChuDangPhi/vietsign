"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Clock,
  BookOpen,
  ChevronRight,
  FileText,
  HelpCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  getSelfLearnCourseById,
  getSelfLearnLessonById,
  getSelfLearnStepsByLessonId,
  SelfLearnCourse,
  SelfLearnLesson,
} from "@/data/selfLearnData";
import { BaseStepItem, stepTypeMeta } from "@/shared/components/common/step";
import Link from "next/link";

export function LessonDetail() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);
  const lessonId = Number(params.lessonId);

  const [course, setCourse] = useState<SelfLearnCourse | null>(null);
  const [lesson, setLesson] = useState<SelfLearnLesson | null>(null);
  const [steps, setSteps] = useState<BaseStepItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const foundCourse = getSelfLearnCourseById(courseId);
        setCourse(foundCourse || null);

        const foundLesson = getSelfLearnLessonById(lessonId);
        setLesson(foundLesson || null);

        if (foundLesson) {
          const lessonSteps = getSelfLearnStepsByLessonId(lessonId);
          setSteps(lessonSteps);
        }
      } catch (error) {
        console.error("Failed to load lesson", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [courseId, lessonId]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-gray-500">Đang tải...</div>
    );
  }

  if (!lesson || !course) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Không tìm thấy bài học
        </h2>
        <button
          onClick={() => router.push(`/learn/${courseId}`)}
          className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          Quay lại khóa học
        </button>
      </div>
    );
  }

  const completedSteps = steps.filter((s) => s.completed).length;
  const progress = Math.round((completedSteps / steps.length) * 100);

  const getIconForType = (type: string) => {
    switch (type) {
      case "vocabulary":
        return BookOpen;
      case "sentence":
        return FileText;
      default:
        return HelpCircle;
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push(`/learn/${courseId}`)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors font-medium group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Quay lại khóa học</span>
        </button>
        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
          {course.title}
        </span>
      </div>

      {/* Lesson Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {lesson.title}
            </h1>
            <p className="text-gray-600">{lesson.description}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} />
            <span>{lesson.duration}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Tiến độ bài học</span>
            <span className="font-semibold text-primary-600">
              {completedSteps}/{steps.length} bước
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Nội dung bài học</h2>
        </div>

        <div className="divide-y divide-gray-100">
          {steps.map((step, index) => {
            const typeConfig =
              stepTypeMeta[step.type] || stepTypeMeta.vocabulary;
            const TypeIcon = getIconForType(step.type);

            return (
              <Link
                key={step.id}
                href={`/learn/${courseId}/${lessonId}/${step.id}`}
                className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group"
              >
                {/* Step Number */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                    step.completed
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {step.completed ? <CheckCircle size={20} /> : index + 1}
                </div>

                {/* Step Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 truncate">
                      {step.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${typeConfig.color}`}
                    >
                      <TypeIcon size={12} />
                      {typeConfig.label}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight
                  size={20}
                  className="text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0"
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Start Learning Button */}
      {steps.length > 0 && (
        <div className="mt-6 text-center">
          <Link
            href={`/learn/${courseId}/${lessonId}/${
              steps.find((s) => !s.completed)?.id || steps[0].id
            }`}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold shadow-lg shadow-primary-600/25"
          >
            <Play size={20} fill="white" />
            {completedSteps > 0 ? "Tiếp tục học" : "Bắt đầu học"}
          </Link>
        </div>
      )}
    </div>
  );
}
