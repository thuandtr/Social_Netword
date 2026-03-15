export const metadata = {
  title: 'Khách hàng — AQTech',
  description: 'Danh sách khách hàng và đối tác của AQTech.',
};

/* ── Dot grid background ─────── */
function DotGrid({ id = 'clientDots' }: { id?: string }) {
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

/* ── Section icon map ─────── */
function SectionIcon({ type }: { type: 'university' | 'department' | 'school' | 'partner' }) {
  const icons: Record<string, React.ReactNode> = {
    university: (
      <svg className="w-7 h-7" viewBox="0 0 640 512" fill="currentColor"><path d="M0 224v272c0 8.84 7.16 16 16 16h80V192H32c-17.67 0-32 14.33-32 32zm360-48h-24v-40c0-4.42-3.58-8-8-8h-16c-4.42 0-8 3.58-8 8v64c0 4.42 3.58 8 8 8h48c4.42 0 8-3.58 8-8v-16c0-4.42-3.58-8-8-8zm137.75-63.96l-160-106.67a32.02 32.02 0 0 0-35.5 0l-160 106.67A32.002 32.002 0 0 0 128 138.66V512h128V368c0-8.84 7.16-16 16-16h96c8.84 0 16 7.16 16 16v144h128V138.67c0-10.7-5.35-20.7-14.25-26.63zM320 256c-44.18 0-80-35.82-80-80s35.82-80 80-80 80 35.82 80 80-35.82 80-80 80zm288-64h-64v320h80c8.84 0 16-7.16 16-16V224c0-17.67-14.33-32-32-32z"/></svg>
    ),
    department: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>
    ),
    school: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>
    ),
    partner: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
    ),
  };
  return <>{icons[type]}</>;
}

/* ── Client card with hover accent ─────── */
function ClientCard({ name, img, accentColor = 'from-blue-500 to-cyan-400' }: { name: string; img: string; accentColor?: string }) {
  return (
    <div className="group relative flex flex-col items-center text-center gap-3 p-5 bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Top accent bar on hover (matches homepage card pattern) */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentColor} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
      <div className="w-[90px] h-[90px] flex items-center justify-center rounded-xl bg-gray-50 group-hover:bg-blue-50/50 p-2 overflow-hidden transition-colors duration-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={name} className="max-w-full max-h-full object-contain" loading="lazy" />
      </div>
      <h5 className="text-[13px] font-semibold text-gray-700 group-hover:text-gray-900 leading-snug min-h-[2.5rem] flex items-center transition-colors duration-300">
        {name}
      </h5>
    </div>
  );
}

/* ── Section heading matching homepage pattern ─────── */
function SectionHeading({
  children,
  subtitle,
  iconType,
  iconBg,
  iconColor,
}: {
  children: React.ReactNode;
  subtitle?: string;
  iconType?: 'university' | 'department' | 'school' | 'partner';
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <div className="text-center mb-14">
      {iconType && (
        <div className={`w-14 h-14 rounded-xl ${iconBg ?? 'bg-blue-50'} ${iconColor ?? 'text-blue-600'} flex items-center justify-center mx-auto mb-5`}>
          <SectionIcon type={iconType} />
        </div>
      )}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
        {children}
      </h2>
      <div className="mt-4 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
      {subtitle && (
        <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-sm md:text-base">{subtitle}</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DATA — Hardcoded (chưa có database chính thức)
   ═══════════════════════════════════════════════════════════ */

const universities = [
  { name: 'Trường Đại học Ngoại Thương', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/d311bd366a8402b3410fae7437aa1dc814126e53.png' },
  { name: 'Học viện Nông nghiệp Việt Nam', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/df319596544fdf6fd2abd3c44620a9b17f8f261d.png' },
  { name: 'Trường Đại học Quốc Tế', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/db059ba2d1f5177cbb2e33a9649f04aca2df3de6.png' },
  { name: 'Trường Đại học Sài Gòn', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/f7d0cacc2c33b295f904a2faf1858a860af62093.jpg' },
  { name: 'Trường Đại học Thủ Dầu Một', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/8586f819760b110c5433ef3a418ade0316be79d7.jpg' },
  { name: 'Trường Đại học Kinh tế - Tài chính TP.HCM', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/86acf63fc895b614e3953c4ad5296a46fcbcfa89.jpg' },
  { name: 'Trường Đại học Công Nghệ TP.HCM', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/a8522271b1234d75468960adf7324eefff17c9e4.png' },
  { name: 'Trường Đại học Mỏ Địa Chất', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/43d2e63a8092e6fac2ee2c7e5ae542d094ca562d.png' },
  { name: 'Trường Đại học Kỹ Thuật Công Nghiệp Thái Nguyên', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/12b2a3c5b22aabb5a49fb58fb8d6e9d73cf16e4b.png' },
  { name: 'Học Viện Công Nghệ Bưu Chính Viễn Thông', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/a2502285d8dc25d8d51a156cce13f85542f1a47b.png' },
  { name: 'Trường Đại học Mở TP.HCM', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/e4d7664b68d3637fcdc97f82acf283351c11f2b8.png' },
  { name: 'Trường Đại học Nông Lâm TP.HCM', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/670fc514544ccd15530917bbeee84b91433754db.png' },
  { name: 'Học viện Công Nghệ Bưu Chính Viễn Thông cơ sở tại TP. HCM', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/a2502285d8dc25d8d51a156cce13f85542f1a47b.png' },
  { name: 'Trường Đại học Ngoại thương Cơ sở II – TP. HCM', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/d311bd366a8402b3410fae7437aa1dc814126e53-1.png' },
  { name: 'Trường Đại học Phan Châu Trinh', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/fd49c3c0a178b39317b661bf9d70af281738f762.png' },
  { name: 'Trường Đại học Ngoại thương Cơ sở II – TP. HCM', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/498e0ae838bacac271ffcd6044963ef953ad6ba8.png' },
  { name: 'Phân hiệu Trường Đại học Lâm Nghiệp tại tỉnh Đồng Nai', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/be339fdd1fd6334cfc5ffe33e6158b186e370ac3.png' },
  { name: 'Trường Đại học Dầu khí Việt Nam', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/1cb6b4ae5a55a9d61412b5b4c39896100985bb18.jpg' },
  { name: 'Trường Đại học Hùng Vương TP.HCM', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/2c97dc4e2fdbd8bbf5530bc0bfa4ae5cd91b0d6b.png' },
  { name: 'Trường Đại học Bình Dương', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/d476d139e8c2853af4d1244a35fc85036e721c03.jpg' },
  { name: 'Trường Đại học Hà Tĩnh', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/b4e2243ccfb9317a7259418f57971375ca3191e2.jpg' },
  { name: 'Trường Đại học Hoa Sen TP.HCM', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/f84c632ba36cfa4b3eee5ccb38356bd50e3d6e6c.png' },
  { name: 'Trường Đại học Quốc Tế Miền Đông', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/f8acf25927bd38e9a184fd0d3a4fd98de73cfc26.png' },
  { name: 'Trường Đại học Kinh Tế Kỹ Thuật Bình Dương', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/2921d84ad69b268cc37863969b5241136946d76f.png' },
  { name: 'Trường Cao đẳng Xây dựng số 1 - CTC1', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/d02e058bf5d4ad02ae3ae46da0a0f2487ddbe4e0.jpg' },
  { name: 'Trường Đại học Trà Vinh', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/ceb1e8e44dbe53b140cbe923708942870d359d5d.jpg' },
  { name: 'Trường Đại học Tư thục Quốc tế Sài Gòn', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/932d698a9cb5150e64477306d8b9d58dba5fa4f8.png' },
  { name: 'Trường Đại học Công nghệ Sài Gòn', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/STU_Logo.png' },
];

const educationDepartments = [
  { name: 'Sở Giáo dục & Đào tạo Khánh Hòa', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/e0741c6d9e677582ca6fdf1d92a5dac0c80b432d-1.jpg' },
  { name: 'Sở Giáo dục & Đào tạo Bình Dương', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/1ff87b687e7e0296c92862efc7eed948961b5d0a-1.png' },
  { name: 'Sở Giáo dục & Đào tạo Đà Nẵng', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/f59730c4f8ed9ea6c56ea771a39625738ce54660-1.jpg' },
  { name: 'Sở Giáo dục & Đào tạo Đắk Lắk', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/0fde954e5c0f682e7c36909e2423652346473563-1.jpg' },
  { name: 'Sở Giáo dục & Đào tạo Tiền Giang', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/463daaa5adecd26d9f4e559b165e5a37824abe46-1.png' },
  { name: 'Sở Giáo dục & Đào tạo tỉnh Tuyên Quang', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/c108a124ce8b2ae64f091bb8b1123a17b253e397-1.jpg' },
  { name: 'Sở Giáo dục & Đào tạo tỉnh Cần Thơ', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/e4ad2433e2757acea71ce03d38108de1c639c02c-1.jpg' },
  { name: 'Sở Giáo dục & Đào tạo tỉnh Gia Lai', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/66c9539715b0d73714615fa3a9834272ecbdf9e8-1.jpg' },
  { name: 'Sở Giáo dục & Đào tạo Thừa Thiên Huế', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/90b12162448a177510f0ede35d0f44770a8611fd-1.jpg' },
  { name: 'Sở Giáo dục & Đào tạo Thành phố Hà Nội', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/b4d4e95a129dfe539ce49f63ba2847f95d341279-1.png' },
  { name: 'Sở Giáo dục và Đào tạo Thành phố Hồ Chí Minh', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/a7fda4ff9ded69d9542935b5f3b1a0a8f0b1fafd-1.png' },
  { name: 'Sở Giáo dục & Đào tạo tỉnh Đồng Tháp', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/e89025bacbfeb40303d15d1b013d178987a825c0-1.png' },
];

const highSchools = [
  { name: 'Trường THPT Nguyễn Huệ', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/dcf524e798bbe27af97dd363b0f77f722b76f9f5-1.jpg' },
  { name: 'Trường THPT Gò Công', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/0feb352066c53fc172a9be43659ce47fa13d0ade-1.jpg' },
  { name: 'Trường THPT Chuyên Tiền Giang', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/b24737a190bddfd15d43a94fbc8bd2b334ee38ec-1.jpg' },
  { name: 'Trường THPT chuyên Quang Trung', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/514a72baea2c1733c81cba1aab0af663f18e60b8-1.jpg' },
  { name: 'Trường PTTH Bán Công Lê Lợi Pleiku - Gia Lai', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/ab238cdbee4b440600b6423c634a7b6bae33de93-1.jpg' },
  { name: 'THPT chuyên Nguyễn Đình Chiểu', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/7fb73d266a216e4e223194163328428a5837a99e-1.jpg' },
  { name: 'Trường PTTH Tam Nông', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/b9e6849ac4706829eff8f581a4a079b067e17f69-1.jpg' },
  { name: 'Trường THPT Chuyên Nguyễn Quang Diêu', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/ff4bf24a6cf5bc6e6e6410e95be844f6be0eb16c-1.jpg' },
  { name: 'Trường THPT Chuyên Quốc Học', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/9a79506b29d1323716b15d336498adda64da2b0a-1.jpg' },
  { name: 'Trường THPT Đồng Xoài', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/305069c2710bed5920859d9962cdcf229b8f6772-1.jpg' },
  { name: 'Trường THPT Lê Quý Đôn', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/25e45576c771bcbfb834998921b6764813055bc2-1.jpg' },
  { name: 'Trường PTTH Bạch Đằng - Hải Phòng', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/3fe4d5c7bb664ecd4c3060246e120b4eb4dec31a-1.png' },
];

const partners = [
  { name: 'Ngân Hàng VietcomBank', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/d8eb218849485acffc35b5949341af231ae30740.jpg' },
  { name: 'Công ty Cổ Phần Giải pháp Thanh Toán Việt Nam', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/image-17.png' },
  { name: 'Ngân Hàng Á Châu', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/image-18.png' },
  { name: 'Microsoft', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/06/image-19.png' },
];

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */

export default function ClientsPage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* ═══════════════════════════════════════════════════
          HERO — Dark tech banner (matches homepage "Why AQTech")
         ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a2a5e] py-24 md:py-32">
        {/* Background blur orbs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-[160px]" />
        </div>
        <DotGrid id="heroDots" />

        <div className="page-hero-inner relative z-10">
          {/* Badge pill */}
          <div className="page-hero-badge">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="page-hero-badge-text">Đối tác tin cậy</span>
          </div>

          <h1 className="page-hero-title">
            Khách hàng của{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              chúng tôi
            </span>
          </h1>

          <p className="page-hero-desc mb-14">
            Chúng tôi luôn quan niệm &ldquo;sự hài lòng của khách hàng&rdquo; là mục tiêu phấn đấu, đồng hành trọn đời cùng khách hàng, cam kết xây dựng và phát triển sản phẩm, dịch vụ tốt nhất, phù hợp đem lại giá trị cao nhất cho khách hàng.
          </p>

          {/* Stats bar inside hero (matches homepage stats pattern) */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="group relative bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-400/30 rounded-2xl p-6 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-1">130+</div>
              <div className="text-sm text-blue-200/50">Đại học, Cao đẳng &amp; Học viện</div>
            </div>
            <div className="group relative bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-emerald-400/30 rounded-2xl p-6 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-1">60+</div>
              <div className="text-sm text-blue-200/50">Sở Giáo dục &amp; Đào tạo</div>
            </div>
            <div className="group relative bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-violet-400/30 rounded-2xl p-6 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400 mb-1">140+</div>
              <div className="text-sm text-blue-200/50">Trường THPT trên cả nước</div>
            </div>
            <div className="group relative bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-amber-400/30 rounded-2xl p-6 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mb-1">30+</div>
              <div className="text-sm text-blue-200/50">Năm kinh nghiệm</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 1 — Đại học, Cao đẳng, Học viện
         ═══════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6">
          <SectionHeading
            iconType="university"
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            subtitle="Các cơ sở giáo dục đại học hàng đầu đã tin tưởng đồng hành cùng AQTech trong hành trình chuyển đổi số"
          >
            Đại học, Cao đẳng, Học viện &amp; Trung học chuyên nghiệp
          </SectionHeading>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 md:gap-5">
            {universities.map((c, i) => (
              <ClientCard key={`uni-${i}`} name={c.name} img={c.img} accentColor="from-blue-500 to-cyan-400" />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          Divider — Dark glassy strip (matches homepage dark section)
         ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a2a5e] py-16">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-10 right-20 w-64 h-64 bg-emerald-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 left-20 w-72 h-72 bg-cyan-400 rounded-full blur-[140px]" />
        </div>
        <DotGrid id="divider1Dots" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 text-sm font-medium tracking-wide">Sở Giáo dục</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight">
                Đồng hành cùng{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  các Sở GD&amp;ĐT
                </span>
              </h2>
              <p className="text-blue-200/60 text-base leading-relaxed max-w-xl">
                AQTech tự hào là đối tác công nghệ của hơn 60 Sở Giáo dục &amp; Đào tạo trên toàn quốc, hỗ trợ quản lý và vận hành hệ thống giáo dục từ trung ương đến địa phương.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {educationDepartments.slice(0, 6).map((c, i) => (
                <div key={`edu-preview-${i}`} className="group relative bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-emerald-400/30 rounded-2xl p-4 flex flex-col items-center text-center gap-2 transition-all duration-300">
                  <div className="w-[60px] h-[60px] flex items-center justify-center rounded-lg bg-white/10 p-1.5 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.img} alt={c.name} className="max-w-full max-h-full object-contain" loading="lazy" />
                  </div>
                  <span className="text-xs font-medium text-blue-200/70 leading-snug">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2 — Sở Giáo dục & Đào tạo (full grid)
         ═══════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <SectionHeading
            iconType="department"
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            subtitle="Đối tác chiến lược trong quản lý và vận hành hệ thống giáo dục địa phương"
          >
            Danh sách các Sở Giáo dục &amp; Đào tạo
          </SectionHeading>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
            {educationDepartments.map((c, i) => (
              <ClientCard key={`edu-${i}`} name={c.name} img={c.img} accentColor="from-emerald-500 to-teal-400" />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3 — THPT, THCS & Mầm Non
         ═══════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6">
          <SectionHeading
            iconType="school"
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
            subtitle="Giải pháp số hóa toàn diện cho các trường phổ thông và mầm non trên cả nước"
          >
            Trường Trung Học Phổ Thông, Trung Học Cơ Sở &amp; Mầm Non
          </SectionHeading>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
            {highSchools.map((c, i) => (
              <ClientCard key={`hs-${i}`} name={c.name} img={c.img} accentColor="from-violet-500 to-purple-400" />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 4 — Đối tác chiến lược (dark tech style)
         ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a2a5e] py-20 md:py-28">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-1/4 w-80 h-80 bg-amber-500 rounded-full blur-[140px]" />
          <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-blue-400 rounded-full blur-[120px]" />
        </div>
        <DotGrid id="partnerDots" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 mx-auto">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-300 text-sm font-medium tracking-wide">Đối tác chiến lược</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Danh sách các{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              đối tác
            </span>
          </h2>
          <p className="text-blue-200/60 text-base leading-relaxed max-w-2xl mx-auto mb-12">
            Hợp tác chiến lược với các tổ chức tài chính và công nghệ hàng đầu để mang lại giải pháp tối ưu cho khách hàng
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 max-w-3xl mx-auto">
            {partners.map((c, i) => (
              <div key={`partner-${i}`} className="group relative bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-amber-400/30 rounded-2xl p-6 flex flex-col items-center text-center gap-3 transition-all duration-300">
                <div className="w-[80px] h-[80px] flex items-center justify-center rounded-xl bg-white/10 group-hover:bg-white/15 p-2 overflow-hidden transition-colors duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt={c.name} className="max-w-full max-h-full object-contain" loading="lazy" />
                </div>
                <span className="text-sm font-semibold text-blue-100/80 group-hover:text-white leading-snug transition-colors duration-300">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA Banner
         ═══════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Sẵn sàng đồng hành cùng <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">AQTech</span>?
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-8">
            Liên hệ với chúng tôi để được tư vấn giải pháp phù hợp nhất cho cơ sở giáo dục của bạn
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5"
          >
            Liên hệ ngay
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </a>
        </div>
      </section>

    </main>
  );
}
