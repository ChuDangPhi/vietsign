"use client";

import React from "react";
import {
  ArrowLeft,
  Star,
  ArrowRight,
  Image,
  Video,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { VideoPlayer } from "@/shared/components/common";
import { DictionaryItem } from "@/data/dictionaryData";
import { fetchWordById, fetchAllWords } from "@/services/dictionaryService";
import { Loader2 } from "lucide-react";

const VOCAB_TYPE_LABELS: Record<string, string> = {
  all: "Tất cả",
  WORD: "Từ đơn",
  SENTENCE: "Câu",
  PARAGRAPH: "Đoạn văn",
};

export const DictionaryDetail: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [item, setItem] = React.useState<DictionaryItem | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [mediaType, setMediaType] = React.useState<"video" | "image">("video");
  const [allWords, setAllWords] = React.useState<DictionaryItem[]>([]);

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [data, wordsList] = await Promise.all([
          fetchWordById(id),
          fetchAllWords(),
        ]);
        setItem(data || null);
        setAllWords(wordsList || []);
      } catch (error) {
        console.error("Failed to load dictionary item:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      loadData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <Share2 className="text-gray-300" size={40} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
          Không tìm thấy từ này
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Từ vựng bạn tìm kiếm không tồn tại hoặc đã bị xóa khỏi hệ thống.
        </p>
        <button
          onClick={() => router.push("/vocabularies")}
          className="px-8 py-3.5 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all font-bold shadow-xl shadow-primary-600/20 active:scale-95"
        >
          Quay lại từ điển
        </button>
      </div>
    );
  }

  // Tìm vị trí của từ hiện tại trong danh sách
  const currentIndex = allWords.findIndex((w) => w.id === id);

  // Lấy từ liên quan (cùng loại)
  const relatedItems = allWords
    .filter((i) => i.vocabularyType === item.vocabularyType && i.id !== item.id)
    .slice(0, 3);

  // Lấy từ trước và sau
  const prevItem = currentIndex > 0 ? allWords[currentIndex - 1] : null;
  const nextItem =
    currentIndex < allWords.length - 1 ? allWords[currentIndex + 1] : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/vocabularies`)}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-white rounded-xl transition-all font-medium border border-transparent hover:border-gray-200 hover:shadow-sm group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Quay lại</span>
        </button>

        <nav className="hidden md:flex items-center gap-2 text-sm text-gray-500 font-medium">
          <Link href="/home" className="hover:text-primary-600">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/vocabularies" className="hover:text-primary-600">
            Từ điển
          </Link>
          <span>/</span>
          <span className="text-gray-900">{item.word}</span>
        </nav>
      </div>

      {/* Unified Content Box: Word & Video */}
      <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Media Section: 3/4 Width */}
          <div className="lg:w-3/4 bg-gray-900">
            {mediaType === "video" && item.videoUrl ? (
              <VideoPlayer
                key={`video-${item.id}`}
                videoUrl={item.videoUrl}
                title={item.word}
                autoPlay={true}
                loop={true}
                showControls={true}
                height="600px"
                className="rounded-none lg:rounded-l-[40px]"
              />
            ) : item.imageUrl ? (
              <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 relative group/img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.word}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover/img:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity"></div>
              </div>
            ) : item.videoUrl ? (
              <VideoPlayer
                key={`video-fallback-${item.id}`}
                videoUrl={item.videoUrl}
                title={item.word}
                autoPlay={true}
                loop={true}
                showControls={true}
                height="600px"
                className="rounded-none lg:rounded-l-[40px]"
              />
            ) : (
              <div className="w-full h-[600px] flex items-center justify-center text-gray-400 font-medium bg-gray-900">
                <div className="text-center">
                  <Video size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Không có video hoặc hình ảnh minh họa</p>
                </div>
              </div>
            )}
          </div>

          {/* Info Section: 1/4 Width */}
          <div className="lg:w-1/4 p-10 bg-white flex flex-col justify-between relative overflow-hidden border-l border-gray-100">
            <div className="space-y-10 relative z-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">
                  {VOCAB_TYPE_LABELS[item.vocabularyType || "WORD"] ||
                    item.vocabularyType}
                </div>

                <div>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed">
                    Đây là{" "}
                    {VOCAB_TYPE_LABELS[
                      item.vocabularyType || "WORD"
                    ]?.toLowerCase() || item.vocabularyType}{" "}
                    trong danh mục từ điển học liệu ngôn ngữ ký hiệu.
                  </p>
                  <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-2 italic">
                    {item.word}
                  </h1>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-10 relative z-10">
              <button className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-primary-600 text-white rounded-[24px] hover:bg-primary-700 transition-all font-black shadow-2xl shadow-primary-600/30 active:scale-95 text-sm uppercase tracking-widest">
                <Star size={20} className="fill-current" />
                <span>Yêu thích</span>
              </button>
              <button
                onClick={() =>
                  setMediaType(mediaType === "video" ? "image" : "video")
                }
                className="w-full flex items-center justify-center gap-3 py-4 text-gray-400 hover:text-primary-600 transition-all font-bold text-sm bg-gray-50 hover:bg-primary-50 rounded-2xl group/toggle"
              >
                {mediaType === "video" ? (
                  <>
                    <Image
                      size={20}
                      className="group-hover/toggle:scale-110 transition-transform"
                    />
                    <span>Xem ảnh minh họa</span>
                  </>
                ) : (
                  <>
                    <Video
                      size={20}
                      className="group-hover/toggle:scale-110 transition-transform"
                    />
                    <span>Xem video ký hiệu</span>
                  </>
                )}
              </button>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary-50 rounded-full translate-x-1/2 translate-y-1/2 opacity-30"></div>
          </div>
        </div>
      </div>

      {/* Navigation: Previous / Next Word */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
        {prevItem ? (
          <Link
            href={`/vocabularies/${prevItem.id}`}
            className="group relative overflow-hidden bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300"
          >
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-300">
                <ArrowLeft
                  size={28}
                  className="text-gray-400 group-hover:text-white group-hover:-translate-x-1 transition-all"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-1 group-hover:text-primary-600 transition-colors">
                  Trước đó
                </span>
                <span className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                  {prevItem.word}
                </span>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </Link>
        ) : (
          <div />
        )}

        {nextItem ? (
          <Link
            href={`/vocabularies/${nextItem.id}`}
            className="group relative overflow-hidden bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300 text-right"
          >
            <div className="relative z-10 flex items-center justify-end gap-6">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-1 group-hover:text-primary-600 transition-colors">
                  Tiếp theo
                </span>
                <span className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                  {nextItem.word}
                </span>
              </div>
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-300">
                <ArrowRight
                  size={28}
                  className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all"
                />
              </div>
            </div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary-50 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
