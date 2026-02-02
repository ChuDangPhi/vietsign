"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import { Modal } from "@/shared/components/common/Modal";
import { fetchQuestionsByClassroom } from "@/services/questionService";
import { QuestionItem } from "@/data/questionsData";

interface ModalChooseQuestionsProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedQuestions: QuestionItem[]) => void;
  classId: number | string;
  initialSelectedIds?: number[];
}

export function ModalChooseQuestions({
  isOpen,
  onClose,
  onConfirm,
  classId,
  initialSelectedIds = [],
}: ModalChooseQuestionsProps) {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>(initialSelectedIds);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (isOpen && classId) {
      loadQuestions();
      setSelectedIds(initialSelectedIds);
    }
  }, [isOpen, classId, initialSelectedIds]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const data = await fetchQuestionsByClassroom(Number(classId));
      setQuestions(data);
    } catch (error) {
      console.error("Failed to load questions", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleExpand = (id: number) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredQuestions = questions.filter((q) =>
    q.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleConfirm = () => {
    const selectedBatch = questions.filter((q) => selectedIds.includes(q.id));
    onConfirm(selectedBatch);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ngân hàng câu hỏi"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Search and Summary */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="text-sm font-medium text-gray-500">
            Đã chọn:{" "}
            <span className="text-primary-600 font-bold">
              {selectedIds.length}
            </span>{" "}
            câu hỏi
          </div>
        </div>

        {/* List */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          <div className="max-h-[50vh] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="py-20 text-center text-gray-500">
                Đang tải câu hỏi...
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="py-20 text-center text-gray-500">
                Không tìm thấy câu hỏi nào
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 w-10"></th>
                    <th className="px-4 py-3 w-10"></th>
                    <th className="px-4 py-3">Nội dung câu hỏi</th>
                    <th className="px-4 py-3 w-24 text-center">Loại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredQuestions.map((q) => (
                    <React.Fragment key={q.id}>
                      <tr
                        className={`hover:bg-primary-50/30 transition-colors cursor-pointer ${selectedIds.includes(q.id) ? "bg-primary-50/50" : ""}`}
                        onClick={() => toggleSelect(q.id)}
                      >
                        <td className="px-4 py-3">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedIds.includes(q.id) ? "bg-primary-600 border-primary-600" : "border-gray-300 bg-white"}`}
                          >
                            {selectedIds.includes(q.id) && (
                              <Check size={14} className="text-white" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(q.id);
                            }}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            {expandedRows[q.id] ? (
                              <ChevronDown size={18} />
                            ) : (
                              <ChevronRight size={18} />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {q.content}
                          <div className="flex gap-2 mt-1">
                            {q.image && (
                              <ImageIcon size={14} className="text-blue-500" />
                            )}
                            {q.video && (
                              <Video size={14} className="text-red-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${q.question_type === "MULTIPLE_ANSWERS" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                          >
                            {q.question_type === "MULTIPLE_ANSWERS"
                              ? "Multi"
                              : "Single"}
                          </span>
                        </td>
                      </tr>
                      {expandedRows[q.id] && (
                        <tr className="bg-gray-50/50">
                          <td colSpan={4} className="px-12 py-4">
                            <div className="space-y-3">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Đáp án:
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {(q as any).answerResList?.map(
                                  (ans: any, idx: number) => (
                                    <div
                                      key={idx}
                                      className={`p-3 rounded-xl border flex items-center gap-3 ${ans.correct ? "bg-green-50 border-green-100" : "bg-white border-gray-100"}`}
                                    >
                                      <div
                                        className={`w-2 h-2 rounded-full ${ans.correct ? "bg-green-500" : "bg-gray-300"}`}
                                      />
                                      <span
                                        className={`text-sm ${ans.correct ? "text-green-700 font-semibold" : "text-gray-600"}`}
                                      >
                                        {ans.content}
                                      </span>
                                      {ans.videoLocation && (
                                        <Video
                                          size={14}
                                          className="ml-auto text-red-400"
                                        />
                                      )}
                                    </div>
                                  ),
                                )}
                              </div>
                              {q.explanation && (
                                <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                  <p className="text-xs font-bold text-amber-700">
                                    Giải thích:
                                  </p>
                                  <p className="text-sm text-amber-800">
                                    {q.explanation}
                                  </p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedIds.length === 0}
            className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm disabled:opacity-50"
          >
            Xác nhận chọn {selectedIds.length} câu hỏi
          </button>
        </div>
      </div>
    </Modal>
  );
}
