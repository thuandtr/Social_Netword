import Link from 'next/link'
import axiosInstance from './lib/axios'
import HeroBanner from './components/HeroBanner'
import TestimonialSlider from './components/TestimonialSlider'

interface Article {
  id: number
  title: string
  excerpt: string | null
  thumbnail_url: string | null
  category: string | null
  tags: string[] | null
  created_at: string
  author_username: string
}

interface Achievement {
  id: number
  title: string
  subtitle: string | null
  image_url: string
  display_order: number
}

async function getPublishedArticles(): Promise<Article[]> {
  try {
    const res = await axiosInstance.get('/articles', { params: { limit: 9 } })
    return res.data.articles ?? []
  } catch {
    return []
  }
}

async function getCompanyAchievements(): Promise<Achievement[]> {
  const fallback: Achievement[] = [
    {
      id: 1,
      title: 'Giải thưởng Công nghệ Thông tin TP.HCM 2017',
      subtitle: 'TP.HCM ICT Awards',
      image_url: '/uploads/achievements/achievement-ict-award.jpg',
      display_order: 1,
    },
    {
      id: 2,
      title: 'Bằng khen UBND TP.HCM',
      subtitle: 'Sản phẩm công nghệ tiêu biểu',
      image_url: '/uploads/achievements/achievement-certificate.png',
      display_order: 2,
    },
    {
      id: 3,
      title: 'Tư duy Sáng tạo và Chuyển đổi số',
      subtitle: 'Liên hiệp các hội KHKT Việt Nam',
      image_url: '/uploads/achievements/achievement-trophy-gold.png',
      display_order: 3,
    },
  ]

  try {
    const res = await axiosInstance.get('/achievements')
    return res.data.achievements ?? fallback
  } catch {
    return fallback
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function resolveImageUrl(url: string) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/uploads')) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}${url}`
  }
  return url
}

export default async function HomePage() {
  const articles = await getPublishedArticles()
  const achievements = await getCompanyAchievements()

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Banner Carousel — structure mirrors .single-banner-carousel-container from index-design.html */}
      <section className="w-full max-w-[1720px] mx-auto px-4 pt-6 pb-4">
        <HeroBanner />
      </section>

      {/* Company Introduction */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
          CÔNG TY TNHH CÔNG NGHỆ ANH QUÂN - AQTECH
        </h1>
        <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">
          <span className="font-bold text-gray-800">AQTech</span> tự hào là đơn vị tiên phong trong lĩnh vực chuyển đổi số cho giáo dục tại Việt Nam. Chúng tôi đã và đang cung cấp các giải pháp công nghệ hiện đại cho hơn{' '}
          <span className="font-bold text-gray-800">130 trường Đại học, Cao đẳng, Học viện,</span> hơn{' '}
          <span className="font-bold text-gray-800">60 Sở Giáo dục &amp; Đào tạo,</span> cùng{' '}
          <span className="font-bold text-gray-800">140 trường THPT</span> trên cả nước.
        </p>
        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
          Với hơn <span className="font-bold text-gray-800">30 năm kinh nghiệm,</span> các sản phẩm và dịch vụ của AQTech không ngừng được cải tiến để đáp ứng nhu cầu thực tiễn. Đặc biệt, từ năm{' '}
          <span className="font-bold text-gray-800">2009,</span> công ty đã mở rộng triển khai giải pháp cho Bộ Giáo dục &amp; Đào tạo Lào, khẳng định uy tín và chất lượng trên thị trường khu vực.
        </p>

        {/* Achievement showcase */}
        <div className="mt-14 rounded-[2rem] border border-cyan-100 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-5 md:p-10 text-left shadow-[0_24px_80px_-30px_rgba(8,47,73,0.8)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                Thành tựu nổi bật
              </div>
              <h2 className="mt-5 text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                TƯ DUY SÁNG TẠO
              </h2>
              <p className="mt-3 text-cyan-100/80 text-base md:text-lg leading-relaxed">
                Chìa khóa cho giải pháp vượt trội trong thời đại số
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cyan-50 backdrop-blur-sm">
                  <span className="mr-2" aria-hidden>🚀</span>
                  Giải pháp công nghệ tiên tiến cho giáo dục hiện đại
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cyan-50 backdrop-blur-sm">
                  <span className="mr-2" aria-hidden>🤝</span>
                  Đồng hành cùng giáo dục trong kỷ nguyên số
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cyan-50 backdrop-blur-sm">
                  <span className="mr-2" aria-hidden>✨</span>
                  Chuyển đổi số giáo dục - Kiến tạo tương lai
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
              {achievements.map((achievement, idx) => (
                <div
                  key={achievement.id}
                  className="group relative overflow-hidden rounded-2xl border border-cyan-200/15 bg-white/[0.03] p-4 backdrop-blur-md"
                >
                  <div className="pointer-events-none absolute -top-14 -right-10 h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl" />
                  <div className="relative flex items-start gap-4">
                    <img
                      src={resolveImageUrl(achievement.image_url)}
                      alt={achievement.title}
                      className="h-24 w-24 md:h-28 md:w-28 rounded-xl object-cover ring-1 ring-cyan-200/20 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div>
                      <div className="inline-flex items-center rounded-full bg-cyan-400/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-cyan-200">
                        #{idx + 1} Achievement
                      </div>
                      <h3 className="mt-2 text-sm md:text-base font-bold text-white leading-snug">
                        {achievement.title}
                      </h3>
                      {achievement.subtitle && (
                        <p className="mt-1 text-xs md:text-sm text-cyan-100/70">
                          {achievement.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Groups Overview */}
      <section className="max-w-[1720px] mx-auto px-6 py-20">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Sản phẩm của chúng tôi
          </h2>
          <div className="mt-4 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Khám phá các giải pháp phần mềm tiên tiến giúp tối ưu quản lý và nâng cao hiệu suất
          </p>
        </div>

        {/* Product cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="group relative bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
              <svg className="w-7 h-7" viewBox="0 0 640 512" fill="currentColor"><path d="M0 224v272c0 8.84 7.16 16 16 16h80V192H32c-17.67 0-32 14.33-32 32zm360-48h-24v-40c0-4.42-3.58-8-8-8h-16c-4.42 0-8 3.58-8 8v64c0 4.42 3.58 8 8 8h48c4.42 0 8-3.58 8-8v-16c0-4.42-3.58-8-8-8zm137.75-63.96l-160-106.67a32.02 32.02 0 0 0-35.5 0l-160 106.67A32.002 32.002 0 0 0 128 138.66V512h128V368c0-8.84 7.16-16 16-16h96c8.84 0 16 7.16 16 16v144h128V138.67c0-10.7-5.35-20.7-14.25-26.63zM320 256c-44.18 0-80-35.82-80-80s35.82-80 80-80 80 35.82 80 80-35.82 80-80 80zm288-64h-64v320h80c8.84 0 16-7.16 16-16V224c0-17.67-14.33-32-32-32z"/></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Nhóm phần mềm nghiệp vụ quản lý trường đại học | cao đẳng | học viện
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Bộ giải pháp toàn diện hỗ trợ quản lý đào tạo, sinh viên, nhân sự, khảo thí, tài sản, tài chính, ký túc xá và các hoạt động vận hành trường học.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
              Xem thêm
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </span>
          </div>

          {/* Card 2 */}
          <div className="group relative bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <svg className="w-7 h-7" viewBox="0 0 384 512" fill="currentColor"><path d="M336 64h-80c0-35.3-28.7-64-64-64s-64 28.7-64 64H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM192 40c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24zm121.2 231.8l-143 141.8c-4.7 4.7-12.3 4.6-17-.1l-82.6-83.3c-4.7-4.7-4.6-12.3.1-17L99.1 285c4.7-4.7 12.3-4.6 17 .1l46 46.4 106-105.2c4.7-4.7 12.3-4.6 17 .1l28.2 28.4c4.7 4.8 4.6 12.3-.1 17z"/></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Nhóm giải pháp quản trị và hỗ trợ kiểm định chất lượng cơ sở giáo dục
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Hệ thống hỗ trợ đánh giá chuẩn đầu ra, khảo sát, đo lường tiêu chuẩn, minh chứng kiểm định và chiến lược phát triển – giúp nâng cao hiệu quả quản trị.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 group-hover:gap-2 transition-all">
              Xem thêm
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </span>
          </div>

          {/* Card 3 */}
          <div className="group relative bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <div className="w-14 h-14 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-5">
              <svg className="w-7 h-7" viewBox="0 0 576 512" fill="currentColor"><path d="M392 64h166.54L576 0H192v352h288l17.46-64H392c-4.42 0-8-3.58-8-8v-16c0-4.42 3.58-8 8-8h114.18l17.46-64H392c-4.42 0-8-3.58-8-8v-16c0-4.42 3.58-8 8-8h140.36l17.46-64H392c-4.42 0-8-3.58-8-8V72c0-4.42 3.58-8 8-8zM158.8 335.01l-25.78-63.26c-2.78-6.81-9.8-10.99-17.24-10.26l-45.03 4.42c-17.28-46.94-17.65-99.78 0-147.72l45.03 4.42c7.43.73 14.46-3.46 17.24-10.26l25.78-63.26c3.02-7.39.2-15.85-6.68-20.07l-39.28-24.1C98.51-3.87 80.09-.5 68.95 11.97c-92.57 103.6-92 259.55 2.1 362.49 9.87 10.8 29.12 12.48 41.65 4.8l39.41-24.18c6.89-4.22 9.7-12.67 6.69-20.07zM480 384H192c-35.35 0-64 28.65-64 64v32c0 17.67 14.33 32 32 32h352c17.67 0 32-14.33 32-32v-32c0-35.35-28.65-64-64-64zm-144 96c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"/></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Nhóm Cổng thông tin và phần mềm di động dành cho sinh viên &amp; Giảng viên
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Tập hợp các cổng thông tin và ứng dụng di động hỗ trợ tuyển sinh, đào tạo, thanh toán, điều hành và quản lý thông tin – giúp kết nối nhanh chóng.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 group-hover:gap-2 transition-all">
              Xem thêm
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </span>
          </div>

          {/* Card 4 */}
          <div className="group relative bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <div className="w-14 h-14 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
              <svg className="w-7 h-7" viewBox="0 0 384 512" fill="currentColor"><path d="M120 72c0-39.765 32.235-72 72-72s72 32.235 72 72c0 39.764-32.235 72-72 72s-72-32.236-72-72zm254.627 1.373c-12.496-12.497-32.758-12.497-45.254 0L242.745 160H141.254L54.627 73.373c-12.496-12.497-32.758-12.497-45.254 0-12.497 12.497-12.497 32.758 0 45.255L104 213.254V480c0 17.673 14.327 32 32 32h16c17.673 0 32-14.327 32-32V368h16v112c0 17.673 14.327 32 32 32h16c17.673 0 32-14.327 32-32V213.254l94.627-94.627c12.497-12.497 12.497-32.757 0-45.254z"/></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Nhóm phần mềm quản lý trường Phổ thông &amp; Mầm non
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Giải pháp quản lý toàn diện cho các trường phổ thông và mầm non, bao gồm quản lý học vụ, thu học phí và công nợ – hỗ trợ số hóa và tinh gọn vận hành.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600 group-hover:gap-2 transition-all">
              Xem thêm
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </span>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
            <div className="text-4xl font-extrabold mb-1">24</div>
            <div className="text-sm text-blue-100">Giải pháp phần mềm quản lý &amp; điều hành thông minh</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-8 text-center text-white">
            <div className="text-4xl font-extrabold mb-1">8</div>
            <div className="text-sm text-cyan-100">Cổng thông tin &amp; Hệ thống phần mềm giáo dục</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-8 text-center text-white">
            <div className="text-4xl font-extrabold mb-1">3</div>
            <div className="text-sm text-indigo-100">Giải pháp toàn diện cho trường Phổ thông &amp; Mầm non</div>
          </div>
        </div>
      </section>

      {/* Why Choose AQTech */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a2a5e] py-24">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-[160px]" />
        </div>
        {/* Dot grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
          <defs>
            <pattern id="whyDots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#whyDots)" />
        </svg>

        <div className="relative z-10 max-w-[1720px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-cyan-300 text-sm font-medium tracking-wide">Đối tác chiến lược</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                Tại sao nên chọn <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">AQTech</span>?
              </h2>
              <p className="text-blue-200/70 text-lg leading-relaxed mb-12 max-w-xl">
                Chọn AQTech, các cơ sở giáo dục không chỉ mua phần mềm – mà còn chọn một đối tác chiến lược đồng hành trong hành trình chuyển đổi số, tối ưu vận hành và nâng tầm trải nghiệm học tập.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Feature 1 */}
                <div className="group relative bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-400/30 rounded-2xl p-6 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/20 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">Dẫn đầu công nghệ</h3>
                  <p className="text-blue-200/50 text-sm leading-relaxed">Chúng tôi ứng dụng các công nghệ tiên tiến nhất trong lĩnh vực chuyển đổi số giáo dục, giúp các trường đại học tối ưu hóa hoạt động quản lý và đào tạo trong kỷ nguyên số.</p>
                </div>

                {/* Feature 2 */}
                <div className="group relative bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-yellow-400/30 rounded-2xl p-6 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-400/20 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">Linh hoạt &amp; dễ triển khai</h3>
                  <p className="text-blue-200/50 text-sm leading-relaxed">Hệ thống được thiết kế với kiến trúc mở, dễ dàng tùy biến theo đặc thù từng Trường. Việc triển khai nhanh chóng, không gây gián đoạn đến hoạt động hiện tại.</p>
                </div>

                {/* Feature 3 */}
                <div className="group relative bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-emerald-400/30 rounded-2xl p-6 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-400/20 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">An toàn &amp; bảo mật</h3>
                  <p className="text-blue-200/50 text-sm leading-relaxed">Chúng tôi tuân thủ các tiêu chuẩn bảo mật cao nhất, đảm bảo an toàn dữ liệu người học, cán bộ và toàn bộ hệ thống thông tin của nhà trường.</p>
                </div>

                {/* Feature 4 */}
                <div className="group relative bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-pink-400/30 rounded-2xl p-6 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-400/20 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">Hỗ trợ tận tâm</h3>
                  <p className="text-blue-200/50 text-sm leading-relaxed">Đội ngũ AQTech của chúng tôi luôn đồng hành, lắng nghe và hỗ trợ khách hàng – từ tư vấn, đào tạo, đến bảo trì và nâng cấp hệ thống.</p>
                </div>
              </div>
            </div>

            {/* Right - Tech illustration */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-[520px] h-[520px]">
                {/* Outer rotating ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-white/10 animate-[spin_40s_linear_infinite]" />
                <div className="absolute inset-6 rounded-full border border-white/[0.06]" />
                <div className="absolute inset-12 rounded-full border border-dashed border-cyan-400/10 animate-[spin_30s_linear_infinite_reverse]" />

                {/* Center hub */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 backdrop-blur-xl flex items-center justify-center shadow-[0_0_60px_rgba(34,211,238,0.15)]">
                  <div className="text-cyan-400 font-extrabold text-xl tracking-widest">AQ</div>
                </div>

                {/* Orbiting nodes */}
                <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-16 h-16 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]">
                  <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  </svg>
                </div>

                <div className="absolute top-1/2 right-[6%] -translate-y-1/2 w-16 h-16 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite_0.75s]">
                  <svg className="w-7 h-7 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>

                <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-16 h-16 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite_1.5s]">
                  <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>

                <div className="absolute top-1/2 left-[6%] -translate-y-1/2 w-16 h-16 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite_2.25s]">
                  <svg className="w-7 h-7 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </div>

                {/* Connection lines from center to nodes */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 520 520">
                  <line x1="260" y1="260" x2="260" y2="75" stroke="url(#lineGrad)" strokeWidth="1" opacity="0.3" />
                  <line x1="260" y1="260" x2="455" y2="260" stroke="url(#lineGrad)" strokeWidth="1" opacity="0.3" />
                  <line x1="260" y1="260" x2="260" y2="445" stroke="url(#lineGrad)" strokeWidth="1" opacity="0.3" />
                  <line x1="260" y1="260" x2="65" y2="260" stroke="url(#lineGrad)" strokeWidth="1" opacity="0.3" />
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                      <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Floating particles */}
                <div className="absolute top-[25%] right-[20%] w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-40" />
                <div className="absolute bottom-[30%] left-[18%] w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping opacity-30" style={{ animationDelay: '1s' }} />
                <div className="absolute top-[35%] left-[25%] w-1 h-1 rounded-full bg-white animate-ping opacity-20" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-[22%] right-[25%] w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping opacity-30" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & Stats */}
      <TestimonialSlider />

      {/* Articles grid */}
      <section id="articles" className="max-w-[1720px] mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">Latest Articles</h2>

        {articles.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No articles published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100"
              >
                {article.thumbnail_url ? (
                  <img
                    src={article.thumbnail_url.startsWith('/uploads')
                      ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}${article.thumbnail_url}`
                      : article.thumbnail_url}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <span className="text-blue-400 text-4xl">📰</span>
                  </div>
                )}
                <div className="p-6">
                  {article.category && (
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                      {article.category}
                    </span>
                  )}
                  <h3 className="mt-1 text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="mt-2 text-gray-500 text-sm line-clamp-3">{article.excerpt}</p>
                  )}
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                    <span>By {article.author_username}</span>
                    <span>·</span>
                    <span>{formatDate(article.created_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    </main>
  )
}
