import { Metadata } from "next";
import { SmartLayout } from "@/shared/components/layout";
import { Info, Target, Heart, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Giới thiệu - VietSignSchool",
  description: "Thông tin về sứ mệnh và mục tiêu của VietSignSchool",
};

export default function AboutPage() {
  return (
    <SmartLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-200">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50 to-transparent dark:from-primary-900/20 dark:to-transparent"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-semibold text-sm">
                <Sparkles className="w-4 h-4" /> Về VietSignSchool
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                Xóa bỏ rào cản <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                  kết nối con người
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Nền tảng học hỏi và lan tỏa ngôn ngữ ký hiệu Việt Nam, tạo ra
                một không gian hòa nhập, nơi giao tiếp không còn là giới hạn cho
                bất kỳ ai.
              </p>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Tầm nhìn
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Trở thành hệ sinh thái toàn diện và phổ biến nhất về hướng dẫn
                ngôn ngữ ký hiệu tại Việt Nam, góp phần xây dựng một xã hội đa
                dạng và thân thiện với người khiếm thính.
              </p>
            </div>

            <div className="space-y-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400">
                <Heart className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Sứ mệnh
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Cung cấp công cụ công nghệ giáo dục đổi mới sáng tạo miễn phí,
                giúp cho việc học tập giao tiếp qua cử chỉ tay trở nên dễ dàng,
                thú vị và dễ tiếp cận hơn cho mọi lứa tuổi.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Người học", value: "10K+" },
                { label: "Bài học", value: "500+" },
                { label: "Đánh giá tích cực", value: "98%" },
                { label: "Ký hiệu từ vựng", value: "3000+" },
              ].map((stat, idx) => (
                <div key={idx} className="text-center space-y-2">
                  <h3 className="text-4xl md:text-5xl font-black text-primary-600 dark:text-primary-400">
                    {stat.value}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </SmartLayout>
  );
}
