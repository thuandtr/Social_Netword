export const metadata = {
  title: 'Sản phẩm — AQTech',
  description: 'Danh sách sản phẩm và giải pháp của AQTech.',
};

/* ── Shared dot-grid background (matches homepage / about) ─────── */
function DotGrid({ id = 'productDots' }: { id?: string }) {
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

/* ─── Data ─────────────────────────────────────────────────────────────── */

const group1Products = [
  { title: 'Phần mềm hệ thống quản lý đào tạo EdusoftNet', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-25_17@2x-1.png', href: 'https://aqtech.edu.vn/product/phan-mem-he-thong-quan-ly-dao-tao-edusoft-net/' },
  { title: 'Hệ thống quản trị trung tâm - AQ CoreFramework', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-9@2x.png', href: 'https://aqtech.edu.vn/product/he-thong-quan-tri-trung-tam-aq-coreframework/' },
  { title: 'Phần mềm quản lý đào tạo - AQ EduAcademy', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-9_1@2x.png', href: 'https://aqtech.edu.vn/product/phan-mem-quan-ly-dao-tao-aq-eduacademy/' },
  { title: 'Phần mềm quản lý sinh viên - AQ EduStudent', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-9_2@2x.png', href: 'https://aqtech.edu.vn/product/phan-mem-quan-ly-sinh-vien-aq-edustudent/' },
  { title: 'Phần mềm quản lý nhân sự cơ sở giáo dục - AQ EduHRM', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-9_3@2x.png', href: 'https://aqtech.edu.vn/product/phan-mem-quan-ly-nhan-su-co-so-giao-duc-aq-eduhrm/' },
  { title: 'Phần mềm quản lý khảo thí - AQ EduExam', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-9_4@2x.png', href: 'https://aqtech.edu.vn/product/phan-mem-quan-ly-khao-thi-aq-eduexam/' },
  { title: 'Phần mềm quản lý thu/chi học phí sinh viên – AQ EduTuition', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-9_5@2x.png', href: 'https://aqtech.edu.vn/product/phan-mem-quan-ly-thu-chi-hoc-phi-sinh-vien-aq-edutuition/' },
  { title: 'Phần mềm quản lý sinh viên học ngành 2 – AQ EduMajor2', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-9_6@2x.png', href: 'https://aqtech.edu.vn/product/phan-mem-quan-ly-sinh-vien-hoc-nganh-2-aq-edumajor2/' },
  { title: 'Phần mềm quản lý đào tạo các lớp ngắn hạn – AQ EduSTM', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-9_7@2x.png', href: 'https://aqtech.edu.vn/product/phan-mem-quan-ly-dao-tao-cac-lop-ngan-han-aq-edushort-termtraining/' },
  { title: 'Phần mềm quản lý lưu học sinh – AQ EduForeignStudents', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-9_8@2x.png', href: 'https://aqtech.edu.vn/product/phan-mem-quan-ly-luu-hoc-sinh-aq-eduforeignstudents/' },
  { title: 'Phần mềm quản lý nghiên cứu khoa học – AQ EduSRM', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-9_9@2x-1.png', href: 'https://aqtech.edu.vn/product/phan-mem-quan-ly-nghien-cuu-khoa-hoc-aq-edusrm/' },
  { title: 'Phần mềm quản lý tài sản – thiết bị – vật tư – AQ EduAMS', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-9_10@2x-1.png', href: 'https://aqtech.edu.vn/product/phan-mem-quan-ly-tai-san-thiet-bi-vat-tu-aq-eduasm/' },
  { title: 'Phần mềm tích hợp hóa đơn điện tử – AQ EduE_Invoice', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-9_11@2x-1.png', href: 'https://aqtech.edu.vn/product/phan-mem-tich-hop-hoa-don-dien-tu-aq-edue_invoice/' },
  { title: 'Phần mềm quản lý ký túc xá – AQ EduDormitory', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-9_12@2x-1.png', href: 'https://aqtech.edu.vn/product/phan-mem-quan-ly-ky-tuc-xa-aq-edudormitory/' },
  { title: 'Phần mềm quản lý & thanh toán lương – AQ EduPayroll', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-9_13@2x-1.png', href: 'https://aqtech.edu.vn/product/phan-mem-quan-ly-thanh-toan-luong-aq-edupayroll/' },
  { title: 'Phần mềm quản lý và phê duyệt công văn trực tuyến - AQ EduDocumentary', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-9_14@2x-1.png', href: 'https://aqtech.edu.vn/product/phan-mem-quan-ly-va-phe-duyet-cong-van-truc-tuyen-aq-edudocumentary/' },
  { title: 'Phần mềm quản lý thư viện - AQ EduLib', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-9_15@2x-1.png', href: 'https://aqtech.edu.vn/product/phan-mem-quan-ly-thu-vien-aq-edulib/' },
  { title: 'Phần mềm quản lý công việc - AQ EduTaskFlow', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-25@2x.png', href: 'https://aqtech.edu.vn/product/phan-mem-quan-ly-cong-viec-aq-edutaskflow/' },
  { title: 'Giải pháp Smart Campus - AQ EduSmartCampus', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-25_1@2x.png', href: 'https://aqtech.edu.vn/product/giai-phap-smart-campus-aq-edusmartcampus/' },
];

const group2Products = [
  { title: 'Phần mềm đo lường và đánh giá chuẩn đầu ra chương trình đào tạo - AQ EduLOM', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-25_2@2x.png', href: 'https://aqtech.edu.vn/aq-edulom/' },
  { title: 'Phần mềm quản lý ngân hàng đề thi và khảo thí trực tuyến - AQ EduEVA', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-25_3@2x.png', href: '#' },
  { title: 'Phần mềm khảo sát đánh giá - AQ EduSVN', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-25_4@2x.png', href: '#' },
  { title: 'Phần mềm quản lý đo lường và đánh giá tiêu chuẩn cơ sở giáo dục - AQ EduQME', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-25_5@2x.png', href: '#' },
  { title: 'Phần mềm quản lý minh chứng kiểm định – AQ EduEAQ', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-25_6@2x.png', href: '#' },
  { title: 'Phần mềm quản lý chiến lược – AQ EduStrategy', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-25_7@2x.png', href: 'https://aqtech.edu.vn/product/phan-mem-quan-ly-chien-luoc-okrs-kpi-aq-edustrategy/' },
];

const group3Products = [
  { title: 'Cổng thông tin đào tạo - AQ EduPortal', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-25_8@2x.png', href: 'https://aqtech.edu.vn/product/cong-thong-tin-dao-tao-aq-eduportal/' },
  { title: 'Cổng thông tin trực tuyến quản lý hoạt động ngoại khóa & điểm rèn luyện - AQ EduSAE', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-25_9@2x.png', href: 'https://aqtech.edu.vn/product/phan-mem-truc-tuyen-quan-ly-hoat-dong-ngoai-khoa-va-diem-ren-luyen-aq-edustudentactivity/' },
  { title: 'Phần mềm tuyển sinh trực tuyến - AQ EduAdmission', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-25_10@2x.png', href: 'https://aqtech.edu.vn/product/phan-mem-tuyen-sinh-truc-tuyen-aq-eduadmissions/' },
  { title: 'Phần mềm quản lý thông tin trên thiết bị di động - AQ EduGO', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-25_11@2x.png', href: 'https://aqtech.edu.vn/product/phan-mem-quan-ly-thong-tin-tren-thiet-bi-di-dong-aq-edugo/' },
  { title: 'Cổng thanh toán hóa đơn trực tuyến – AQ EduBill', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-25_12@2x.png', href: 'https://aqtech.edu.vn/product/cong-thanh-toan-hoa-don-truc-tuyen-aq-edubill/' },
  { title: 'Cổng thông tin đào tạo trực tuyến – AQ EduLMS', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-25_13@2x.png', href: 'https://aqtech.edu.vn/product/giai-phap-dao-tao-truc-tuyen-aq-edulms/' },
  { title: 'Phần mềm trực tuyến thống kê cho lãnh đạo – AQ EduDashboard', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-25_14@2x.png', href: 'https://aqtech.edu.vn/product/phan-mem-truc-tuyen-thong-ke-cho-lanh-dao-aq-edudashboard/' },
];

const group4Products = [
  { title: 'Phần mềm quản lý trường phổ thông - AQ EduSchool', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-25_15@2x.png', href: 'https://aqtech.edu.vn/product/phan-mem-quan-ly-truong-pho-thong-aq-eduschool/' },
  { title: 'Phần mềm quản lý trường mầm non - AQ EduKids', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-41@2x.png', href: 'https://aqtech.edu.vn/product/phan-mem-quan-ly-truong-mam-non-aq-edukids/' },
  { title: 'Phần mềm quản lý công nợ và thu học phí - AQ EduPay', img: 'https://aqtech.edu.vn/wp-content/uploads/2025/08/Artboard-25_16@2x.png', href: 'https://aqtech.edu.vn/product/phan-mem-quan-ly-cong-no-va-thu-hoc-phi-aq-edupay/' },
];

/* ─── Components ─────────────────────────────────────────────────────────── */

type Product = { title: string; img: string; href: string };

type GroupConfig = {
  id: string;
  title: string;
  accentColor: string;
  cardTopBar: string;
  iconBg: string;
  description: string;
  products: Product[];
};

const groups: GroupConfig[] = [
  {
    id: 'nghiepvuquanly',
    title: 'Nhóm phần mềm nghiệp vụ quản lý trường đại học | cao đẳng | học viện',
    accentColor: 'from-[#8b0000] to-[#FF4360]',
    cardTopBar: 'linear-gradient(90deg,#8b0000 0%,#FF4360 100%)',
    iconBg: 'linear-gradient(90deg,#8b0000 0%,#FF4360 100%)',
    description: 'Bộ giải pháp toàn diện hỗ trợ quản lý đào tạo, sinh viên, nhân sự, khảo thí, tài sản, tài chính và các hoạt động vận hành trường học.',
    products: group1Products,
  },
  {
    id: 'quantrihotrokiemdinh',
    title: 'Nhóm giải pháp quản trị và hỗ trợ kiểm định chất lượng cơ sở giáo dục',
    accentColor: 'from-[#FF7B01] to-[#FF9A33]',
    cardTopBar: 'linear-gradient(90deg,#FF7B01 0%,#FF9A33 100%)',
    iconBg: 'linear-gradient(90deg,#FF7B01 0%,#FF9A33 100%)',
    description: 'Hệ thống hỗ trợ đánh giá chuẩn đầu ra, khảo sát, đo lường tiêu chuẩn, minh chứng kiểm định và chiến lược phát triển.',
    products: group2Products,
  },
  {
    id: 'congthongtinphanmemdidong',
    title: 'Nhóm Cổng thông tin và phần mềm di động dành cho sinh viên & giảng viên',
    accentColor: 'from-[#01C251] to-[#33D470]',
    cardTopBar: 'linear-gradient(90deg,#01C251 0%,#33D470 100%)',
    iconBg: 'linear-gradient(90deg,#01C251 0%,#33D470 100%)',
    description: 'Cổng thông tin và ứng dụng di động hỗ trợ tuyển sinh, đào tạo, thanh toán, điều hành và quản lý thông tin.',
    products: group3Products,
  },
  {
    id: 'phongthongmamnon',
    title: 'Nhóm phần mềm quản lý trường phổ thông & mầm non',
    accentColor: 'from-[#332FFF] to-[#38D4FF]',
    cardTopBar: 'linear-gradient(90deg,#332FFF 0%,#38D4FF 100%)',
    iconBg: 'linear-gradient(90deg,#332FFF 0%,#38D4FF 100%)',
    description: 'Giải pháp quản lý toàn diện cho các trường phổ thông và mầm non, bao gồm quản lý học vụ, thu học phí và công nợ.',
    products: group4Products,
  },
];

function ProductCard({ product, cardTopBar }: { product: Product; cardTopBar: string }) {
  const Tag = product.href && product.href !== '#' ? 'a' : 'div';
  const props =
    Tag === 'a'
      ? { href: product.href, target: '_blank', rel: 'noopener noreferrer' }
      : {};

  return (
    // @ts-expect-error dynamic tag
    <Tag
      {...props}
      className="group/card relative flex flex-col items-center bg-white rounded-2xl p-7 shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl overflow-hidden cursor-pointer"
    >
      <span
        className="absolute inset-x-0 top-0 h-1 scale-x-0 group-hover/card:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl"
        style={{ background: cardTopBar }}
      />
      <img
        src={product.img}
        alt={product.title}
        width={191}
        height={224}
        loading="lazy"
        className="w-32 h-auto object-contain mb-5"
      />
      <p className="text-[15px] font-semibold text-gray-900 text-center leading-snug">
        {product.title}
      </p>
    </Tag>
  );
}

function ProductSection({ group }: { group: GroupConfig }) {
  return (
    <section id={group.id} className="bg-gray-50 py-20 md:py-24 scroll-mt-24">
      <div className="max-w-[1720px] mx-auto px-6">
        {/* Section heading — homepage style */}
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            {group.title}
          </h2>
          <div
            className="mt-4 mx-auto w-20 h-1 rounded-full"
            style={{ background: group.cardTopBar }}
          />
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            {group.description}
          </p>
        </div>

        <div className="max-w-[1400px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {group.products.map((p) => (
            <ProductCard key={p.title} product={p} cardTopBar={group.cardTopBar} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* ══════════════════════════════════════════════════
          HERO — dark tech banner (matches About / Home "Why AQTech")
         ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a2a5e] py-24 md:py-32">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-[160px]" />
        </div>
        <DotGrid id="heroDots" />

        <div className="page-hero-inner relative z-10">
          <div className="page-hero-badge">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="page-hero-badge-text">Hệ sinh thái AQ EduSmart</span>
          </div>
          <h1 className="page-hero-title">
            Sản Phẩm{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              AQTech
            </span>
          </h1>
          <p className="page-hero-desc">
            Hơn 30 phần mềm và giải pháp toàn diện — hỗ trợ quản lý đào tạo, tuyển sinh, khảo sát,
            chấm thi tự động, quản lý học liệu và đánh giá chất lượng giáo dục cho Đại học,
            Cao đẳng, Học viện và Trung học chuyên nghiệp.
          </p>

          {/* Quick-nav pills */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {groups.map((g) => {
              const colors = g.cardTopBar.match(/#[0-9a-fA-F]+/g) ?? ['#333', '#999'];
              return (
                <a
                  key={g.id}
                  href={`#${g.id}`}
                  className="inline-flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] hover:border-white/25 backdrop-blur-sm rounded-full px-5 py-2.5 text-sm text-white/80 hover:text-white font-medium transition-all duration-300"
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[1] }} />
                  {g.title.length > 40 ? g.title.substring(0, 40) + '…' : g.title}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          STATS BAR — matching Home / About
         ══════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
              <div className="text-4xl font-extrabold mb-1">30+</div>
              <div className="text-sm text-blue-100">Phần mềm &amp; giải pháp trong hệ sinh thái</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-8 text-center text-white">
              <div className="text-4xl font-extrabold mb-1">4</div>
              <div className="text-sm text-cyan-100">Nhóm sản phẩm chuyên biệt</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-8 text-center text-white">
              <div className="text-4xl font-extrabold mb-1">130+</div>
              <div className="text-sm text-indigo-100">Trường Đại học, Cao đẳng, Học viện</div>
            </div>
            <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-8 text-center text-white">
              <div className="text-4xl font-extrabold mb-1">30</div>
              <div className="text-sm text-violet-100">Năm kinh nghiệm trong lĩnh vực EdTech</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          GIỚI THIỆU CHUNG — light section with accent card
         ══════════════════════════════════════════════════ */}
      <section className="bg-gray-50 pb-20">
        <div className="max-w-[1720px] mx-auto px-6">
          {/* Section heading — homepage style */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Giới Thiệu Chung Về Sản Phẩm
            </h2>
            <div className="mt-4 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">
              Hệ sinh thái AQ EduSmart — giải pháp chuyển đổi số toàn diện cho giáo dục
            </p>
          </div>

          <div className="max-w-[1400px] mx-auto">
            <div className="group relative bg-white rounded-2xl border border-gray-100 p-8 md:p-10 shadow-sm overflow-hidden mb-10">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
              <div className="space-y-6">
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Nhu cầu chuyển đổi số trong các cơ sở giáo dục ở Việt Nam và trên thế giới ngày càng
                  cao, AQ Tech với bề dày kinh nghiệm gần 30 năm đồng hành và cung cấp các giải pháp
                  quản lý đào tạo cho các cơ sở giáo dục ở Việt Nam đã ý thức được sứ mệnh của mình là
                  không ngừng cải tiến và nâng cao năng lực của mình trở thành nhà cung cấp giải pháp
                  chuyển đổi số toàn diện cho các cơ sở giáo dục trong và ngoài nước.
                </p>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Hiện tại chúng tôi đã hoàn thiện hệ sinh thái AQ EduSmart với hơn 30 phần mềm và giải
                  pháp Quản trị dành cho các trường Đại học – Cao Đẳng – Học viện – Trung học chuyên
                  nghiệp. Ngoài ra các giải pháp hỗ trợ công tác quản lý dành cho các trường Mầm Non và
                  Phổ thông cơ sở cũng đã được đưa ra thị trường trong thời gian gần đây.
                </p>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Hệ sinh thái AQ EduSmart của chúng tôi luôn tuân thủ triết lý chất lượng trong giáo
                  dục và hỗ trợ tối đa cho các trường trong việc đảm bảo chất lượng đào tạo và đáp ứng
                  chuẩn đầu ra của mình theo mô hình quản trị sau:
                </p>
              </div>
            </div>

            {/* Architecture diagrams in styled cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <figure className="flex flex-col items-center gap-3">
                  <img
                    src="https://aqtech.edu.vn/wp-content/uploads/2025/07/Group-1000004047-1.png"
                    alt="Mô hình đảm bảo và kiểm định chất lượng giáo dục AQ EduSmart"
                    className="w-full rounded-xl"
                    loading="lazy"
                  />
                  <figcaption className="text-sm text-gray-500 italic text-center">
                    Mô hình đảm bảo và kiểm định chất lượng giáo dục
                  </figcaption>
                </figure>
              </div>
              <div className="group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <figure className="flex flex-col items-center gap-3">
                  <img
                    src="https://aqtech.edu.vn/wp-content/uploads/2025/07/Group-1000004071.png"
                    alt="Sơ đồ kiến trúc tổng thể hệ thống phần mềm"
                    className="w-full rounded-xl"
                    loading="lazy"
                  />
                  <figcaption className="text-sm text-gray-500 italic text-center">
                    Sơ đồ kiến trúc tổng thể hệ thống phần mềm
                  </figcaption>
                </figure>
              </div>
            </div>

            <p className="mt-8 text-base text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
              Kiến trúc phần mềm của hệ sinh thái được tổ chức theo mô hình phân lớp và có tính mở
              cao, cho phép hệ sinh thái AQ EduSmart có thể dễ dàng tích hợp với cơ sở dữ liệu có
              sẵn của trường và của các phần mềm của bên thứ 3.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PRODUCT GROUP SECTIONS — alternating light / dark
         ══════════════════════════════════════════════════ */}
      {groups.map((g) => (
        <ProductSection key={g.id} group={g} />
      ))}

      {/* ══════════════════════════════════════════════════
          CTA — dark tech section (matches About partner section)
         ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a2a5e] py-20 md:py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-400 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500 rounded-full blur-[140px]" />
        </div>
        <DotGrid id="ctaDots" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-300 text-sm font-medium tracking-wide">Bắt đầu ngay</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
            Sẵn sàng{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              chuyển đổi số
            </span>
            ?
          </h2>
          <p className="text-blue-200/70 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Liên hệ với chúng tôi để được tư vấn giải pháp phù hợp nhất cho cơ sở giáo dục của bạn.
            Đội ngũ chuyên gia AQTech luôn sẵn sàng hỗ trợ.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300"
            >
              Liên Hệ Tư Vấn
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] hover:border-white/25 text-white font-semibold text-sm backdrop-blur-sm transition-all duration-300"
            >
              Tìm Hiểu Thêm
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
