Giải thích về Morgan - HTTP Request Logger
Tổng quan
Morgan là một middleware để ghi log các HTTP request trong ứng dụng Node.js/Express.
Tên gọi lấy từ Dexter Morgan - nhân vật chính trong series Dexter 😄
Cài đặt
bashnpm install morgan
Sử dụng cơ bản
typescriptimport morgan from 'morgan';
import express from 'express';

const app = express();

// Sử dụng format có sẵn
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello World');
});
```

---

## Các Format có sẵn

### 1. **`dev`** (Khuyến nghị cho Development)

**Đặc điểm:**
- Ngắn gọn, dễ đọc
- **Có màu sắc** theo status code
- Hiển thị response time

**Format:**
```
:method :url :status :response-time ms - :res[content-length]
```

**Output:**
```
GET /dev 200 0.224 ms - 2
```

**Màu sắc:**
- 🟢 Xanh lá: 2xx (Success)
- 🔴 Đỏ: 5xx (Server Error)
- 🟡 Vàng: 4xx (Client Error)
- 🔵 Cyan: 3xx (Redirect)
- ⚪ Không màu: 1xx (Info)

---

### 2. **`combined`** (Khuyến nghị cho Production)

**Đặc điểm:**
- Format chuẩn Apache
- Thông tin đầy đủ nhất
- Phù hợp cho phân tích log

**Format:**
```
:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
```

**Output:**
```
::1 - - [27/Nov/2024:06:21:42 +0000] "GET /combined HTTP/1.1" 200 2 "-" "curl/8.7.1"
```

---

### 3. **`common`**

**Đặc điểm:**
- Format chuẩn Apache đơn giản hơn
- Không có referrer và user-agent

**Format:**
```
:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]
```

**Output:**
```
::1 - - [27/Nov/2024:06:21:46 +0000] "GET /common HTTP/1.1" 200 2
```

---

### 4. **`tiny`** (Tối giản nhất)

**Đặc điểm:**
- Cực kỳ ngắn gọn
- Chỉ thông tin cơ bản

**Format:**
```
:method :url :status :res[content-length] - :response-time ms
```

**Output:**
```
GET /tiny 200 2 - 0.188 ms
```

---

### 5. **`short`**

**Đặc điểm:**
- Trung bình giữa tiny và common
- Có response time

**Output:**
```
::1 - GET /short HTTP/1.1 200 2 - 0.283 ms

Các Options quan trọng
1. stream - Ghi log vào file
typescriptimport fs from 'fs';
import path from 'path';

// Tạo write stream (chế độ append)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

// Ghi log vào file
app.use(morgan('combined', { stream: accessLogStream }));
2. skip - Bỏ qua một số request
typescript// Chỉ log errors (4xx, 5xx)
app.use(morgan('combined', {
  skip: (req, res) => res.statusCode < 400
}));

// Chỉ log success (2xx)
app.use(morgan('dev', {
  skip: (req, res) => res.statusCode >= 300
}));

// Bỏ qua health check endpoints
app.use(morgan('combined', {
  skip: (req, res) => req.url === '/health'
}));
3. immediate - Log ngay khi nhận request
typescript// Log ngay khi request đến, không đợi response
app.use(morgan('combined', {
  immediate: true
}));
Lợi ích: Vẫn log được nếu server crash trước khi response
Nhược điểm: Không log được status code, response time

Tokens (Các biến có sẵn)
Tokens cơ bản
TokenÝ nghĩaVí dụ:methodHTTP methodGET, POST, PUT:urlURL path/api/users:statusStatus code200, 404, 500:response-timeThời gian xử lý (ms)15.234:res[content-length]Kích thước response1024:remote-addrIP client192.168.1.1:http-versionHTTP version1.1, 2.0:user-agentBrowser/client infoMozilla/5.0...:referrerTrang trước đóhttps://google.com:date[format]Ngày giờ[27/Nov/2024:06:21:42]
Tạo Custom Token
typescriptimport morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';

// Tạo token 'id' cho request ID
morgan.token('id', (req, res) => {
  return req.id;
});

// Tạo token 'type' cho content-type
morgan.token('type', (req, res) => {
  return req.headers['content-type'];
});

// Middleware gán ID cho mỗi request
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});

// Sử dụng custom tokens
app.use(morgan(':id :method :url :status :response-time ms'));
```

**Output:**
```
a1b2c3d4-e5f6-7890-abcd-ef1234567890 GET /api/users 200 45.123 ms

Custom Format String
typescript// Format tùy chỉnh
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Thêm các ký tự khác
app.use(morgan('📝 :method :url → :status (:response-time ms)'));
```

**Output:**
```
📝 GET /api/users → 200 (15.234 ms)

Custom Format Function
typescriptapp.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ');
}));

// Format phức tạp hơn
app.use(morgan((tokens, req, res) => {
  return JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    responseTime: tokens['response-time'](req, res),
    timestamp: new Date().toISOString()
  });
}));
Output (JSON):
json{"method":"GET","url":"/api/users","status":"200","responseTime":"15.234","timestamp":"2024-11-27T06:21:42.000Z"}

Các Use Cases thực tế
1. Development Setup - Log ra console với màu
typescriptif (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
2. Production Setup - Log vào file
typescriptif (process.env.NODE_ENV === 'production') {
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'logs', 'access.log'),
    { flags: 'a' }
  );
  
  app.use(morgan('combined', { stream: accessLogStream }));
}
3. Dual Logging - Console + File
typescript// Log tất cả vào file
app.use(morgan('combined', {
  stream: fs.createWriteStream('./access.log', { flags: 'a' })
}));

// Log chỉ errors ra console
app.use(morgan('dev', {
  skip: (req, res) => res.statusCode < 400
}));
4. Log Rotation - Xoay vòng log files theo ngày
typescriptimport rfs from 'rotating-file-stream';

// Tạo stream tự động tạo file mới mỗi ngày
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // Rotate mỗi ngày
  path: path.join(__dirname, 'logs'),
  maxFiles: 30 // Giữ 30 file gần nhất
});

app.use(morgan('combined', { stream: accessLogStream }));
```

**Kết quả:**
```
logs/
  ├── access.log              (hôm nay)
  ├── access-2024-11-26.log
  ├── access-2024-11-25.log
  └── ...
5. Bỏ qua static files và health checks
typescriptapp.use(morgan('combined', {
  skip: (req, res) => {
    // Bỏ qua static files
    if (req.url.startsWith('/static')) return true;
    
    // Bỏ qua health check
    if (req.url === '/health') return true;
    
    // Bỏ qua favicon
    if (req.url === '/favicon.ico') return true;
    
    return false;
  }
}));
6. Log theo User ID
typescript// Thêm user ID vào log
morgan.token('user-id', (req) => {
  return req.user?.id || 'anonymous';
});

app.use(morgan(':user-id :method :url :status :response-time ms'));
```

**Output:**
```
user123 GET /api/profile 200 25.123 ms
anonymous GET /login 200 10.456 ms

So sánh các format
FormatChi tiếtMàu sắcUse Casedev⭐⭐⭐✅Developmentcombined⭐⭐⭐⭐⭐❌Productioncommon⭐⭐⭐⭐❌Production (đơn giản)tiny⭐❌Testing nhanhshort⭐⭐❌Development (ít info)

Best Practices
✅ Nên làm:

Dùng dev trong development

typescriptif (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

Dùng combined + file trong production

typescriptif (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { 
    stream: accessLogStream 
  }));
}

Bỏ qua các endpoint không cần thiết

typescriptapp.use(morgan('combined', {
  skip: (req) => req.url === '/health'
}));

Rotate log files

typescript// Dùng rotating-file-stream
const stream = rfs.createStream('access.log', {
  interval: '1d',
  maxFiles: 30
});
❌ Không nên:

❌ Log tất cả trong production mà không filter
❌ Không rotate logs (file sẽ vô cùng lớn)
❌ Log thông tin nhạy cảm (passwords, tokens)
❌ Dùng format phức tạp gây chậm performance


Tóm tắt nhanh
typescriptimport morgan from 'morgan';

// Development - màu sắc, dễ đọc
app.use(morgan('dev'));

// Production - đầy đủ, ghi file
app.use(morgan('combined', { stream: logFile }));

// Custom token
morgan.token('id', (req) => req.id);
app.use(morgan(':id :method :url :status'));

// Skip requests
app.use(morgan('dev', {
  skip: (req, res) => res.statusCode < 400
}));
Morgan = Giám sát và debug ứng dụng dễ dàng hơn! 📊