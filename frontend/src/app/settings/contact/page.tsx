import { Metadata } from "next";
import { SmartLayout } from "@/shared/components/layout";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Liên hệ - VietSignSchool",
  description: "Liên hệ trực tiếp với đội ngũ phát triển VietSignSchool",
};

export default function ContactPage() {
  return (
    <SmartLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-primary-800 dark:from-white dark:to-primary-200 tracking-tight">
              Giữ liên lạc với chúng tôi
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              Chúng tôi luôn muốn lắng nghe từ bạn. Đội ngũ hỗ trợ sẽ phản hồi
              trong thời gian sớm nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700/50 group hover:border-primary-500 transition-colors">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Email hỗ trợ
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                  Gửi thắc mắc của bạn qua hộp thư của chúng tôi
                </p>
                <a
                  href="mailto:contact@vietsign.vn"
                  className="text-primary-600 dark:text-primary-400 font-semibold hover:underline border-b border-primary-600/30 pb-1"
                >
                  contact@vietsign.vn
                </a>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700/50 group hover:border-primary-500 transition-colors">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Trụ sở chính
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                  Hãy đến thăm văn phòng nếu có dịp
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  Đại học Bách khoa Hà Nội
                  <br />
                  Hai Bà Trưng, Hà Nội
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 p-8 sm:p-12 h-full">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                  Gửi tin nhắn
                </h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Tên của bạn
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Địa chỉ email
                      </label>
                      <input
                        type="email"
                        className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Chủ đề
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                      placeholder="Bạn cần hỗ trợ gì?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Tin nhắn
                    </label>
                    <textarea
                      rows={4}
                      className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow resize-none"
                      placeholder="Viết nội dung ở đây..."
                    ></textarea>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary-500/30"
                  >
                    <Send className="w-5 h-5" /> Gửi tin nhắn
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SmartLayout>
  );
}
