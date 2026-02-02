"use client";

import { BarChart3, TrendingUp, Users, BookOpen, Award } from "lucide-react";
import { stats, monthlyData } from "@/data";

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Users,
  BookOpen,
  Award,
  TrendingUp,
};

export function StatisticsManagement() {
  const maxStudents = Math.max(...monthlyData.map(d => d.students));
  const maxLessons = Math.max(...monthlyData.map(d => d.lessons));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary-600" />
          Thống kê
        </h1>
        <p className="text-gray-600 mt-1">Tổng quan hiệu suất hệ thống</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = iconMap[stat.iconName];
          return (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                  {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Học sinh đăng ký theo tháng</h3>
          <div className="flex items-end gap-4 h-48">
            {monthlyData.slice(0, 6).map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-primary-100 rounded-t-lg" style={{ height: `${(data.students / maxStudents) * 100}%` }}>
                  <div className="w-full h-full bg-primary-500 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity"></div>
                </div>
                <span className="text-xs text-gray-500">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Bài học hoàn thành theo tháng</h3>
          <div className="flex items-end gap-4 h-48">
            {monthlyData.slice(0, 6).map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-green-100 rounded-t-lg" style={{ height: `${(data.lessons / maxLessons) * 100}%` }}>
                  <div className="w-full h-full bg-green-500 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity"></div>
                </div>
                <span className="text-xs text-gray-500">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
