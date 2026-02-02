"use client";

import { Wrench, Search, Plus, Settings, Zap, Database, Shield, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

const mockTools = [
  { id: 1, name: "Công cụ nhận diện ký hiệu", description: "AI nhận diện ngôn ngữ ký hiệu qua camera", status: "active", type: "AI" },
  { id: 2, name: "Trình tạo video ký hiệu", description: "Tạo video hướng dẫn ký hiệu tự động", status: "active", type: "Media" },
  { id: 3, name: "Công cụ đánh giá", description: "Hệ thống chấm điểm bài tập tự động", status: "active", type: "Assessment" },
  { id: 4, name: "Backup dữ liệu", description: "Sao lưu dữ liệu hệ thống định kỳ", status: "inactive", type: "System" },
];

import { removeVietnameseTones } from "@/shared/utils/text";

export function ToolsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredTools = mockTools.filter(tool => 
    removeVietnameseTones(tool.name).includes(removeVietnameseTones(searchQuery))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Wrench className="w-8 h-8 text-primary-600" />
            Quản lý công cụ
          </h1>
          <p className="text-gray-600 mt-1">Quản lý các công cụ hỗ trợ trong hệ thống</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium shadow-sm">
          <Plus size={20} /> Thêm công cụ
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Tìm kiếm công cụ..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTools.map((tool) => (
          <div key={tool.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  {tool.type === "AI" && <Zap className="w-6 h-6 text-primary-600" />}
                  {tool.type === "Media" && <Settings className="w-6 h-6 text-primary-600" />}
                  {tool.type === "Assessment" && <Shield className="w-6 h-6 text-primary-600" />}
                  {tool.type === "System" && <Database className="w-6 h-6 text-primary-600" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{tool.description}</p>
                  <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full mt-2 ${tool.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                    {tool.status === "active" ? "Đang hoạt động" : "Tạm ngưng"}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"><Edit size={18} /></button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
