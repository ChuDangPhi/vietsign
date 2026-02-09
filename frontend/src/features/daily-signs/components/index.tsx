"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  ChevronRight,
  Play,
  Pause,
  Star,
  Volume2,
  VolumeX,
  Maximize,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { fetchAllWords } from "@/features/dictionary";
import { DictionaryItem } from "@/data/dictionaryData";

export function DailySigns() {
  const [todaySign, setTodaySign] = useState<DictionaryItem | null>(null);
  const [recentSigns, setRecentSigns] = useState<DictionaryItem[]>([]);
  const [relatedWords, setRelatedWords] = useState<DictionaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch all words
        const allWords = await fetchAllWords();
        if (allWords.length === 0) {
          setIsLoading(false);
          return;
        }

        // 2. Deterministic hash for word of the day
        const getWordByDate = (
          words: DictionaryItem[],
          dateOffset: number = 0,
        ) => {
          const date = new Date();
          date.setDate(date.getDate() - dateOffset);
          const dateStr = date.toISOString().split("T")[0];

          let hash = 0;
          for (let i = 0; i < dateStr.length; i++) {
            hash = (hash << 5) - hash + dateStr.charCodeAt(i);
            hash |= 0;
          }
          const index = Math.abs(hash) % words.length;
          return words[index];
        };

        // 3. Set Today's Sign
        const sign = getWordByDate(allWords, 0);
        if (sign) {
          setTodaySign(sign);

          // 4. Set Related Words (same category)
          const related = allWords
            .filter((w) => w.category === sign.category && w.id !== sign.id)
            .sort((a, b) => b.views - a.views)
            .slice(0, 4);
          setRelatedWords(related);
        }

        // 5. Set Recent Signs (last 5 days)
        const recents: DictionaryItem[] = [];
        for (let i = 1; i <= 5; i++) {
          const prevSign = getWordByDate(allWords, i);
          if (prevSign && !recents.find((r) => r.id === prevSign.id)) {
            recents.push(prevSign);
          }
        }
        setRecentSigns(recents);
      } catch (error) {
        console.error("Failed to load daily signs", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Video player states
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Format time display (mm:ss)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Update progress bar as video plays
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !todaySign) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [todaySign?.id]);

  // Handlers (togglePlay, toggleMute, etc.) - reuse existing implementation style
  // ... (keeping implementation short in replacement for brevity if unchanged logic, but here I should include them to ensure variables match)
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
        videoRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      const newTime = clickPosition * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(clickPosition * 100);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const speedOptions = [
    { label: "Rất nhanh", value: 2 },
    { label: "Nhanh", value: 1.5 },
    { label: "Bình thường", value: 1 },
    { label: "Chậm", value: 0.5 },
  ];

  if (isLoading || !todaySign) {
    return (
      <div className="py-20 text-center text-gray-500">
        Đang tải ký hiệu hôm nay...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary-600" />
            Ký Hiệu Của Ngày
          </h1>
          <p className="text-gray-600 mt-1">{today}</p>
        </div>
      </div>

      {/* Main Sign of the Day with Video */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row">
          {/* Video Player - 2/3 width */}
          <div className="lg:w-2/3 relative group bg-black">
            <div className="aspect-video relative overflow-hidden flex items-center justify-center">
              {todaySign.videoUrl ? (
                <>
                  <video
                    key={todaySign.id}
                    ref={videoRef}
                    className="w-full h-full object-cover cursor-pointer"
                    poster={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=90&sig=${todaySign.id}`}
                    controls={false}
                    muted
                    loop
                    playsInline
                    onClick={togglePlay}
                  >
                    <source src={todaySign.videoUrl} type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ video.
                  </video>

                  {/* Play Button Overlay (when paused) */}
                  {!isPlaying && (
                    <div
                      onClick={togglePlay}
                      className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer transition-opacity duration-300"
                    >
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <Play
                            size={28}
                            className="text-primary-600 fill-current ml-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="space-y-3">
                      {/* Progress Bar */}
                      <div className="flex items-center gap-2">
                        <span className="text-white text-xs font-medium min-w-[36px]">
                          {formatTime(currentTime)}
                        </span>
                        <div
                          ref={progressRef}
                          onClick={handleProgressClick}
                          className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer group/progress hover:h-2 transition-all"
                        >
                          <div
                            className="h-full bg-gradient-to-r from-white to-primary-200 relative transition-all"
                            style={{ width: `${progress}%` }}
                          >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform"></div>
                          </div>
                        </div>
                        <span className="text-white text-xs font-medium min-w-[36px]">
                          {formatTime(duration)}
                        </span>
                      </div>

                      {/* Control Buttons */}
                      <div className="flex items-center justify-between text-white">
                        {/* Left Controls */}
                        <div className="flex items-center gap-3">
                          {/* Play/Pause */}
                          <button
                            onClick={togglePlay}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            title={isPlaying ? "Tạm dừng" : "Phát"}
                          >
                            {isPlaying ? (
                              <Pause size={18} className="fill-current" />
                            ) : (
                              <Play size={18} className="fill-current ml-0.5" />
                            )}
                          </button>

                          {/* Volume Control */}
                          <div className="flex items-center gap-1 group/volume">
                            <button
                              onClick={toggleMute}
                              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                              title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                            >
                              {isMuted ? (
                                <VolumeX size={18} />
                              ) : (
                                <Volume2 size={18} />
                              )}
                            </button>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={isMuted ? 0 : volume}
                              onChange={handleVolumeChange}
                              className="w-0 group-hover/volume:w-16 transition-all duration-300 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                            />
                          </div>

                          {/* Time Display */}
                          <span className="text-xs font-medium opacity-80 hidden sm:block">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>

                        {/* Right Controls */}
                        <div className="flex items-center gap-2">
                          {/* Speed Control */}
                          <div className="relative">
                            <button
                              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors"
                              title="Tốc độ phát"
                            >
                              {playbackSpeed}x
                            </button>
                            {showSpeedMenu && (
                              <div className="absolute bottom-full right-0 mb-2 bg-gray-900/95 backdrop-blur-md rounded-lg overflow-hidden shadow-2xl border border-white/10">
                                {speedOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    onClick={() =>
                                      handleSpeedChange(option.value)
                                    }
                                    className={`w-full px-3 py-2 text-left text-xs font-medium hover:bg-white/10 transition-colors whitespace-nowrap ${
                                      playbackSpeed === option.value
                                        ? "text-primary-400 bg-white/5"
                                        : "text-white"
                                    }`}
                                  >
                                    {option.label} ({option.value}x)
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Fullscreen */}
                          <button
                            onClick={handleFullscreen}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            title="Phóng to"
                          >
                            <Maximize size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : todaySign.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={todaySign.imageUrl}
                  alt={todaySign.word}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <p>Không có video hoặc hình ảnh</p>
                </div>
              )}
            </div>
          </div>

          {/* Sign Details - 1/3 width */}
          <div className="lg:w-1/3 p-8 text-white flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm mb-4 w-fit">
              <Star size={14} />
              <span>Từ vựng hôm nay</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              {todaySign.word}
            </h2>

            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {todaySign.category}
              </span>
              <span className="text-white/80 text-sm">
                #{todaySign.id} trong từ điển
              </span>
            </div>

            <p className="text-white/90 text-base leading-relaxed mb-6">
              Học ký hiệu &quot;{todaySign.word}&quot; - một từ thuộc danh mục
              &quot;{todaySign.category}&quot; với{" "}
              {todaySign.views.toLocaleString()} lượt xem.
            </p>

            <div className="flex flex-wrap gap-3">
              {todaySign.videoUrl && (
                <button
                  onClick={togglePlay}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary-600 rounded-xl font-medium hover:bg-white/90 transition-colors"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  {isPlaying ? "Tạm dừng" : "Bắt đầu học"}
                </button>
              )}
              <Link
                href={`/vocabularies/${todaySign.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-colors"
              >
                <BookOpen size={18} />
                Xem chi tiết
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related Words */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Từ vựng liên quan
          </h3>
          <Link
            href="/vocabularies"
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            Xem tất cả <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedWords.map((word) => (
            <Link
              key={word.id}
              href={`/vocabularies/${word.id}`}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg hover:border-primary-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-primary-600 font-medium">
                  {word.category}
                </span>
                <Play
                  size={14}
                  className="text-gray-300 group-hover:text-primary-500 transition-colors"
                />
              </div>
              <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {word.word}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {word.views.toLocaleString()} lượt xem
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Signs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Các từ gần đây
          </h3>
          <Link
            href="/vocabularies"
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            Xem lịch sử <ChevronRight size={16} />
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          {recentSigns.length > 0 ? (
            recentSigns.map((sign, index) => (
              <Link
                key={sign.id}
                href={`/vocabularies/${sign.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {sign.word.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{sign.word}</h4>
                  <p className="text-sm text-gray-500">{sign.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {index + 1} ngày trước
                  </span>
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
              </Link>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              Chưa có từ vựng nào trong lịch sử
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DailySigns;
