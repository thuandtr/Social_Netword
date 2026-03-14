'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';

type HeaderProps = {
  user?: {
    username: string;
    role?: string;
  } | null;
};

type SubItem = { href: string; label: string; desc?: string; icon?: React.ReactNode };

type NavItem = {
  href: string;
  label: string;
  children?: SubItem[];
};

/* ── Icons for dropdown items ───────────────────────────── */

const IconHistory = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconVision = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconTeam = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);
const IconPartner = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.06a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.94 8.827" />
  </svg>
);
const IconEA = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
  </svg>
);
const IconSoftware = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
  </svg>
);
const IconQuality = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
  </svg>
);
const IconPortal = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
  </svg>
);
const IconSchool = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
  </svg>
);
const IconNews = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
  </svg>
);
const IconEvent = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
  </svg>
);
const IconClients = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);
const IconTestimonial = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);

/* ── Nav data ────────────────────────────────────────────── */

const navLinks: NavItem[] = [
  { href: '/', label: 'Trang Chủ' },
  {
    href: '/about',
    label: 'Giới thiệu',
    children: [
      { href: '/about#lichsuphattrien', label: 'Lịch sử & Phát triển', desc: 'Hành trình 30+ năm đổi mới', icon: <IconHistory /> },
      { href: '/about#tamnhinsumenh', label: 'Tầm nhìn & Sứ mệnh', desc: 'Định hướng phát triển bền vững', icon: <IconVision /> },
      { href: '/about#doinguaq', label: 'Đội ngũ AQTech', desc: 'Chuyên gia công nghệ giáo dục', icon: <IconTeam /> },
      { href: '/about#doitac', label: 'Đối tác Chiến lược', desc: 'Mạng lưới hợp tác rộng khắp', icon: <IconPartner /> },
      { href: '/about/ea', label: 'Kiến trúc Doanh nghiệp (EA)', desc: 'Nền tảng quản trị tổng thể', icon: <IconEA /> },
    ],
  },
  {
    href: '/products',
    label: 'Sản Phẩm',
    children: [
      { href: '/products#nghiepvuquanly', label: 'Nhóm phần mềm nghiệp vụ quản lý', desc: 'Đào tạo, nhân sự, tài chính, khảo thí', icon: <IconSoftware /> },
      { href: '/products#quantrihotrokiemdinh', label: 'Nhóm giải pháp quản trị và hỗ trợ kiểm định', desc: 'Đánh giá chuẩn đầu ra, minh chứng', icon: <IconQuality /> },
      { href: '/products#congthongtinphanmemdidong', label: 'Nhóm Cổng thông tin và phần mềm di động', desc: 'Tuyển sinh, ứng dụng di động', icon: <IconPortal /> },
      { href: '/products#phongthongmamnon', label: 'Nhóm quản lý trường phổ thông & mầm non', desc: 'Học vụ, học phí, công nợ', icon: <IconSchool /> },
    ],
  },
  {
    href: '/news-events',
    label: 'Tin Tức và Sự Kiện',
    children: [
      { href: '/news-events#thongtinchuyennganh', label: 'Thông Tin Chuyên Ngành', desc: 'Cập nhật xu hướng giáo dục số', icon: <IconNews /> },
      { href: '/news-events#sukientuaqtech', label: 'Sự kiện từ AQTech', desc: 'Hội thảo, triển lãm, đào tạo', icon: <IconEvent /> },
    ],
  },
  {
    href: '/clients',
    label: 'Khách Hàng',
    children: [
      { href: '/clients', label: 'Danh Sách Khách Hàng', desc: '330+ cơ sở giáo dục tin dùng', icon: <IconClients /> },
      { href: '/clients/testimonials', label: 'Ý Kiến Khách Hàng', desc: 'Phản hồi từ đối tác', icon: <IconTestimonial /> },
    ],
  },
  { href: '/contact', label: 'Liên Hệ' },
];

/* ── Desktop nav item with mega-style dropdown ───────────── */

function DesktopNavItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const enter = useCallback(() => {
    clearTimeout(timeout.current);
    setOpen(true);
  }, []);

  const leave = useCallback(() => {
    timeout.current = setTimeout(() => setOpen(false), 150);
  }, []);

  useEffect(() => () => clearTimeout(timeout.current), []);

  if (!item.children) {
    return (
      <Link
        href={item.href}
        className={`relative text-[13px] font-semibold uppercase tracking-wide transition-colors whitespace-nowrap py-1
          ${isActive
            ? 'text-blue-600'
            : 'text-gray-700 hover:text-blue-600'
          }
          after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-gradient-to-r after:from-blue-500 after:to-cyan-400 after:transition-all after:duration-300
          ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
        `}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <Link
        href={item.href}
        className={`relative text-[13px] font-semibold uppercase tracking-wide transition-colors whitespace-nowrap py-1 inline-flex items-center gap-1
          ${isActive
            ? 'text-blue-600'
            : 'text-gray-700 hover:text-blue-600'
          }
          after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-gradient-to-r after:from-blue-500 after:to-cyan-400 after:transition-all after:duration-300
          ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
        `}
      >
        {item.label}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </Link>

      {/* Dropdown panel */}
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 transition-all duration-200 ${
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="relative w-80 rounded-xl bg-white/95 backdrop-blur-xl border border-gray-200/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden">
          {/* Top accent gradient */}
          <div className="h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600" />

          <div className="p-2">
            {item.children.map((child, idx) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setOpen(false)}
                className={`group flex items-start gap-3 px-3 py-3 rounded-lg transition-all duration-150 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50/50 ${
                  idx > 0 ? '' : ''
                }`}
              >
                <span className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100/60 flex items-center justify-center text-blue-500 group-hover:text-blue-600 group-hover:border-blue-200 group-hover:shadow-sm transition-all">
                  {child.icon}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors leading-tight">
                    {child.label}
                  </div>
                  {child.desc && (
                    <div className="text-xs text-gray-400 group-hover:text-gray-500 mt-0.5 leading-snug transition-colors">
                      {child.desc}
                    </div>
                  )}
                </div>
                <svg
                  className="mt-1 ml-auto w-4 h-4 text-gray-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="border-t border-gray-100 bg-gray-50/80 px-4 py-2.5">
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Xem tất cả {item.label.toLowerCase()}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Header ─────────────────────────────────────────── */

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/signup') ||
    pathname?.startsWith('/admin')
  ) {
    return null;
  }

  const isActive = (item: NavItem) =>
    pathname === item.href || pathname?.startsWith(item.href + '/') || pathname?.startsWith(item.href + '#');

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100'
          : 'bg-white border-b border-gray-200'
      }`}
    >
      <nav className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 group">
            <img
              src="https://aqtech.edu.vn/wp-content/uploads/2025/08/cropped-cropped-Group-877-3-250x67.png"
              alt="AQTech"
              width={180}
              height={48}
              className="object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => (
              <DesktopNavItem key={item.href} item={item} isActive={isActive(item)} />
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Main Menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block h-0.5 bg-current rounded-full transition-all duration-200 ${mobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Nav */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[calc(100vh-72px)] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t border-gray-100 py-3 pb-6">
            {navLinks.map((item) => (
              <div key={item.href}>
                {item.children ? (
                  <>
                    <button
                      type="button"
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-colors rounded-lg ${
                        isActive(item) ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                      onClick={() =>
                        setMobileExpanded(mobileExpanded === item.href ? null : item.href)
                      }
                    >
                      {item.label}
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          mobileExpanded === item.href ? 'rotate-180' : ''
                        }`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        mobileExpanded === item.href ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="ml-4 pl-4 border-l-2 border-blue-100 mb-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50/50"
                          >
                            <span className="w-7 h-7 rounded-md bg-blue-50 border border-blue-100/60 flex items-center justify-center text-blue-500 flex-shrink-0">
                              {child.icon}
                            </span>
                            <span>{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 text-sm font-semibold transition-colors rounded-lg ${
                      isActive(item) ? 'text-blue-600 bg-blue-50/50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
