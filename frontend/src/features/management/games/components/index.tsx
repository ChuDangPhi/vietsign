"use client";

import {
  Gamepad2,
  Search,
  Edit,
  Trash2,
  ShieldAlert,
  ChevronRight,
  Target,
  Layers,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store";
import {
  gamesList,
  difficultyConfig,
  GameItem,
  getAllGames,
  getGamesStats,
} from "@/data/gamesData";
import {
  Pagination,
  usePagination,
} from "@/shared/components/common/Pagination";
import { ConfirmModal } from "@/shared/components/common/ConfirmModal";
import { removeVietnameseTones } from "@/shared/utils/text";

const ITEMS_PER_PAGE = 8;

export function GamesManagementComponent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useSelector((state: RootState) => state.admin);

  // State để quản lý dữ liệu
  const [allGames, setAllGames] = useState<GameItem[]>(gamesList);

  // State cho modal xác nhận xóa
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<GameItem | null>(null);

  // Filter games
  const filteredGames = allGames.filter((game) => {
    const normalizedQuery = removeVietnameseTones(searchQuery);
    const matchesSearch =
      removeVietnameseTones(game.name).includes(normalizedQuery) ||
      removeVietnameseTones(game.description).includes(normalizedQuery);
    return matchesSearch;
  });

  // Use pagination
  const {
    currentPage,
    totalPages,
    paginatedItems,
    paddedItems,
    setCurrentPage,
  } = usePagination(filteredGames, ITEMS_PER_PAGE);

  // Stats
  const stats = getGamesStats();

  // Check Admin permission
  const userRoleStr =
    user?.code ||
    (typeof user?.role === "string" ? user.role : user?.role?.role) ||
    "USER";

  const isAdmin =
    userRoleStr.toUpperCase() === "ADMIN" ||
    userRoleStr.toUpperCase() === "TEST";

  // Mở trang chi tiết (quản lý câu hỏi)
  const openDetailPage = (game: GameItem) => {
    router.push(`/games-management/${game.id}`);
  };

  // Mở modal xác nhận xóa
  const openDeleteModal = (game: GameItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setGameToDelete(game);
    setIsDeleteModalOpen(true);
  };

  // Xử lý xóa
  const handleDelete = () => {
    if (gameToDelete) {
      setAllGames((prev) => prev.filter((g) => g.id !== gameToDelete.id));
      setIsDeleteModalOpen(false);
      setGameToDelete(null);
    }
  };

  // Toggle isActive
  const toggleGameActive = (game: GameItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setAllGames((prev) =>
      prev.map((g) => (g.id === game.id ? { ...g, isActive: !g.isActive } : g)),
    );
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Truy cập bị từ chối
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Chỉ Quản trị viên hệ thống mới có quyền truy cập vào trang quản lý trò
          chơi này. Vui lòng liên hệ với admin nếu bạn cho rằng đây là một lỗi.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-primary-600" />
            Quản lý trò chơi
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý nội dung câu hỏi và cấp độ cho các game học tập
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <Gamepad2 className="w-8 h-8 text-primary-600 mb-2" />
          <p className="text-sm text-gray-500">Tổng trò chơi</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalGames}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <Layers className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-sm text-gray-500">Tổng cấp độ</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.totalLevels}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <Target className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-sm text-gray-500">Đang hoạt động</p>
          <p className="text-2xl font-bold text-blue-600">
            {stats.activeGames}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <ChevronRight className="w-8 h-8 text-purple-600 mb-2" />
          <p className="text-sm text-gray-500">Câu hỏi</p>
          <p className="text-2xl font-bold text-purple-600">
            {allGames.reduce(
              (sum, g) =>
                sum +
                g.levels.reduce(
                  (levelSum, l) => levelSum + l.questions.length,
                  0,
                ),
              0,
            )}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm trò chơi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
      </div>

      {/* Games List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paddedItems.map((game, index) =>
          game ? (
            <div
              key={game.id}
              className={`bg-white rounded-2xl shadow-sm border ${
                !game.isActive
                  ? "opacity-75 border-dashed border-gray-300"
                  : "border-gray-100"
              } overflow-hidden hover:shadow-md transition-all group cursor-pointer`}
              onClick={() => openDetailPage(game)}
            >
              {/* Game Header */}
              <div className="h-32 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center relative">
                <Gamepad2 className="w-16 h-16 text-white/50" />
                {!game.isActive && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 text-xs font-bold uppercase rounded bg-red-500 text-white shadow-sm">
                      Vô hiệu hóa
                    </span>
                  </div>
                )}
              </div>

              {/* Game Info */}
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {game.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {game.description}
                </p>

                {/* Levels */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {game.levels.length} Cấp độ
                  </p>
                  {game.levels.map((level) => (
                    <div
                      key={level.level}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-700">
                          Màn {level.level}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            difficultyConfig[level.difficulty]?.color ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {level.difficulty}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {level.questions.length} câu hỏi
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div
                className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium ${
                      game.isActive ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {game.isActive ? "Đang bật" : "Đang tắt"}
                  </span>
                  <button
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      game.isActive ? "bg-primary-600" : "bg-gray-200"
                    }`}
                    onClick={(e) => toggleGameActive(game, e)}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        game.isActive ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex gap-1">
                  <button
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    onClick={() => openDetailPage(game)}
                    title="Quản lý câu hỏi"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={(e) => openDeleteModal(game, e)}
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              key={`empty-${index}`}
              className="opacity-0 pointer-events-none"
              aria-hidden="true"
            />
          ),
        )}
      </div>

      {filteredGames.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={allGames.length}
            filteredItems={filteredGames.length}
            itemName="trò chơi"
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Gamepad2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy trò chơi
          </h3>
          <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa trò chơi "${gameToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
}
