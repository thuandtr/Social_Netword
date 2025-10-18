Giải thích về Middleware xử lý dữ liệu trong Express
1. app.use(express.json())
Công dụng

Parse (phân tích) dữ liệu JSON từ request body
Chuyển đổi chuỗi JSON thành JavaScript object
Chỉ xử lý các request có header Content-Type: application/json

Ví dụ thực tế
Client gửi request:
javascriptfetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Nguyen Van A',
    email: 'a@example.com'
  })
})
Server nhận được:
typescriptapp.post('/api/users', (req, res) => {
  console.log(req.body);
  // Output: { name: 'Nguyen Van A', email: 'a@example.com' }
  // Đã là object, không còn là string nữa!
  
  const userName = req.body.name; // Truy cập trực tiếp
  res.json({ message: 'User created' });
});
Không có express.json():
typescript// req.body sẽ là undefined!
console.log(req.body); // undefined

2. app.use(express.urlencoded({ extended: true }))
Công dụng

Parse dữ liệu từ HTML form hoặc URL-encoded data
Xử lý các request có header Content-Type: application/x-www-form-urlencoded
Chuyển đổi dữ liệu dạng key=value&key2=value2 thành object

Tùy chọn extended
extended: true (khuyến nghị)

Sử dụng thư viện qs để parse
Hỗ trợ dữ liệu phức tạp: nested objects, arrays
Linh hoạt hơn

extended: false

Sử dụng thư viện querystring
Chỉ hỗ trợ dữ liệu đơn giản: string và array
Không hỗ trợ nested objects

Ví dụ thực tế
HTML Form:
html<form action="/login" method="POST">
  <input type="text" name="username" value="admin">
  <input type="password" name="password" value="123456">
  <button type="submit">Login</button>
</form>
Server nhận được:
typescriptapp.post('/login', (req, res) => {
  console.log(req.body);
  // Output: { username: 'admin', password: '123456' }
  
  const { username, password } = req.body;
  // Có thể sử dụng ngay!
});
So sánh extended: true vs false
Với extended: true:
typescript// URL: /search?user[name]=John&user[age]=30
app.get('/search', (req, res) => {
  console.log(req.query);
  // { user: { name: 'John', age: '30' } } ✅ Nested object
});
Với extended: false:
typescript// URL: /search?user[name]=John&user[age]=30
app.get('/search', (req, res) => {
  console.log(req.query);
  // { 'user[name]': 'John', 'user[age]': '30' } ❌ Không parse được
});

Tóm tắt so sánh
MiddlewareXử lý loại dữ liệuContent-TypeVí dụ sử dụngexpress.json()JSONapplication/jsonAPI, AJAX, fetch()express.urlencoded()Form dataapplication/x-www-form-urlencodedHTML form submission
Khi nào cần dùng?
✅ Cần cả hai khi:

Ứng dụng có cả API (JSON) và HTML forms
Muốn hỗ trợ nhiều loại client khác nhau

✅ Chỉ cần express.json() khi:

Chỉ làm REST API
Không có HTML forms
Client luôn gửi JSON (React, Vue, mobile apps)

✅ Chỉ cần express.urlencoded() khi:

Chỉ làm web truyền thống với forms
Không có API endpoints

Ví dụ đầy đủ
typescriptimport express from 'express';

const app = express();

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies (từ HTML forms)
app.use(express.urlencoded({ extended: true }));

// API endpoint - nhận JSON
app.post('/api/users', (req, res) => {
  // req.body từ express.json()
  const { name, email } = req.body;
  res.json({ success: true, user: { name, email } });
});

// Form endpoint - nhận form data
app.post('/contact', (req, res) => {
  // req.body từ express.urlencoded()
  const { name, message } = req.body;
  res.send('Cảm ơn bạn đã liên hệ!');
});

app.listen(3000);
Lưu ý quan trọng
⚠️ Thứ tự middleware quan trọng:
typescript// ✅ ĐÚNG - Đặt trước các routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/api/users', handler);

// ❌ SAI - Đặt sau routes sẽ không hoạt động
app.post('/api/users', handler);
app.use(express.json()); // Quá muộn!
⚠️ Giới hạn kích thước:
typescript// Giới hạn payload size
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));