"use client";

import React from "react";
import { useSelector } from "react-redux";
import { BookOpen, Gamepad2, Calendar } from "lucide-react";

export const Dashboard: React.FC = () => {
  const user = useSelector((state: any) => state.admin.user);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {user?.name || "User"}!
        </h1>
        <p className="text-primary-100">
          Continue your ASL learning journey with our interactive tools.
        </p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dictionary Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpen size={24} className="text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
              New
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Dictionary</h3>
          <p className="text-gray-600 text-sm mb-4">
            Search and learn signs by topic, handshape, or AI-powered search.
          </p>
          <button className="w-full bg-blue-50 text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-100 transition-colors">
            Open Dictionary
          </button>
        </div>

        {/* Sign of the Day Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar size={24} className="text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Daily
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Sign of the Day
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Get a new sign delivered every day to expand your vocabulary.
          </p>
          <button className="w-full bg-purple-50 text-purple-600 font-semibold py-2 rounded-lg hover:bg-purple-100 transition-colors">
            View Today's Sign
          </button>
        </div>

        {/* Learning Games Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Gamepad2 size={24} className="text-green-600" />
            </div>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Fun
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Learning Games
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Make learning fun with interactive games and quizzes.
          </p>
          <button className="w-full bg-green-50 text-green-600 font-semibold py-2 rounded-lg hover:bg-green-100 transition-colors">
            Play Games
          </button>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Your Recent Activity
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">
                Completed: Numbers 1-10
              </p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
              Completed
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">Learned: Greetings</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
            <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
              In Progress
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
