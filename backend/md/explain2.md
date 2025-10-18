Giải thích về Helmet - Bảo mật ứng dụng Express
Tổng quan
Helmet là một middleware giúp bảo vệ ứng dụng Express bằng cách thiết lập các HTTP response headers bảo mật.
Cài đặt và sử dụng cơ bản
typescriptimport helmet from "helmet";
import express from "express";

const app = express();

// Bật tất cả bảo vệ mặc định
app.use(helmet());

Các Headers được thiết lập mặc định
1. Content-Security-Policy (CSP)
Chức năng: Kiểm soát nguồn tài nguyên nào được phép load trên trang web
Bảo vệ khỏi:

Cross-Site Scripting (XSS)
Code injection attacks
Clickjacking

Ví dụ:
typescript// Chỉ cho phép scripts từ chính website và example.com
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "script-src": ["'self'", "example.com"],
      "img-src": ["'self'", "data:", "https:"],
      "style-src": ["'self'", "'unsafe-inline'"]
    }
  }
}));

2. Cross-Origin-Opener-Policy (COOP)
Chức năng: Cách ly process của trang web
Lợi ích: Ngăn các trang khác truy cập window object của bạn

3. Cross-Origin-Resource-Policy (CORP)
Chức năng: Chặn các website khác load tài nguyên của bạn
Ví dụ: Ngăn website khác nhúng ảnh, video từ server của bạn

4. Origin-Agent-Cluster
Chức năng: Thay đổi cách trình duyệt cách ly process dựa trên origin
Lợi ích: Tăng cường bảo mật giữa các trang khác origin

5. Referrer-Policy
Chức năng: Kiểm soát thông tin gửi trong header Referer
Ví dụ:
typescript// Không gửi referrer khi chuyển từ HTTPS sang HTTP
app.use(helmet({
  referrerPolicy: { policy: "no-referrer-when-downgrade" }
}));
Tại sao quan trọng: Bảo vệ privacy, không để lộ URL nhạy cảm

6. Strict-Transport-Security (HSTS)
Chức năng: Bắt buộc trình duyệt chỉ dùng HTTPS
Ví dụ:
typescriptapp.use(helmet({
  hsts: {
    maxAge: 31536000, // 1 năm (tính bằng giây)
    includeSubDomains: true, // Áp dụng cho subdomain
    preload: true
  }
}));
Bảo vệ khỏi: Man-in-the-middle attacks, SSL stripping

7. X-Content-Type-Options
Chức năng: Ngăn trình duyệt "đoán" MIME type
Giá trị: nosniff
Bảo vệ khỏi: MIME type confusion attacks
Ví dụ tấn công: Upload file .txt nhưng browser hiểu nhầm là JavaScript và thực thi

8. X-DNS-Prefetch-Control
Chức năng: Kiểm soát DNS prefetching
Lợi ích: Tăng privacy bằng cách tắt DNS prefetch

9. X-Download-Options
Chức năng: Bắt buộc file download phải được lưu (chỉ IE)
Bảo vệ khỏi: File được mở trực tiếp trong context của website

10. X-Frame-Options
Chức năng: Ngăn website bị nhúng trong <iframe>
Giá trị:

DENY: Không cho phép nhúng
SAMEORIGIN: Chỉ cho phép cùng origin

Bảo vệ khỏi: Clickjacking attacks
typescriptapp.use(helmet({
  frameguard: { action: "deny" } // hoặc "sameorigin"
}));

11. X-Permitted-Cross-Domain-Policies
Chức năng: Kiểm soát Adobe products (Flash, Acrobat)
Hiếm dùng: Vì Flash đã lỗi thời

12. X-Powered-By (BỊ XÓA)
Chức năng: Helmet xóa header này
Lý do: Header này tiết lộ thông tin về web server (Express, PHP, etc.)
Tại sao nguy hiểm: Hacker biết được công nghệ để tìm lỗ hổng cụ thể
typescript// Mặc định helmet đã xóa, nhưng có thể tắt Express thủ công:
app.disable('x-powered-by');

13. X-XSS-Protection (BỊ TẮT)
Chức năng: Helmet TẮT header này
Lý do: Header cũ này có thể gây ra lỗ hổng mới
Thay thế: Dùng Content-Security-Policy thay thế

Cấu hình tùy chỉnh
Ví dụ 1: Cấu hình CSP cho ứng dụng thực tế
typescriptapp.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], // Mặc định chỉ từ chính website
      scriptSrc: ["'self'", "cdn.example.com", "https://trusted.com"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Cho phép inline styles
      imgSrc: ["'self'", "data:", "https:"], // Cho phép ảnh từ HTTPS
      connectSrc: ["'self'", "https://api.example.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"], // Chặn plugins (Flash, Java)
      upgradeInsecureRequests: [] // Tự động nâng HTTP lên HTTPS
    }
  }
}));
Ví dụ 2: Tắt một số headers
typescriptapp.use(helmet({
  contentSecurityPolicy: false, // Tắt CSP
  xDownloadOptions: false, // Tắt X-Download-Options
}));
Ví dụ 3: Cấu hình cho development vs production
typescriptconst isDevelopment = process.env.NODE_ENV === 'development';

app.use(helmet({
  contentSecurityPolicy: isDevelopment ? false : {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"]
    }
  },
  hsts: isDevelopment ? false : {
    maxAge: 31536000,
    includeSubDomains: true
  }
}));

So sánh Trước và Sau khi dùng Helmet
❌ Không có Helmet
httpHTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html
Nguy hiểm:

Lộ thông tin server
Không bảo vệ XSS
Có thể bị clickjacking
Dễ bị MIME sniffing

✅ Có Helmet
httpHTTP/1.1 200 OK
Content-Security-Policy: default-src 'self'
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
An toàn hơn nhiều!

Các tình huống thực tế
1. Website có nhúng Google Analytics
typescriptapp.use(helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrc: [
        "'self'",
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com"
      ],
      connectSrc: [
        "'self'",
        "https://www.google-analytics.com"
      ]
    }
  }
}));
2. Website dùng inline styles/scripts
typescriptapp.use(helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrc: ["'self'", "'unsafe-inline'"], // Không khuyến khích!
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));
Lưu ý: 'unsafe-inline' làm giảm bảo mật, nên tránh nếu có thể.
3. API server (không cần CSP)
typescriptapp.use(helmet({
  contentSecurityPolicy: false, // API không cần CSP
}));

Lời khuyên
✅ Nên làm:

Luôn dùng Helmet trong production
Cấu hình CSP phù hợp với ứng dụng
Bật HSTS cho HTTPS websites
Test kỹ sau khi bật Helmet

❌ Không nên:

Tắt tất cả bảo vệ vì "không hoạt động"
Dùng 'unsafe-inline', 'unsafe-eval' trừ khi thực sự cần
Quên test trên các trình duyệt khác nhau

🔍 Kiểm tra headers:

Dùng DevTools (Network tab → Headers)
Online tools: securityheaders.com
Browser extensions: Security Headers


Tóm tắt
Helmet = 1 dòng code, bảo vệ 13+ lỗ hổng bảo mật phổ biến!
typescriptapp.use(helmet()); // Đơn giản nhưng mạnh mẽ!