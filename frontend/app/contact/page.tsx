'use client';

import { useState, useRef, FormEvent } from 'react';

/* ── Dot-grid background (shared pattern from homepage/about) ── */
function DotGrid({ id = 'contactDots' }: { id?: string }) {
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

/* ── Contact info data ── */
const contactInfo = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5M3.75 3v18m16.5-18v18M5.25 6h.008M5.25 9h.008M5.25 12h.008M9.75 6h.008M9.75 9h.008M9.75 12h.008M14.25 6h.008M14.25 9h.008M14.25 12h.008M18.75 6h.008M18.75 9h.008M18.75 12h.008" />
      </svg>
    ),
    label: 'Trụ sở chính',
    value: '139/35 Dương Văn Dương, P. Phú Thọ Hoà, TP. Hồ Chí Minh',
    gradient: 'from-blue-500 to-cyan-400',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
      </svg>
    ),
    label: 'Văn phòng chi nhánh',
    value: '8/24 Nguyễn Đình Khơi, Phường Tân Sơn Nhất, TP. Hồ Chí Minh',
    gradient: 'from-emerald-500 to-teal-400',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
    label: 'Hotline',
    value: '(+84.28) 62 815 825 — (+84.28) 62 815 819',
    gradient: 'from-violet-500 to-purple-400',
    bg: 'bg-violet-50',
    text: 'text-violet-600',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
    label: 'Email',
    value: 'contact@aqtech.vn',
    gradient: 'from-amber-500 to-orange-400',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
  },
];

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');

    const fd = new FormData(e.currentTarget);
    const name = (fd.get('name') as string).trim();
    const phone = (fd.get('phone') as string).trim();
    const email = (fd.get('email') as string).trim();
    const company = (fd.get('company') as string).trim();
    const content = (fd.get('content') as string).trim();

    if (!name || !phone || !email || !content) {
      setStatus('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      return;
    }

    const phoneRegex = /^(\+84|84|0)[1-9][0-9]{8,9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      setStatus('error');
      return;
    }

    // Simulate successful submission (replace with real API call)
    await new Promise((r) => setTimeout(r, 1200));
    setStatus('success');
    formRef.current?.reset();
    setTimeout(() => setStatus('idle'), 5000);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ══════════════════════════════════════════════════
          HERO — dark tech banner
         ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a2a5e] py-24 md:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400 rounded-full blur-[140px]" />
        </div>
        <DotGrid />

        <div className="page-hero-inner relative z-10">
          <div className="page-hero-badge">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="page-hero-badge-text">Liên hệ</span>
          </div>
          <h1 className="page-hero-title">
            Liên hệ với{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Chúng tôi
            </span>
          </h1>
          <p className="page-hero-desc">
            Chúng tôi sẵn sàng hỗ trợ và trả lời bất kỳ câu hỏi nào của bạn. Hãy để lại thông tin, chúng tôi sẽ liên hệ sớm nhất!
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CONTACT INFO CARDS
         ══════════════════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {contactInfo.map((item) => (
            <div
              key={item.label}
              className="group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
              <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.text} flex items-center justify-center mb-4`}>
                {item.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{item.label}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FORM + MAP — two-column
         ══════════════════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Gửi tin nhắn cho chúng tôi
          </h2>
          <div className="mt-4 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Điền thông tin bên dưới, đội ngũ AQTech sẽ phản hồi trong thời gian sớm nhất
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Contact Form ── */}
          <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
            <div className="p-8 md:p-10">
              {/* Status messages */}
              {status === 'success' && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm text-center animate-[slideIn_0.4s_ease]">
                  ✅ Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.
                </div>
              )}
              {status === 'error' && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center animate-[slideIn_0.4s_ease]">
                  ❌ Vui lòng kiểm tra lại thông tin và thử lại.
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contactName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Họ và tên <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      name="name"
                      required
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="contactPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Điện thoại <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      id="contactPhone"
                      name="phone"
                      required
                      placeholder="0901 234 567"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="email"
                      required
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="contactCompany" className="block text-sm font-semibold text-gray-700 mb-2">
                      Doanh nghiệp
                    </label>
                    <input
                      type="text"
                      id="contactCompany"
                      name="company"
                      placeholder="Tên doanh nghiệp"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contactContent" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nội dung tin nhắn <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="contactContent"
                    name="content"
                    required
                    rows={5}
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-vertical"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg text-sm tracking-wide uppercase"
                >
                  {status === 'sending' ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Đang gửi...
                    </span>
                  ) : (
                    'Gửi tin nhắn'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── Map ── */}
          <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
            <iframe
              title="AQTech Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.609!2d106.663!3d10.8132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529292e8d3dd1%3A0x3411d851b29b42e!2s8%2F24%20Nguy%E1%BB%85n%20%C4%90%C3%ACnh%20Kh%C6%A1i%2C%20Ph%C6%B0%E1%BB%9Dng%204%2C%20T%C3%A2n%20B%C3%ACnh%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vi%E1%BB%87t%20Nam!5e0!3m2!1svi!2s!4v1699999999999!5m2!1svi!2s"
              className="w-full h-full min-h-[500px] border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Location overlay */}
            <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md rounded-xl p-5 shadow-lg border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Địa chỉ của chúng tôi</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    8/24 Nguyễn Đình Khơi, Phường Tân Sơn Nhất, TP. Hồ Chí Minh
                  </p>
                  <a
                    href="https://maps.app.goo.gl/3fZ2dydCpzfQLJXR9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Xem trên Google Maps
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          BRANCH OFFICE — additional info
         ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a2a5e] py-20 md:py-28">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-10 right-20 w-64 h-64 bg-cyan-400 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-20 w-72 h-72 bg-blue-500 rounded-full blur-[120px]" />
        </div>
        <DotGrid id="branchDots" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Hệ thống văn phòng
            </h2>
            <div className="mt-4 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400" />
            <p className="mt-4 text-blue-200/60 max-w-xl mx-auto">
              Mạng lưới văn phòng phủ rộng từ Nam ra Bắc, luôn sẵn sàng hỗ trợ bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* HCM HQ */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl" />
              <div className="w-12 h-12 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center mb-5">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5M3.75 3v18m16.5-18v18M5.25 6h.008M5.25 9h.008M5.25 12h.008M9.75 6h.008M9.75 9h.008M9.75 12h.008M14.25 6h.008M14.25 9h.008M14.25 12h.008M18.75 6h.008M18.75 9h.008M18.75 12h.008" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Trụ sở chính</h3>
              <p className="text-sm text-blue-200/60 leading-relaxed">
                139/35 Dương Văn Dương, P. Phú Thọ Hoà, TP. Hồ Chí Minh
              </p>
            </div>

            {/* HCM Branch */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl" />
              <div className="w-12 h-12 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center mb-5">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Chi nhánh HCM</h3>
              <p className="text-sm text-blue-200/60 leading-relaxed">
                8/24 Nguyễn Đình Khơi, Phường Tân Sơn Nhất, TP. Hồ Chí Minh
              </p>
            </div>

            {/* Hanoi Branch */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 to-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl" />
              <div className="w-12 h-12 rounded-xl bg-violet-400/10 text-violet-400 flex items-center justify-center mb-5">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Chi nhánh Hà Nội</h3>
              <p className="text-sm text-blue-200/60 leading-relaxed">
                Lô 501, Tầng 5, Tòa nhà The Golden Palm, Số 21 Lê Văn Lương, P. Thanh Xuân, TP. Hà Nội
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
