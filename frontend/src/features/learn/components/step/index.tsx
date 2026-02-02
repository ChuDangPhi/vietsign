"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  getSelfLearnCourseById,
  getSelfLearnLessonById,
  getSelfLearnStepsByLessonId,
  getSelfLearnStepById,
  getLessonsByCourseId,
  SelfLearnCourse,
  SelfLearnLesson,
} from "@/data/selfLearnData";
import {
  BaseStepItem,
  VocabularyStep,
  SentenceStep,
  QuizTextToVideoStep,
  QuizVideoToTextStep,
  QuizInputStep,
  QuizVideoToImageStep,
  MatchVideoToTextStep,
  FlipCardStep,
  TrueFalseStep,
} from "@/shared/components/common/step";

export function StepDetail() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);
  const lessonId = Number(params.lessonId);
  const stepId = Number(params.stepId);

  const [course, setCourse] = useState<SelfLearnCourse | null>(null);
  const [lesson, setLesson] = useState<SelfLearnLesson | null>(null);
  const [currentStep, setCurrentStep] = useState<BaseStepItem | null>(null);
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

        const allSteps = getSelfLearnStepsByLessonId(lessonId);
        setSteps(allSteps);

        const step = getSelfLearnStepById(stepId);
        setCurrentStep(step || null);
      } catch (error) {
        console.error("Failed to load step", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [courseId, lessonId, stepId]);

  const currentIndex = steps.findIndex((s) => s.id === stepId);
  const prevStep = currentIndex > 0 ? steps[currentIndex - 1] : null;
  const nextStep =
    currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;

  const navigateToStep = (step: BaseStepItem) => {
    router.push(`/learn/${courseId}/${lessonId}/${step.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-gray-500">Đang tải...</div>
    );
  }

  if (!currentStep || !lesson || !course) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Không tìm thấy bài học
        </h2>
        <button
          onClick={() => router.push(`/learn/${courseId}/${lessonId}`)}
          className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          Quay lại bài học
        </button>
      </div>
    );
  }

  // Render step content based on type
  const renderStepContent = () => {
    switch (currentStep.type) {
      case "vocabulary":
        return <VocabularyStep step={currentStep} />;
      case "sentence":
        return <SentenceStep step={currentStep} />;
      case "quiz-text-to-video":
        return (
          <QuizTextToVideoStep
            step={currentStep}
            onComplete={() => nextStep && navigateToStep(nextStep)}
          />
        );
      case "quiz-video-to-text":
        return (
          <QuizVideoToTextStep
            step={currentStep}
            onComplete={() => nextStep && navigateToStep(nextStep)}
          />
        );
      case "quiz-input":
        return (
          <QuizInputStep
            step={currentStep}
            onComplete={() => nextStep && navigateToStep(nextStep)}
          />
        );
      case "quiz-video-to-image":
        return (
          <QuizVideoToImageStep
            step={currentStep}
            onComplete={() => nextStep && navigateToStep(nextStep)}
          />
        );
      case "match-video-to-text":
        return (
          <MatchVideoToTextStep
            step={currentStep}
            onComplete={() => nextStep && navigateToStep(nextStep)}
          />
        );
      case "flip-card":
        return (
          <FlipCardStep
            step={currentStep}
            onComplete={() => nextStep && navigateToStep(nextStep)}
          />
        );
      case "true-false":
        return (
          <TrueFalseStep
            step={currentStep}
            onComplete={() => nextStep && navigateToStep(nextStep)}
          />
        );
      default:
        return <VocabularyStep step={currentStep} />;
    }
  };

  // Get next lesson info
  const allLessons = getLessonsByCourseId(courseId);
  const currentLessonIndex = allLessons.findIndex((l) => l.id === lessonId);
  const nextLesson =
    currentLessonIndex !== -1 && currentLessonIndex < allLessons.length - 1
      ? allLessons[currentLessonIndex + 1]
      : null;

  const handleNextLesson = () => {
    if (nextLesson) {
      const nextLessonSteps = getSelfLearnStepsByLessonId(nextLesson.id);
      if (nextLessonSteps.length > 0) {
        router.push(
          `/learn/${courseId}/${nextLesson.id}/${nextLessonSteps[0].id}`,
        );
      } else {
        router.push(`/learn/${courseId}/${nextLesson.id}`);
      }
    }
  };

  const handleComplete = () => {
    router.push(`/learn/${courseId}/${lessonId}`);
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/learn/${courseId}/${lessonId}`)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors font-medium group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Quay lại bài học</span>
        </button>

        {/* Step Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {currentStep.title}
          </h1>
          <p className="text-sm text-gray-500">{lesson.title}</p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Bước {currentIndex + 1} / {steps.length}
          </span>
          <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 mt-6">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => prevStep && navigateToStep(prevStep)}
          disabled={!prevStep}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            prevStep
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-gray-50 text-gray-300 cursor-not-allowed"
          }`}
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>

        <div className="flex items-center gap-3">
          {!nextStep ? (
            <>
              {/* Completed Button */}
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/25"
              >
                <CheckCircle size={18} />
                Hoàn thành
              </button>

              {/* Next Lesson Button */}
              {nextLesson && (
                <button
                  onClick={handleNextLesson}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/25"
                >
                  Bài tiếp theo
                  <ArrowRight size={18} />
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => navigateToStep(nextStep)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/25"
            >
              Tiếp theo
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
