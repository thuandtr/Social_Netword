import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white">
      {/* Main Footer Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info & Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Công ty TNHH Công nghệ Anh Quân - AQtech
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/" className="hover:text-white transition-colors">Trang chủ</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Giới thiệu</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Sản phẩm</Link></li>
              <li><Link href="/news-events" className="hover:text-white transition-colors">Tin tức</Link></li>
              <li><Link href="/clients" className="hover:text-white transition-colors">Khách hàng</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Products & Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sản phẩm & Dịch vụ</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><span className="hover:text-white transition-colors">Lịch sử phát triển</span></li>
              <li><span className="hover:text-white transition-colors">Tầm nhìn &amp; Sứ mệnh</span></li>
              <li><span className="hover:text-white transition-colors">Phần mềm Quản lý tổng thể Edusoft.Net</span></li>
              <li><span className="hover:text-white transition-colors">Giải Pháp Quản trị &amp; Hỗ trợ Kiểm định</span></li>
              <li><span className="hover:text-white transition-colors">Cổng Thông tin &amp; Phần mềm Di động</span></li>
              <li><span className="hover:text-white transition-colors">Quản lý Trường Phổ thông &amp; Mầm non</span></li>
            </ul>
          </div>

          {/* Addresses */}
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 26 26" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M7.8753 0.219132C8.24052 -0.073044 8.75948 -0.073044 9.1247 0.219132L16.6247 6.21914C16.8619 6.4089 17 6.69622 17 7V25C17 25.5522 16.5523 26 16 26H10V22C10 21.1716 9.32842 20.5 8.5 20.5C7.67158 20.5 7 21.1716 7 22V26H1C0.447716 26 0 25.5522 0 25V7C0 6.69622 0.13809 6.4089 0.375304 6.21914L7.8753 0.219132ZM20.5 11C19.9478 11 19.5 11.4477 19.5 12V25C19.5 25.5522 19.9478 26 20.5 26H25C25.5522 26 26 25.5522 26 25V12C26 11.4477 25.5522 11 25 11H20.5ZM4.25 16C4.25 15.3096 4.80964 14.75 5.5 14.75H11.5C12.1904 14.75 12.75 15.3096 12.75 16C12.75 16.6904 12.1904 17.25 11.5 17.25H5.5C4.80964 17.25 4.25 16.6904 4.25 16ZM5.5 8.75C4.80964 8.75 4.25 9.30964 4.25 10C4.25 10.6904 4.80964 11.25 5.5 11.25H11.5C12.1904 11.25 12.75 10.6904 12.75 10C12.75 9.30964 12.1904 8.75 11.5 8.75H5.5Z" fill="white"/>
                </svg>
                Trụ sở chính
              </h3>
              <p className="text-sm text-gray-300 flex items-start gap-2">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></span>
                139/35 Dương Văn Dương, P. Phú Thọ Hoà, TP. Hồ Chí Minh
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 26 26" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12.3243 0.262846C12.7066 -0.0876155 13.2934 -0.0876155 13.6757 0.262846L25.0272 10.6683C25.647 11.2366 26 12.0389 26 12.8798V23C26 24.6568 24.6568 26 23 26H3C1.34314 26 0 24.6568 0 23V12.8798C0 12.0389 0.35294 11.2366 0.972826 10.6683L12.3243 0.262846ZM8.9917 12.2437V11.0481C8.9917 9.66738 10.111 8.5481 11.4917 8.5481H14.5117C15.8924 8.5481 17.0117 9.66738 17.0117 11.0481V12.2446C18.4022 12.5059 19.4542 13.7265 19.4542 15.1929V19.1038C19.4542 20.7608 18.1111 22.1038 16.4542 22.1038H9.54444C7.88758 22.1038 6.54444 20.7608 6.54444 19.1038V15.1929C6.54444 13.7248 7.59888 12.5031 8.9917 12.2437ZM15.0117 12.1929H10.9917V11.0481C10.9917 10.772 11.2156 10.5481 11.4917 10.5481H14.5117C14.7878 10.5481 15.0117 10.772 15.0117 11.0481V12.1929Z" fill="white"/>
                </svg>
                Văn phòng chi nhánh
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></span>
                  8/24 Nguyễn Đình Khơi, Phường Tân Sơn Nhất, TP. Hồ Chí Minh
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></span>
                  Lô 501, Tầng 5, Tòa nhà The Golden Palm, Số 21 Lê Văn Lương, P. Thanh Xuân, TP. Hà Nội
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 26 26" fill="none">
                  <path d="M9.49564 24.9817C8.26655 25.7758 6.80193 26.122 5.34805 25.9617C3.89415 25.8016 2.53966 25.145 1.51233 24.1022L0.61421 23.2226C0.220464 22.8193 0 22.2775 0 21.7135C0 21.1493 0.220464 20.6078 0.61421 20.2044L4.42624 16.4264C4.82562 16.0333 5.36317 15.8131 5.92311 15.8131C6.48306 15.8131 7.02061 16.0333 7.41997 16.4264C7.82273 16.8208 8.36358 17.0416 8.92684 17.0416C9.49007 17.0416 10.0309 16.8208 10.4337 16.4264L16.4212 10.4297C16.6209 10.2326 16.7795 9.99764 16.8878 9.73857C16.996 9.47948 17.0518 9.20143 17.0518 8.92056C17.0518 8.6397 16.996 8.36165 16.8878 8.10256C16.7795 7.84349 16.6209 7.60854 16.4212 7.41141C16.0287 7.01142 15.8087 6.47303 15.8087 5.91223C15.8087 5.35141 16.0287 4.81304 16.4212 4.41305L20.2133 0.615154C20.6159 0.220803 21.1569 0 21.72 0C22.2833 0 22.8243 0.220803 23.2269 0.615154L24.1051 1.51466C25.1463 2.54358 25.8018 3.90015 25.9617 5.35628C26.1218 6.81239 25.7762 8.27927 24.9832 9.51024C20.8518 15.6083 15.595 20.8596 9.49564 24.9817Z" fill="white"/>
                </svg>
                Hotline
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></span>
                  (+84.28) 62 815 825
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></span>
                  (+84.28) 62 815 819
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 26 26" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M0.815916 0.815917C1.33834 0.293494 2.0469 0 2.78571 0H21.3571C22.0959 0 22.8046 0.293494 23.327 0.815917L23.3403 0.829547L12.0714 8.79301L0.802366 0.829562L0.815916 0.815917ZM0 3.10512V15.7857C0 16.5245 0.293493 17.2331 0.815916 17.7555C1.33834 18.2779 2.04688 18.5714 2.78571 18.5714H10.2735C10.5228 17.1218 11.5581 15.8079 13.3794 15.4856C14.3774 15.3091 15.2148 14.5246 15.4471 13.4459L15.4857 13.2662C16.3566 9.22068 22.1122 9.1843 23.0204 13.2336L23.0673 13.443C23.2213 14.1289 23.6174 14.6951 24.1428 15.0622V3.10511L12.7413 11.1622C12.3397 11.4459 11.803 11.4459 11.4015 11.1622L0 3.10512ZM17.7552 13.7547C18.1033 12.1374 20.3929 12.1258 20.7554 13.7417L20.8022 13.9511C21.2453 15.9261 22.8072 17.425 24.7494 17.7686C26.4169 18.0636 26.4169 20.4722 24.7494 20.7671C22.8072 21.1107 21.2453 22.6096 20.8022 24.5847L20.7554 24.794C20.3929 26.4099 18.1033 26.3984 17.7552 24.781L17.7165 24.6014C17.2897 22.6185 15.7294 21.1083 13.7838 20.7642C12.1197 20.4698 12.1197 18.066 13.7838 17.7716C15.7294 17.4274 17.2897 15.9171 17.7165 13.9344L17.7552 13.7547Z" fill="white"/>
                </svg>
                Email
              </h3>
              <p className="text-sm text-gray-300">contact@aqtech.vn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        Copyright © {new Date().getFullYear()} <b className="text-white">AQTech</b>. All rights reserved
      </div>
    </footer>
  )
}
