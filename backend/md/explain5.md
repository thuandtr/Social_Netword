Giải thích thư viện jsonwebtoken
Giới thiệu
jsonwebtoken là một thư viện JavaScript để tạo và xác thực JSON Web Tokens (JWT) - một chuẩn mở để truyền thông tin an toàn giữa các bên dưới dạng đối tượng JSON.

Cấu trúc tổng thể JWT
xxxxx.yyyyy.zzzzz


JWT gồm 3 phần, phân tách bởi dấu chấm (.):

Header

Payload

Signature

HEADER:ALGORITHM & TOKEN TYPE
{
  "alg": "HS256",
  "typ": "JWT"
}

PAYLOAD:DATA
{
  "sub": "1234567890",
  "name": "John Doe",
  "role": "admin",
  "iat": 1697700000,
  "exp": 1697703600
}

SIGNATURE
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret_key
)


Cài đặt
bashnpm install jsonwebtoken
Các chức năng chính



1. jwt.sign() - Tạo token
Cú pháp:
javascriptjwt.sign(payload, secretOrPrivateKey, [options, callback])
Giải thích:

payload: Dữ liệu bạn muốn mã hóa (có thể là object, buffer hoặc string)
secretOrPrivateKey: Khóa bí mật để ký token (dạng string, buffer hoặc private key)
options: Các tùy chọn như:

algorithm: Thuật toán mã hóa (mặc định: HS256)
expiresIn: Thời gian hết hạn (ví dụ: "1h", "7d", 3600)
audience: Đối tượng sử dụng token
issuer: Người phát hành token
subject: Chủ đề của token



Ví dụ:
javascriptvar jwt = require('jsonwebtoken');

// Tạo token đơn giản
var token = jwt.sign({ foo: 'bar' }, 'khoabimatsieubaomat');

// Tạo token có thời gian hết hạn 1 giờ
var token = jwt.sign({ data: 'dulieu' }, 'secret', { expiresIn: '1h' });

2. jwt.verify() - Xác thực token
Cú pháp:
javascriptjwt.verify(token, secretOrPublicKey, [options, callback])
Giải thích:

Kiểm tra xem token có hợp lệ không
Giải mã và trả về dữ liệu trong payload
Có thể kiểm tra thêm audience, issuer, thời gian hết hạn

Ví dụ:
javascript// Xác thực đồng bộ
try {
  var decoded = jwt.verify(token, 'khoabimatsieubaomat');
  console.log(decoded.foo); // 'bar'
} catch(err) {
  console.log('Token không hợp lệ');
}

// Xác thực bất đồng bộ
jwt.verify(token, 'khoabimatsieubaomat', function(err, decoded) {
  if (err) {
    console.log('Lỗi xác thực');
  } else {
    console.log(decoded.foo); // 'bar'
  }
});

3. Thời gian hết hạn (exp claim)
Token có thể được thiết lập thời gian hết hạn theo 2 cách:
javascript// Cách 1: Dùng expiresIn
jwt.sign({ data: 'foobar' }, 'secret', { expiresIn: '1h' });

// Cách 2: Dùng exp (số giây kể từ 1/1/1970)
jwt.sign({
  exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 giờ
  data: 'foobar'
}, 'secret');
Các lỗi thường gặp
TokenExpiredError

Token đã hết hạn
Thông báo: 'jwt expired'

JsonWebTokenError

Token không hợp lệ
Các lỗi như: 'jwt malformed', 'invalid signature', 'invalid token'

NotBeforeError

Token chưa có hiệu lực (thời gian hiện tại trước thời gian nbf)

Các thuật toán được hỗ trợ
Thuật toánMô tảHS256, HS384, HS512HMAC với SHA-256/384/512RS256, RS384, RS512RSA với SHA-256/384/512ES256, ES384, ES512ECDSA với các đường cong khác nhauPS256, PS384, PS512RSA-PSS với SHA-256/384/512
Ứng dụng thực tế
JWT thường được dùng để:

Xác thực người dùng: Sau khi đăng nhập, server tạo JWT và gửi cho client
Bảo mật API: Client gửi JWT trong header để truy cập các API được bảo vệ
Truyền thông tin an toàn: Mã hóa thông tin quan trọng giữa các hệ thống

Lưu ý quan trọng:

Token từ nguồn không tin cậy phải được xử lý cẩn thận
Nên kiểm tra kỹ payload trước khi sử dụng
Không nên lưu thông tin nhạy cảm trong payload vì nó có thể bị giải mã