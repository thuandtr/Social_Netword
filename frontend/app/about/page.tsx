'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

/* ── Shared dot-grid background (matches homepage) ─────── */
function DotGrid({ id = 'aboutDots' }: { id?: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
      <defs>
        <pattern id={id} x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="white" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* ══════════════════════════════════════════════════
          HERO — dark tech banner (matches homepage "Why AQTech")
         ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a2a5e] py-24 md:py-32">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400 rounded-full blur-[140px]" />
        </div>
        <DotGrid id="heroDots" />

        <div className="page-hero-inner relative z-10">
          <div className="page-hero-badge">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="page-hero-badge-text">Về chúng tôi</span>
          </div>
          <h1 className="page-hero-title">
            Giới thiệu{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              AQTech
            </span>
          </h1>
          <p className="page-hero-desc">
            Hơn 30 năm tiên phong chuyển đổi số giáo dục — từ phần mềm quản lý đào tạo đầu tiên đến hệ sinh thái công nghệ giáo dục toàn diện hàng đầu Việt Nam.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          LỊCH SỬ HÌNH THÀNH — light section with accent cards
         ══════════════════════════════════════════════════ */}
      <section id="lichsuphattrien" className="bg-gray-50 py-20 md:py-28">
        <div className="max-w-[1720px] mx-auto px-6">
          {/* Section heading — homepage style */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Lịch Sử Hình Thành &amp; Phát Triển
            </h2>
            <div className="mt-4 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">
              Hành trình từ phòng nghiên cứu đến doanh nghiệp EdTech hàng đầu
            </p>
          </div>

          <div className="max-w-[1400px] mx-auto">
            {/* Intro paragraph */}
            <div className="group relative bg-white rounded-2xl border border-gray-100 p-8 md:p-10 shadow-sm mb-10 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                Tiền thân là Công ty TNHH Công Nghệ Anh Quân là Công ty TNHH MTV
                phần mềm Anh Quân hoạt động trong lĩnh vực:{' '}
                <em className="text-blue-700 font-medium">
                  &quot;Tư vấn - Thiết kế phần mềm ứng dụng trong quản lý giáo dục&quot;
                </em>
                , là đơn vị tiên phong trên cả nước về giải pháp phần mềm quản lý
                đào tạo theo hệ thống tín chỉ.
              </p>
            </div>

            {/* Timeline milestones — card grid matching homepage product cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
              {/* 1993 */}
              <div className="group relative bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 font-extrabold text-xl">
                  93
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">1993 — Khởi nguồn</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Ra đời từ năm 1993, với hơn 12 phân hệ, Phiên bản Edusoft tập
                  trung tin học hóa các quy trình nghiệp vụ về quản lý đào tạo
                  tại Trường Đại học Bách khoa Tp.HCM, được viết bởi Thạc sĩ Võ
                  Tấn Quân — người đi tiên phong trong lĩnh vực phần mềm quản lý
                  giáo dục với 26 năm kinh nghiệm giảng dạy.
                </p>
              </div>

              {/* 2008 */}
              <div className="group relative bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 font-extrabold text-xl">
                  08
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">2008 — Thành lập</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Đầu năm 2008, với tâm huyết tin học hóa trong lĩnh vực giáo
                  dục, Thạc sĩ Võ Tấn Quân đã sáng lập ra Công ty TNHH MTV Phần
                  mềm Anh Quân. Cùng với đội ngũ nhân viên trẻ, năng động, giàu
                  kinh nghiệm trong lĩnh vực giáo dục và sản xuất phần mềm.
                </p>
              </div>

              {/* 2013 */}
              <div className="group relative bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <div className="w-14 h-14 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-5 font-extrabold text-xl">
                  13
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">2013 — Bước ngoặt</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Chính thức thành lập Công ty TNHH Công nghệ Anh Quân, kế thừa
                  toàn bộ thế mạnh về quy trình nghiệp vụ, giải pháp phần mềm,
                  sản phẩm và nguồn lực — đa dạng hóa giải pháp CNTT cho Đại học,
                  Cao đẳng, Trung cấp và Viện đào tạo trên cả nước.
                </p>
              </div>
            </div>

            {/* Stats bar — mirrors homepage stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
                <div className="text-4xl font-extrabold mb-1">30+</div>
                <div className="text-sm text-blue-100">Năm kinh nghiệm trong lĩnh vực EdTech</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-8 text-center text-white">
                <div className="text-4xl font-extrabold mb-1">130+</div>
                <div className="text-sm text-cyan-100">Trường Đại học, Cao đẳng, Học viện</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-8 text-center text-white">
                <div className="text-4xl font-extrabold mb-1">200+</div>
                <div className="text-sm text-indigo-100">Sở GD&amp;ĐT và Trường THPT trên cả nước</div>
              </div>
            </div>

            {/* Timeline illustration */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <img
                src="https://aqtech.edu.vn/wp-content/uploads/2025/05/image-41.png"
                alt="Lịch sử hình thành và phát triển AQTech"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TẦM NHÌN & SỨ MỆNH — dark tech section
         ══════════════════════════════════════════════════ */}
      <section id="tamnhinsumenh" className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a2a5e] py-24">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-[160px]" />
        </div>
        <DotGrid id="visionDots" />

        <div className="relative z-10 max-w-[1720px] mx-auto px-6">
          <div className="max-w-[1400px] mx-auto">
            {/* Section heading */}
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-cyan-300 text-sm font-medium tracking-wide">Định hướng phát triển</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                Tầm Nhìn &amp;{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  Sứ Mệnh
                </span>
              </h2>
              <p className="text-blue-200/70 text-lg leading-relaxed max-w-3xl mx-auto">
                Tại AQTech, chúng tôi tin rằng giáo dục là chìa khóa để xây dựng
                một tương lai tươi sáng. Thúc đẩy sự phát triển giáo dục bằng cách
                cung cấp các giải pháp phần mềm đột phá và hiệu quả — để mọi
                người học đều có cơ hội tham gia vào một môi trường giáo dục chất
                lượng và phù hợp.
              </p>
            </div>

            {/* Vision / Mission / Core Values — glassmorphism cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
              {/* Tầm nhìn */}
              <div className="group relative bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-400/30 rounded-2xl p-8 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/20 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-3">Tầm nhìn</h3>
                <p className="text-blue-200/60 text-sm leading-relaxed">
                  Trở thành nhà cung cấp Hệ thống thông tin Quản trị giáo dục
                  số một Việt Nam và vươn ra thế giới. Là bạn đồng hành đáng tin
                  cậy của các cơ sở giáo dục trong lộ trình chuyển đổi số.
                </p>
              </div>

              {/* Sứ mệnh */}
              <div className="group relative bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-emerald-400/30 rounded-2xl p-8 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-400/20 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-3">Sứ mệnh</h3>
                <p className="text-blue-200/60 text-sm leading-relaxed">
                  Mang lại các giải pháp Công nghệ thông tin quản trị tối ưu cho
                  các cơ sở giáo dục Việt Nam. Đồng thời tạo dựng môi trường số
                  mang lại trải nghiệm tuyệt vời cho người dạy và người học.
                </p>
              </div>

              {/* Giá trị cốt lõi */}
              <div className="group relative bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-yellow-400/30 rounded-2xl p-8 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-400/20 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-3">Giá trị cốt lõi</h3>
                <p className="text-blue-200/60 text-sm leading-relaxed">
                  Khách hàng hài lòng – Nhân viên hạnh phúc. Chúng tôi đặt sự
                  hài lòng của khách hàng và hạnh phúc của nhân viên làm nền tảng
                  cho mọi hoạt động.
                </p>
              </div>
            </div>

            {/* Vision banner image */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-7@2x-e1756367118737.png"
                alt="Tầm nhìn và Sứ mệnh AQTech"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ĐỘI NGŨ — light section
         ══════════════════════════════════════════════════ */}
      <section id="doinguaq" className="bg-gray-50 py-20 md:py-28">
        <div className="max-w-[1720px] mx-auto px-6">
          <div className="max-w-[1400px] mx-auto">
            {/* Heading */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Đội Ngũ Của Chúng Tôi
              </h2>
              <div className="mt-4 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
              <p className="mt-4 text-gray-500 max-w-xl mx-auto">
                Tập hợp những chuyên gia giàu kinh nghiệm và đam mê công nghệ
              </p>
            </div>

            {/* Team carousel */}
            <TeamCarousel />

            {/* CTA */}
            <div className="text-center mt-10">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300"
              >
                Liên Hệ Ngay
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ĐỐI TÁC — dark tech section
         ══════════════════════════════════════════════════ */}
      <section id="doitac" className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a2a5e] py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-400 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500 rounded-full blur-[140px]" />
        </div>
        <DotGrid id="partnerDots" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          {/* Heading */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-300 text-sm font-medium tracking-wide">Hệ sinh thái đối tác</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              Đối Tác{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Chiến Lược
              </span>
            </h2>
            <p className="text-blue-200/70 text-lg leading-relaxed max-w-3xl mx-auto">
              AQ Technology hợp tác cùng các ngân hàng{' '}
              <span className="text-white font-semibold">BIDV, Vietinbank, Vietcombank</span> và{' '}
              <span className="text-white font-semibold">ACB</span>{' '}
              nhằm mang đến giải pháp thanh toán an toàn, nhanh chóng và tiện lợi
              — nâng cao trải nghiệm và tích hợp hiệu quả trong hệ sinh thái AQTech.
            </p>
          </div>

          {/* Bank logos in glassmorphism cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-20">
            {[
              { src: 'https://aqtech.edu.vn/wp-content/uploads/2025/04/image-16.png', alt: 'Vietcombank' },
              { src: 'https://aqtech.edu.vn/wp-content/uploads/2025/07/Logo_BIDV.svg.png', alt: 'BIDV' },
              { src: 'https://aqtech.edu.vn/wp-content/uploads/2025/07/Asia_Commercial_Bank_logo.svg', alt: 'ACB' },
              { src: 'https://aqtech.edu.vn/wp-content/uploads/2025/07/logo-vietinbank-co-slogan.png', alt: 'Vietinbank' },
              { src: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/VPBank_logo.svg-1.png', alt: 'VPBank' },
            ].map((logo) => (
              <div
                key={logo.alt}
                className="bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] hover:border-cyan-400/30 rounded-2xl p-6 flex items-center justify-center h-28 transition-all duration-300"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-14 w-auto object-contain brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>

          {/* Other partners */}
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Các Đối Tác Nổi Bật Khác
            </h3>
            <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { src: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/image-17.png', alt: 'Đối tác 1' },
              { src: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/image-19.png', alt: 'Đối tác 2' },
              { src: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/wu5l699a.png', alt: 'Đối tác 3' },
            ].map((logo) => (
              <div
                key={logo.alt}
                className="bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] hover:border-cyan-400/30 rounded-2xl p-6 flex items-center justify-center h-28 transition-all duration-300"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-14 w-auto object-contain brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ══════════════════════════════════════════════════════════
   Team Image Carousel
   ══════════════════════════════════════════════════════════ */
const teamImages = [
  { src: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/hinh-anh-tap-the-AQTech.png', alt: 'Tập thể nhân viên AQTech' },
  { src: 'https://aqtech.edu.vn/wp-content/uploads/2025/07/3.Tap-the-nhan-vien-AQ-SNhat.jpg', alt: 'Tập thể nhân viên AQ – Sự kiện' },
  { src: 'https://aqtech.edu.vn/wp-content/uploads/2025/07/2.AQ-hop.jpg', alt: 'AQTech họp' },
];

function TeamCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = teamImages.length;

  const startAutoPlay = useCallback(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 4000);
  }, [total]);

  const stopAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [startAutoPlay, stopAutoPlay]);

  const goTo = (idx: number) => {
    setCurrent(idx);
    stopAutoPlay();
    startAutoPlay();
  };

  const prev = () => goTo((current - 1 + total) % total);
  const next = () => goTo((current + 1) % total);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-xl border border-gray-100 bg-gray-900"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {teamImages.map((img) => (
          <div key={img.src} className="w-full flex-shrink-0">
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-[300px] md:h-[520px] object-cover"
            />
          </div>
        ))}
      </div>

      {/* Prev / Next — tech style with backdrop-blur */}
      <button
        onClick={prev}
        aria-label="Ảnh trước"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Ảnh tiếp theo"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {teamImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Xem ảnh ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current
                ? 'w-8 bg-gradient-to-r from-cyan-400 to-blue-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
