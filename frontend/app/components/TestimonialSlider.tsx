'use client'

const testimonials = [
  {
    name: 'Thầy Tân Hạnh',
    role: 'Phó Giám đốc Học viện Bưu Chính Viễn Thông',
    avatar: 'https://aqtech.edu.vn/wp-content/uploads/2025/07/thayTanHanh.jpg',
    quote:
      'Dựa trên trải nghiệm thực tế, tôi thấy phần mềm Edusoft.NET hỗ trợ rất tốt các nghiệp vụ quản lý trong Nhà trường. Đặc biệt, hệ thống có thể dễ dàng tích hợp và kết nối trao đổi dữ liệu với các nền tảng sẵn có, giúp mọi quy trình vận hành trở nên mượt mà hơn. Bên cạnh đó, đội ngũ hỗ trợ của AQTech thực sự tận tâm và am hiểu nghiệp vụ, luôn sẵn sàng giải đáp mọi thắc mắc và hỗ trợ nhanh chóng khi cần. Đây chắc chắn là một giải pháp quản lý giáo dục đáng tin cậy!',
  },
  {
    name: 'Anh Võ Thái Khánh',
    role: 'P. Đào tạo - Admin, cơ sở 2 Trường Đại học Ngoại thương',
    avatar: null,
    quote:
      'Phần mềm Edusoft.Net hỗ trợ đầy đủ cho nghiệp vụ quản lý tại Cơ sở II Trường Đại học Ngoại thương, giúp Trường từng bước hoàn thiện nghiệp vụ tin học hóa trong quản lý giáo dục từ bước xây dựng kế hoạch học tập, xếp lịch thi đến thanh toán khối lượng giảng dạy. Hệ thống website nhiều tiện ích nâng cao trải nghiệm người dùng, hỗ trợ rất tốt cho sinh viên trong học tập và cho giảng viên trong giảng dạy, cố vấn học tập. Đội ngũ hỗ trợ giúp đỡ nhiệt tình trong mọi tình huống, đưa ra những giải pháp tối ưu trong các vấn đề Trường chưa có hướng xử lý.',
  },
  {
    name: 'Anh Bùi Thái Hải',
    role: 'P. Đào tạo trường Đại học Kinh tế - Công nghệ Thái Nguyên',
    avatar: null,
    quote:
      'Trong quá trình sử dụng hệ thống phần mềm Edusoft. Tôi nhận được sự giúp đỡ nhiệt tình của các bạn bên công ty Anh Quân, đặc biệt là bạn Hà. Hà cũng là người giúp tôi triển khai mô hình mới của trường, hiện thực hoá trên Edusoft.NET, giúp cho tôi thay đổi gần như toàn bộ phương thức quản lý lâu năm của nhà trường.',
  },
]

const stats = [
  { value: 30, suffix: '+', label: 'Năm kinh nghiệm' },
  { value: 130, suffix: '+', label: 'Trường Đại học, Cao đẳng, Học viện, Trung cấp' },
  { value: 60, suffix: '+', label: 'Sở Giáo dục & Đào tạo' },
  { value: 140, suffix: '+', label: 'Trường Tiểu học & Trung học Phổ thông' },
]

export default function TestimonialSlider() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-[1720px] mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Khách hàng nói gì về chúng tôi?
          </h2>
          <div className="mt-4 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
        </div>

        {/* Testimonial cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Top accent */}
              <div className="h-1 rounded-t-2xl bg-gradient-to-r from-blue-500 to-cyan-400" />

              <div className="p-8 flex flex-col flex-1">
                {/* Header: avatar + info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative shrink-0">
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-100"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg ring-2 ring-blue-100">
                        {t.name.charAt(0)}
                      </div>
                    )}
                    {/* Quote badge */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="currentColor">
                        <path d="M2.486 7.629c-.4 0-.75-.075-1.05-.225a1.96 1.96 0 01-.725-.65 2.86 2.86 0 01-.4-.95 4.5 4.5 0 01-.15-1.15c0-.817.208-1.583.625-2.3.433-.717 1.1-1.283 2-1.7l.225.45c-.467.217-.883.533-1.25.95-.35.4-.558.825-.625 1.275-.1.35-.108.692-.025 1.025.367-.4.858-.6 1.475-.6.567 0 1.033.175 1.4.525.367.333.55.8.55 1.4 0 .583-.192 1.058-.575 1.425-.383.35-.875.525-1.475.525zm5.15 0c-.4 0-.75-.075-1.05-.225a1.96 1.96 0 01-.725-.65 2.86 2.86 0 01-.4-.95 4.5 4.5 0 01-.15-1.15c0-.817.208-1.583.625-2.3.433-.717 1.1-1.283 2-1.7l.225.45c-.467.217-.883.533-1.25.95-.35.4-.558.825-.625 1.275-.1.35-.108.692-.025 1.025.367-.4.858-.6 1.475-.6.567 0 1.033.175 1.4.525.367.333.55.8.55 1.4 0 .583-.192 1.058-.575 1.425-.383.35-.875.525-1.475.525z" />
                      </svg>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500 leading-snug">{t.role}</div>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote text — grows to fill remaining space */}
                <div className="flex-1">
                  <p className="text-gray-600 leading-relaxed text-sm">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics section */}
        <div className="mt-20">
          <h3 className="text-center text-xl md:text-2xl font-bold text-gray-900 mb-10">
            Nhiều tổ chức lựa chọn AQTech để<br />
            nâng cao hiệu quả quản lý &amp; vận hành
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-2">
                  {s.value}{s.suffix}
                </div>
                <div className="text-sm text-gray-500 leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center mt-10 text-sm font-bold tracking-[0.2em] uppercase text-gray-400">
            Tin cậy - Hiệu quả - Dẫn đầu trong chuyển đổi số giáo dục
          </p>
        </div>
      </div>
    </section>
  )
}
