Giải thích về Bcrypt - Mã hóa mật khẩu an toàn
Tổng quan
Bcrypt là thư viện giúp hash (mã hóa) mật khẩu một cách an toàn trong Node.js.
Tại sao cần Bcrypt?
❌ KHÔNG BAO GIỜ lưu mật khẩu dạng plaintext (text thường)
❌ KHÔNG dùng MD5 hoặc SHA1 (quá nhanh, dễ bị brute-force)
✅ DÙNG Bcrypt - chậm có chủ đích, chống brute-force
Cài đặt
bashnpm install bcrypt
```

---

## Khái niệm cơ bản

### 1. **Hash** (Băm)
Chuyển mật khẩu thành chuỗi ngẫu nhiên không thể đảo ngược:
```
"mypassword123" → "$2b$10$nOUIs5kJ7naTuTFkBy1veuK0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa"

2. Salt (Muối)
Chuỗi ngẫu nhiên thêm vào mật khẩu trước khi hash:

Làm mỗi hash là DUY NHẤT ngay cả khi mật khẩu giống nhau
Chống rainbow table attacks

3. Rounds (Số vòng)
Số lần lặp thuật toán (2^rounds):

rounds=10 → 2^10 = 1024 lần lặp (~10 hash/giây)
rounds=12 → 2^12 = 4096 lần lặp (~2-3 hash/giây)
Cao hơn = an toàn hơn nhưng chậm hơn


Cách sử dụng
1. Hash mật khẩu (Async - Khuyến nghị)
Cách 1: Tự động tạo salt
typescriptimport bcrypt from 'bcrypt';

const saltRounds = 10;
const plainPassword = 'myPassword123';

// Hash mật khẩu
const hash = await bcrypt.hash(plainPassword, saltRounds);
// hash = "$2b$10$nOUIs5kJ7naTuTFk..."

// Lưu hash vào database
await db.users.create({
  username: 'john',
  password: hash  // Lưu hash, KHÔNG lưu plainPassword
});
Cách 2: Tạo salt riêng (2 bước)
typescript// Bước 1: Tạo salt
const salt = await bcrypt.genSalt(saltRounds);
// salt = "$2b$10$nOUIs5kJ7naTuTFk..."

// Bước 2: Hash với salt đó
const hash = await bcrypt.hash(plainPassword, salt);

// Lưu hash vào database
Lưu ý: Cả 2 cách đều cho kết quả giống nhau!

2. So sánh mật khẩu (Login)
typescript// User đăng nhập với mật khẩu
const loginPassword = 'myPassword123';

// Lấy hash từ database
const user = await db.users.findOne({ username: 'john' });
const hashFromDB = user.password;

// So sánh
const isMatch = await bcrypt.compare(loginPassword, hashFromDB);

if (isMatch) {
  console.log('✅ Đăng nhập thành công!');
  // Tạo session, JWT token, etc.
} else {
  console.log('❌ Sai mật khẩu!');
}

3. Sync mode (KHÔNG khuyến nghị cho server)
typescript// Hash
const hash = bcrypt.hashSync(plainPassword, saltRounds);

// Compare
const isMatch = bcrypt.compareSync(loginPassword, hash);
Tại sao không nên dùng Sync?

Block event loop của Node.js
Làm server đơ khi hash (vì bcrypt rất chậm)
Không thể xử lý requests khác trong lúc đó


Ví dụ thực tế
1. Đăng ký User
typescriptimport bcrypt from 'bcrypt';
import express from 'express';

const app = express();
app.use(express.json());

const SALT_ROUNDS = 10;

// API đăng ký
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!password || password.length < 8) {
      return res.status(400).json({ 
        error: 'Mật khẩu phải có ít nhất 8 ký tự' 
      });
    }
    
    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    // Lưu vào database
    await db.users.create({
      username,
      password: hashedPassword  // Lưu hash, không lưu plaintext
    });
    
    res.status(201).json({ 
      message: 'Đăng ký thành công!' 
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

2. Đăng nhập User
typescriptapp.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Tìm user trong database
    const user = await db.users.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Sai tên đăng nhập hoặc mật khẩu' 
      });
    }
    
    // So sánh mật khẩu
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Sai tên đăng nhập hoặc mật khẩu' 
      });
    }
    
    // Đăng nhập thành công
    // Tạo JWT token hoặc session
    const token = generateJWT(user);
    
    res.json({ 
      message: 'Đăng nhập thành công',
      token 
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

3. Đổi mật khẩu
typescriptapp.put('/change-password', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // Từ JWT middleware
    
    // Lấy user từ database
    const user = await db.users.findById(userId);
    
    // Verify mật khẩu cũ
    const isValidOldPassword = await bcrypt.compare(
      oldPassword, 
      user.password
    );
    
    if (!isValidOldPassword) {
      return res.status(400).json({ 
        error: 'Mật khẩu cũ không đúng' 
      });
    }
    
    // Hash mật khẩu mới
    const newHashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    
    // Update database
    await db.users.update(userId, { 
      password: newHashedPassword 
    });
    
    res.json({ message: 'Đổi mật khẩu thành công' });
    
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

---

## Cấu trúc Hash

Hash của bcrypt có format:
```
$2b$10$nOUIs5kJ7naTuTFkBy1veuK0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa
│  │  │                     │
│  │  │                     └─ Hash value (31 ký tự)
│  │  └─ Salt (22 ký tự)
│  └─ Cost factor (10 = 2^10 rounds)
└─ Algorithm ($2b = BCrypt version b)
Quan trọng: Salt đã được bao gồm trong hash, không cần lưu riêng!

Chọn Rounds phù hợp
RoundsThời gianHashes/giâySử dụng8~25ms~40❌ Quá nhanh10~100ms~10✅ Mặc định (khuyến nghị)12~400ms2-3✅ Cao hơn (tốt)13~1s~1⚠️ Chậm (cẩn thận)14~1.5s~0.7⚠️ Rất chậm15+3s+<0.3❌ Quá chậm cho web
Lựa chọn:

Rounds 10: Chuẩn cho hầu hết ứng dụng
Rounds 12: Tốt cho ứng dụng quan trọng
Rounds 13+: Cân nhắc trải nghiệm người dùng

typescript// Tự động điều chỉnh rounds theo hardware
const SALT_ROUNDS = process.env.NODE_ENV === 'production' ? 12 : 10;

Vấn đề bảo mật
⚠️ Giới hạn 72 bytes
Bcrypt chỉ dùng 72 bytes đầu của mật khẩu:
typescriptconst password = 'a'.repeat(100); // 100 ký tự
const hash = await bcrypt.hash(password, 10);

// Chỉ 72 bytes đầu được hash
// 28 ký tự cuối bị BỎ QUA!
Giải pháp: Giới hạn độ dài mật khẩu khi validate
⚠️ Null bytes
Versions < 5.0.0 có lỗi với ký tự null (\0):
typescriptconst password = 'password\0ignored';
// Phần 'ignored' bị bỏ qua trong versions cũ
Giải pháp: Nâng cấp lên version >= 5.0.0

Best Practices
✅ Nên làm:

Luôn dùng async

typescriptawait bcrypt.hash(password, saltRounds); // ✅

Validate độ dài mật khẩu

typescriptif (password.length < 8 || password.length > 72) {
  throw new Error('Mật khẩu phải từ 8-72 ký tự');
}

Dùng rounds phù hợp

typescriptconst SALT_ROUNDS = 10; // Hoặc 12 cho production

KHÔNG để lộ thông tin lỗi cụ thể

typescript// ❌ SAI
if (!user) return res.json({ error: 'User không tồn tại' });
if (!match) return res.json({ error: 'Sai mật khẩu' });

// ✅ ĐÚNG - Thông báo chung
return res.status(401).json({ 
  error: 'Sai tên đăng nhập hoặc mật khẩu' 
});

Rate limiting cho login

typescriptimport rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Tối đa 5 lần thử
  message: 'Quá nhiều lần đăng nhập thất bại. Thử lại sau 15 phút'
});

app.post('/login', loginLimiter, loginHandler);
❌ Không nên:

❌ Dùng sync mode trên server
❌ Lưu mật khẩu plaintext
❌ Dùng rounds quá thấp (< 10)
❌ So sánh hash bằng === (dùng bcrypt.compare)
❌ Log mật khẩu hoặc hash


So sánh với các phương pháp khác
Phương phápTốc độBảo mậtKhuyến nghịPlaintext⚡⚡⚡❌ Rất nguy hiểm❌ KHÔNG BAO GIỜMD5/SHA1⚡⚡⚡❌ Dễ bị crack❌ Không dùngSHA256⚡⚡⚠️ Quá nhanh❌ Không phù hợpBcrypt⚡✅ Rất tốt✅ Khuyến nghịArgon2⚡✅ Tốt nhất✅ Tốt nhưng mới hơn

Tóm tắt nhanh
typescriptimport bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// Đăng ký - Hash mật khẩu
const hash = await bcrypt.hash(password, SALT_ROUNDS);
await saveToDatabase(hash);

// Đăng nhập - So sánh mật khẩu
const isMatch = await bcrypt.compare(password, hashFromDB);
if (isMatch) {
  // Login thành công
}
Bcrypt = Cách đơn giản và an toàn nhất để bảo vệ mật khẩu! 🔐