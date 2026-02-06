"use client";

import { Gamepad2, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { gamesList, GameItem, getActiveGames } from "@/data/gamesData";
export { GuessVideoGame } from "./guess-video";
export { GuessImageGame } from "./guess-image";
export { MemoryMatchGame } from "./memory-match";
export { SpellingBeeGame } from "./spelling-bee";

export function Games() {
  const router = useRouter();
  const [games, setGames] = useState<GameItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      setIsLoading(true);
      try {
        // Lấy danh sách game đang active
        const activeGames = getActiveGames();
        setGames(activeGames);
      } catch (error) {
        console.error("Failed to load games", error);
        setGames(gamesList);
      } finally {
        setIsLoading(false);
      }
    };
    loadGames();
  }, []);

  const handleGameClick = (gameId: number) => {
    router.push(`/games/${gameId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-primary-600" />
            Trò chơi học tập
          </h1>
          <p className="text-gray-600 mt-1">
            Học ngôn ngữ ký hiệu qua các trò chơi thú vị
          </p>
        </div>
      </div>

      {/* Game List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => handleGameClick(game.id)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          >
            {/* Game Icon/Image */}
            <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center relative overflow-hidden">
              {game.icongame ? (
                <img
                  src={game.icongame}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Gamepad2 className="w-24 h-24 text-white opacity-50" />
              )}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
              <div className="absolute bottom-4 right-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-primary-600 fill-current ml-0.5" />
                </div>
              </div>
            </div>

            {/* Game Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {game.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {game.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {games.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Gamepad2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có trò chơi nào
          </h3>
          <p className="text-gray-500">Các trò chơi sẽ sớm được cập nhật</p>
        </div>
      )}
    </div>
  );
}
