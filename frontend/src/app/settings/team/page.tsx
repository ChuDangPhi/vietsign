import { Metadata } from "next";
import { SmartLayout } from "@/shared/components/layout";
import { Users, Github, Linkedin, Twitter } from "lucide-react";

export const metadata: Metadata = {
  title: "Đội ngũ phát triển - VietSignSchool",
  description: "Gặp gỡ những người tạo ra VietSignSchool",
};

const team = [
  {
    name: "VietSign Team",
    role: "Nhóm Phát triển",
    image:
      "https://ui-avatars.com/api/?name=VS&background=random&color=fff&size=200",
    bio: "Nhóm những sinh viên đam mê từ Đại học Bách khoa Hà Nội, với mong muốn thu hẹp khoảng cách giao tiếp bằng ngôn ngữ ký hiệu.",
  },
  {
    name: "Core Contributors",
    role: "Open Source",
    image:
      "https://ui-avatars.com/api/?name=CC&background=0D8ABC&color=fff&size=200",
    bio: "Những người đóng góp tự do và đam mê phát triển phần mềm có ý nghĩa xã hội.",
  },
];

export default function TeamPage() {
  return (
    <SmartLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center p-5 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-800/20 rounded-3xl shadow-inner mb-2 transform hover:scale-105 transition-transform duration-300">
              <Users className="w-14 h-14 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 tracking-tight">
              Đội ngũ của chúng tôi
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              Đứng sau VietSignSchool là những kỹ sư mộng mơ, tận tâm mang công
              nghệ đến gần hơn với cộng đồng khiếm thính.
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700/50 group text-center hover:-translate-y-2"
              >
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto relative z-10 border-4 border-white dark:border-gray-700 object-cover shadow-md"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 font-semibold mb-4">
                  {member.role}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                  {member.bio}
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Join Us CTA */}
          <div className="mt-16 bg-gradient-to-r from-purple-600 to-primary-600 rounded-[2.5rem] p-10 sm:p-14 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4">
                Bạn muốn tham gia cùng chúng tôi?
              </h2>
              <p className="text-purple-100 max-w-2xl mx-auto mb-8 text-lg">
                Chúng tôi luôn chào đón những lập trình viên, nhà thiết kế, giáo
                viên và những người tâm huyết cùng chung tay lan tỏa giá trị
                ngôn ngữ ký hiệu.
              </p>
              <button className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:scale-105 transition-transform shadow-lg">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      </div>
    </SmartLayout>
  );
}
