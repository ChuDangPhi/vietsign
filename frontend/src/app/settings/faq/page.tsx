import { Metadata } from "next";
import { SmartLayout } from "@/shared/components/layout";
import { MessagesSquare, ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp - VietSignSchool",
  description: "Các câu hỏi thường gặp về VietSignSchool",
};

const faqs = [
  {
    question: "VietSignSchool là gì?",
    answer:
      "VietSignSchool là một nền tảng học tiếng Việt qua ngôn ngữ ký hiệu. Chúng tôi cung cấp các khóa học, trò chơi và tài liệu tương tác giúp bạn tiếp cận ngôn ngữ ký hiệu một cách dễ dàng và hiệu quả.",
  },
  {
    question: "Làm thế nào để bắt đầu một khóa học?",
    answer:
      "Bạn chỉ cần đăng ký hoặc đăng nhập tài khoản. Sau đó có thể vào phần 'Bài học' để chọn cấp độ phù hợp và bắt đầu ngay lập tức. Toàn bộ lộ trình đều được lưu lại cho lần học tiếp theo.",
  },
  {
    question: "Có tính phí khi sử dụng hệ thống không?",
    answer:
      "Hiện tại phần lớn các khóa học cơ bản và trò chơi trên VietSignSchool là hoàn toàn miễn phí nhằm mục đích hỗ trợ cộng đồng.",
  },
  {
    question: "Làm sao để liên hệ hỗ trợ kỹ thuật?",
    answer:
      "Trường hợp bạn gặp lỗi, xin vui lòng truy cập trang 'Liên hệ' hoặc gửi email trực tiếp tới contact@vietsign.vn. Chúng tôi sẽ phản hồi trong vòng 24h.",
  },
];

export default function FAQPage() {
  return (
    <SmartLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center p-5 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/40 dark:to-indigo-800/20 rounded-3xl shadow-inner mb-2 transform hover:scale-105 transition-transform duration-300">
              <MessagesSquare className="w-14 h-14 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-indigo-800 dark:from-white dark:to-indigo-200 tracking-tight">
              Câu hỏi thường gặp
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              Giải đáp nhanh các thắc mắc phổ biến về dịch vụ, nền tảng và cách
              thức hoạt động của VietSignSchool.
            </p>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 p-6 [&_summary::-webkit-details-marker]:hidden hover:shadow-md transition-shadow"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900 dark:text-white">
                  <h2 className="text-lg font-bold">{faq.question}</h2>
                  <span className="shrink-0 rounded-full bg-indigo-50 dark:bg-indigo-900/30 p-1.5 text-indigo-600 dark:text-indigo-400 sm:p-3 group-open:-rotate-180 transition-transform duration-300">
                    <ChevronDown className="h-5 w-5" />
                  </span>
                </summary>
                <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-12 text-center p-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-800/30">
            <p className="text-indigo-900 dark:text-indigo-200 font-medium">
              Bạn chưa tìm thấy câu trả lời?{" "}
              <a
                href="/contact"
                className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-700 font-bold"
              >
                Hãy cho chúng tôi biết
              </a>
            </p>
          </div>
        </div>
      </div>
    </SmartLayout>
  );
}
