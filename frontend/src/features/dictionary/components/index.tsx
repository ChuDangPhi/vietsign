"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Search,
  Plus,
  Filter,
  Mic,
  Video,
  Star,
  ArrowRight,
  Book,
  ArrowUpAZ,
  ArrowDownAZ,
  X,
} from "lucide-react";
import { DictionaryItem } from "@/data/dictionaryData";
import { fetchAllWords } from "@/services/dictionaryService";
import {
  Pagination,
  usePagination,
} from "@/shared/components/common/Pagination";
import Link from "next/link";

const ITEMS_PER_PAGE = 12;

const VOCAB_TYPE_LABELS: Record<string, string> = {
  all: "Tất cả",
  WORD: "Từ đơn",
  SENTENCE: "Câu",
  PARAGRAPH: "Đoạn văn",
};

const VOCAB_TYPES = [
  { id: "all", label: "Tất cả" },
  { id: "WORD", label: "Từ đơn" },
  { id: "SENTENCE", label: "Câu" },
  { id: "PARAGRAPH", label: "Đoạn văn" },
];

import { removeVietnameseTones } from "@/shared/utils/text";

export const Dictionary: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Mặc định A-Z
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Data state
  const [items, setItems] = useState<DictionaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWords = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAllWords();
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          console.error("Invalid dictionary data format:", data);
          setItems([]);
        }
      } catch (error) {
        console.error("Failed to load dictionary items", error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadWords();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const normalizedQuery = removeVietnameseTones(query);
      const filteredSuggestions = items.filter((item) =>
        removeVietnameseTones(item.word).includes(normalizedQuery),
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (word: string) => {
    setSearchQuery(word);
    setShowSuggestions(false);
  };

  // Lọc và sắp xếp
  const filteredItems = items
    .filter((item) => {
      const matchesType =
        activeTab === "all" || item.vocabularyType === activeTab;
      const normalizedQuery = removeVietnameseTones(searchQuery);
      const normalizedWord = removeVietnameseTones(item.word);
      const matchesSearch = normalizedWord.includes(normalizedQuery);

      return matchesType && matchesSearch;
    })
    .sort((a, b) => {
      const wordA = removeVietnameseTones(a.word);
      const wordB = removeVietnameseTones(b.word);
      if (sortOrder === "asc") {
        return wordA.localeCompare(wordB);
      } else {
        return wordB.localeCompare(wordA);
      }
    });

  const {
    currentPage,
    totalPages,
    paginatedItems,
    paddedItems,
    setCurrentPage,
  } = usePagination(filteredItems, ITEMS_PER_PAGE);

  const HighlightedText = ({
    text,
    highlight,
  }: {
    text: string;
    highlight: string;
  }) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span
              key={i}
              className="bg-yellow-200 text-gray-900 font-bold px-0.5 rounded-sm"
            >
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary-600" />
            Từ điển
          </h1>
          <p className="text-gray-600 mt-1">
            Các từ và video ngôn ngữ ký hiệu ({items.length} từ)
          </p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm từ (không cần dấu)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        {VOCAB_TYPES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveTab(cat.id);
              setCurrentPage(1);
            }}
            className={`
                    px-5 py-2.5 rounded-xl font-medium transition-all duration-200 border
                    ${
                      activeTab === cat.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }
                `}
          >
            {cat.label}
          </button>
        ))}
        <button
          onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
          className={`ml-auto px-5 py-2.5 rounded-xl font-medium border flex items-center gap-2 transition-all ${
            showAdvancedFilter
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Filter size={18} />
          Bộ lọc nâng cao
        </button>
      </div>

      {/* Advanced Filter Panel */}
      {showAdvancedFilter && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Bộ lọc nâng cao</h3>
            <button
              onClick={() => setShowAdvancedFilter(false)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sắp xếp:</span>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setSortOrder("asc")}
                  className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition-all ${
                    sortOrder === "asc"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <ArrowUpAZ size={16} />A → Z
                </button>
                <button
                  onClick={() => setSortOrder("desc")}
                  className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition-all border-l border-gray-200 ${
                    sortOrder === "desc"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <ArrowDownAZ size={16} />Z → A
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dictionary Grid */}
      {filteredItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paddedItems.map((item, index) =>
              item ? (
                <Link
                  key={item.id}
                  href={`/vocabularies/${item.id}`}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative cursor-pointer"
                >
                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">
                          {VOCAB_TYPE_LABELS[item.vocabularyType || "WORD"] ||
                            item.vocabularyType}
                        </p>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.word}
                        </h3>
                      </div>
                      <div className="flex flex-col items-end">
                        <Book size={20} className="text-gray-300 mb-1" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 text-gray-500 text-sm">
                      <span>{item.views} lượt xem</span>
                      <ArrowRight
                        size={16}
                        className="text-primary-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                      />
                    </div>
                  </div>
                </Link>
              ) : (
                <div
                  key={`empty-${index}`}
                  className="opacity-0 pointer-events-none h-[160px]"
                  aria-hidden="true"
                />
              ),
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={items.length}
              filteredItems={filteredItems.length}
              itemName="từ vựng"
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">
            Không tìm thấy kết quả nào cho "{searchQuery}"
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setShowSuggestions(false);
            }}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Xóa tìm kiếm
          </button>
        </div>
      )}
    </div>
  );
};
