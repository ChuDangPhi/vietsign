import { Metadata } from "next";
import { SmartLayout } from "@/shared/components/layout";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng - VietSignSchool",
  description: "Điều khoản sử dụng của ứng dụng VietSignSchool",
};

export default function TermsPage() {
  return (
    <SmartLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center p-5 bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/40 dark:to-primary-800/20 rounded-3xl shadow-inner mb-2 transform hover:scale-105 transition-transform duration-300">
              <FileText className="w-14 h-14 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-primary-800 dark:from-white dark:to-primary-200 tracking-tight">
              Điều khoản sử dụng
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              Vui lòng đọc kỹ các điều khoản dưới đây trước khi sử dụng dịch vụ
              của VietSignSchool. Cập nhật lần cuối: Hôm nay.
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-700/50 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="p-8 sm:p-14 relative z-10 prose prose-lg prose-primary dark:prose-invert max-w-none">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 text-sm">
                  1
                </span>
                Chấp nhận các điều khoản
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 pl-11">
                Bằng việc truy cập hoặc sử dụng ứng dụng VietSignSchool, bạn
                đồng ý chịu sự ràng buộc của các Điều khoản Sử dụng này. Nếu bạn
                không đồng ý với bất kỳ phần nào của các điều khoản, bạn không
                nên sử dụng dịch vụ của chúng tôi.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mt-10">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 text-sm">
                  2
                </span>
                Tài khoản người dùng
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 pl-11">
                Bạn chịu trách nhiệm bảo mật mật khẩu của mình và cho tất cả các
                hoạt động xảy ra dưới tài khoản của bạn. Bạn đồng ý thông báo
                ngay cho chúng tôi về mọi hành vi sử dụng trái phép tài khoản
                của bạn.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mt-10">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 text-sm">
                  3
                </span>
                Quyền sở hữu trí tuệ
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 pl-11">
                Dịch vụ và tất cả các tài liệu có trong đó bao gồm, nhưng không
                giới hạn ở văn bản, đồ họa, phần mềm, video và âm thanh, thuộc
                sở hữu của VietSignSchool hoặc được cấp phép cho VietSignSchool.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SmartLayout>
  );
}
