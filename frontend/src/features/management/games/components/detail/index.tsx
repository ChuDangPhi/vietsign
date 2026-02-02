"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Gamepad2,
  Target,
  Video,
  Image as ImageIcon,
  Clock,
  Award,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  gamesList,
  GameItem,
  GameLevel,
  GameQuestion,
  difficultyConfig,
} from "@/data/gamesData";
import { ConfirmModal } from "@/shared/components/common/ConfirmModal";
import { Modal } from "@/shared/components/common/Modal";

export function GameManagementDetail() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);
  const [game, setGame] = useState<GameItem | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<GameQuestion>>(
    {}
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<GameQuestion | null>(
    null
  );

  useEffect(() => {
    const found = gamesList.find((g) => g.id === id);
    if (found) {
      setGame(found);
    }
  }, [id]);

  const currentLevelData = game?.levels.find((l) => l.level === selectedLevel);

  const handleAddQuestion = () => {
    setCurrentQuestion({
      id: Date.now(),
      content: "",
      points: 100,
      timeLimit: 15,
      options: [
        { id: "a", text: "", isCorrect: false },
        { id: "b", text: "", isCorrect: false },
        { id: "c", text: "", isCorrect: false },
        { id: "d", text: "", isCorrect: false },
      ],
    });
    setIsAddingQuestion(true);
  };

  const handleEditQuestion = (question: GameQuestion) => {
    setCurrentQuestion({ ...question });
    setIsEditingQuestion(true);
  };

  const handleSaveQuestion = () => {
    if (!game || !currentLevelData) return;

    const updatedGame = { ...game };
    const levelIndex = updatedGame.levels.findIndex(
      (l) => l.level === selectedLevel
    );

    if (isEditingQuestion) {
      // Update existing question
      const questionIndex = updatedGame.levels[levelIndex].questions.findIndex(
        (q) => q.id === currentQuestion.id
      );
      updatedGame.levels[levelIndex].questions[questionIndex] =
        currentQuestion as GameQuestion;
    } else {
      // Add new question
      updatedGame.levels[levelIndex].questions.push(
        currentQuestion as GameQuestion
      );
    }

    setGame(updatedGame);
    setIsAddingQuestion(false);
    setIsEditingQuestion(false);
    setCurrentQuestion({});
  };

  const handleDeleteQuestion = () => {
    if (!game || !questionToDelete) return;

    const updatedGame = { ...game };
    const levelIndex = updatedGame.levels.findIndex(
      (l) => l.level === selectedLevel
    );
    updatedGame.levels[levelIndex].questions = updatedGame.levels[
      levelIndex
    ].questions.filter((q) => q.id !== questionToDelete.id);

    setGame(updatedGame);
    setIsDeleteModalOpen(false);
    setQuestionToDelete(null);
  };

  const updateOption = (
    optionId: string | number,
    field: "text" | "isCorrect",
    value: any
  ) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      options: prev.options?.map((opt) =>
        opt.id === optionId
          ? { ...opt, [field]: value }
          : field === "isCorrect"
          ? { ...opt, isCorrect: false }
          : opt
      ),
    }));
  };

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Không tìm thấy trò chơi
        </h2>
        <button
          onClick={() => router.push("/games-management")}
          className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/games-management")}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-white rounded-xl transition-all font-medium border border-transparent hover:border-gray-200 hover:shadow-sm group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Quay lại danh sách</span>
        </button>
      </div>

      {/* Game Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <Gamepad2 size={32} className="text-white" />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{game.name}</h1>
              <p className="text-sm text-white/80 mt-1">{game.description}</p>
            </div>
          </div>
          <div className="text-white flex items-center gap-2">
            <Target size={20} />
            <span className="font-semibold">{game.levels.length} Cấp độ</span>
          </div>
        </div>

        {/* Level Tabs */}
        <div className="border-b border-gray-200 px-8">
          <div className="flex gap-2 -mb-px">
            {game.levels.map((level) => (
              <button
                key={level.level}
                onClick={() => setSelectedLevel(level.level)}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  selectedLevel === level.level
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Màn {level.level}: {level.difficulty}
              </button>
            ))}
          </div>
        </div>

        {/* Level Content */}
        {currentLevelData && (
          <div className="p-8">
            {/* Level Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    Màn {currentLevelData.level}: {currentLevelData.difficulty}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {currentLevelData.detail}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">
                    {currentLevelData.questions.length}
                  </p>
                  <p className="text-xs text-gray-500">Câu hỏi</p>
                </div>
              </div>
            </div>

            {/* Add Question Button */}
            <button
              onClick={handleAddQuestion}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all flex items-center justify-center gap-2 font-medium mb-4"
            >
              <Plus size={20} />
              Thêm câu hỏi mới
            </button>

            {/* Questions List */}
            <div className="space-y-4">
              {currentLevelData.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-bold">
                          Câu {index + 1}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock size={14} />
                          {question.timeLimit}s
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Award size={14} />
                          {question.points} điểm
                        </div>
                      </div>
                      <p className="font-medium text-gray-900">
                        {question.content}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setQuestionToDelete(question);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Media */}
                  {(question.videoUrl || question.imageUrl) && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center gap-2 text-sm text-gray-600">
                      {question.videoUrl && (
                        <div className="flex items-center gap-2">
                          <Video size={16} className="text-blue-500" />
                          <span className="text-xs truncate max-w-xs">
                            {question.videoUrl}
                          </span>
                        </div>
                      )}
                      {question.imageUrl && (
                        <div className="flex items-center gap-2">
                          <ImageIcon size={16} className="text-green-500" />
                          <span className="text-xs truncate max-w-xs">
                            {question.imageUrl}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Options */}
                  {question.options && (
                    <div className="grid grid-cols-2 gap-2">
                      {question.options.map((option) => (
                        <div
                          key={option.id}
                          className={`p-3 rounded-lg border ${
                            option.isCorrect
                              ? "bg-green-50 border-green-200"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-700">
                              {option.id.toString().toUpperCase()}.
                            </span>
                            <span
                              className={
                                option.isCorrect
                                  ? "text-green-700 font-medium"
                                  : "text-gray-700"
                              }
                            >
                              {option.text}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {currentLevelData.questions.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <p>
                    Chưa có câu hỏi nào. Nhấn nút "Thêm câu hỏi mới" để bắt đầu.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Question Editor Modal */}
      <Modal
        isOpen={isAddingQuestion || isEditingQuestion}
        onClose={() => {
          setIsAddingQuestion(false);
          setIsEditingQuestion(false);
          setCurrentQuestion({});
        }}
        title={isEditingQuestion ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Nội dung câu hỏi
            </label>
            <input
              type="text"
              value={currentQuestion.content || ""}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  content: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Ví dụ: Ký hiệu này có nghĩa là gì?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Điểm
              </label>
              <input
                type="number"
                value={currentQuestion.points || 100}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    points: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Thời gian (giây)
              </label>
              <input
                type="number"
                value={currentQuestion.timeLimit || 15}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    timeLimit: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Video URL (tùy chọn)
            </label>
            <input
              type="url"
              value={currentQuestion.videoUrl || ""}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  videoUrl: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Đáp án
            </label>
            <div className="space-y-2">
              {currentQuestion.options?.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={option.isCorrect}
                    onChange={() => updateOption(option.id, "isCorrect", true)}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="font-bold text-gray-700 w-8">
                    {option.id.toString().toUpperCase()}.
                  </span>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) =>
                      updateOption(option.id, "text", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Nhập đáp án..."
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setIsAddingQuestion(false);
                setIsEditingQuestion(false);
                setCurrentQuestion({});
              }}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSaveQuestion}
              className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Lưu
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteQuestion}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
}
