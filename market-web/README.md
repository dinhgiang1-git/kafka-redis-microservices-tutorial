# 📊 MARKET PULSE — Frontend Web Dashboard (`market-web`)

Dashboard theo dõi bảng giá tiền mã hóa theo thời gian thực (Binance / TradingView Style) cho 5 cặp coin:
- **BTC/USDT**
- **ETH/USDT**
- **BNB/USDT**
- **SOL/USDT**
- **XRP/USDT**

Hệ thống kết nối trực tiếp với pipeline microservices:
`market-simulator (Port 8080)` ➔ `Kafka topic market.price` ➔ `price-write-service (Port 8081)` ➔ `MongoDB & Redis` ➔ `market-read-service (Port 8082)` ➔ `market-web`.

---

## 🚀 Công nghệ sử dụng

- **Core:** React 19 + TypeScript 5
- **Build Tool:** Vite 8 (tốc độ biên dịch và HMR cực nhanh)
- **Data Fetching:** TanStack React Query v5 (polling 1.000ms, retry có kiểm soát, giữ last-known cache)
- **Styling:** Tailwind CSS v4 + Dark Trading Theme (`#080B11`, tabular fonts, glassmorphism)
- **Icons:** Lucide React
- **Testing:** Vitest + React Testing Library (31 unit & component tests)
- **Deployment:** Docker Multi-stage + Nginx reverse proxy

---

## 🛠️ Hướng dẫn cài đặt & Khởi chạy

### 1. Cài đặt Dependencies

Tại thư mục `market-web`:

```bash
npm install
```

### 2. Khởi chạy môi trường phát triển (Development)

```bash
npm run dev
```

Mở trình duyệt tại: **http://localhost:3000**

- Vite Dev Server đã cấu hình sẵn proxy `/api/*` chuyển tiếp tự động tới backend `http://localhost:8082`.
- Khi `market-read-service` đang chạy, dashboard sẽ tự động cập nhật dữ liệu trực tiếp mỗi 1 giây.

### 3. Chế độ Mô phỏng (Demo Simulation Mode)

Nếu backend chưa khởi động, dashboard sẽ hiển thị thông báo kết nối kèm nút **"Bật Demo Mode ngay"**. Bạn cũng có thể:
- Bấm nút **"Bật Demo Simulation"** ở thanh trạng thái góc trên bên phải.
- Hoặc thêm query param vào URL: `http://localhost:3000/?demo=true`.

Trong chế độ này, dashboard tự sinh dữ liệu ngẫu nhiên mỗi giây để bạn có thể xem thử toàn bộ hiệu ứng flash xanh/đỏ, sparkline biểu đồ, tỷ lệ tăng giảm mà không cần cài đặt Kafka/Docker.

### 4. Chạy Unit & Component Test

```bash
npm test
```

Chạy chế độ watch khi phát triển:

```bash
npm run test:watch
```

### 5. Build Production

```bash
npm run build
```

Bundle được xuất ra tại thư mục `dist/`.

---

## ⚡ Các tính năng nổi bật & Quy tắc hoạt động

1. **Hiệu ứng Flash giá thời gian thực:**
   - Giá mới cao hơn giá trước: nhấp nháy nền xanh (`flash-up`) trong 750ms.
   - Giá mới thấp hơn giá trước: nhấp nháy nền đỏ (`flash-down`) trong 750ms.
   - Lần tải đầu tiên (`sequence` đầu): không phát hiệu ứng flash.
   - `sequence` không mới hơn: bỏ qua hiệu ứng, chống re-flash sai.
   - Tôn trọng `prefers-reduced-motion` của người dùng.
2. **Font chữ số Tabular:**
   - Dùng JetBrains Mono với `font-variant-numeric: tabular-nums` giúp các chữ số có độ rộng đồng đều tuyệt đối, không làm cột giá bị rung giật khi giá liên tục nhảy.
3. **Mini Sparkline SVG:**
   - Lưu trữ 60 điểm giá gần nhất trong bộ nhớ (~1 phút giao dịch).
   - Vẽ đường cong mềm mại kèm dải gradient phát sáng ở điểm giá hiện tại.
4. **Phần trăm biến động phiên (Session Change):**
   - Tính toán chính xác theo công thức: `((price - initialPrice) / initialPrice) * 100`.
   - Ghi rõ nhãn "Session Change (Khởi chạy)", phân biệt rõ ràng với 24h change.
5. **Cảnh báo độ trễ & Mất kết nối (Stale Detection):**
   - Đọc trường `updateAt` từ server:
     - Dưới 5 giây: Nhãn `LIVE` xanh.
     - Trên 5 giây: Nhãn vàng cảnh báo chậm trễ.
     - Trên 15 giây: Nhãn đỏ cảnh báo mất dữ liệu / pipeline có vấn đề.
   - Khi backend mất kết nối: Giữ nguyên dữ liệu hiển thị cuối cùng, hiển thị banner kết nối lại kèm nút "Thử lại".
6. **Responsive Design:**
   - Màn hình Desktop/Tablet: Bảng tỷ giá đầy đủ thông số và sparkline.
   - Màn hình Mobile (<768px): Tự động chuyển thành các Card thẻ giao dịch gọn gàng, không bị tràn cuộn ngang.
7. **Tìm kiếm & Sắp xếp:**
   - Ô tìm kiếm nhanh theo tên mã (BTC, ETH, SOL, BNB, XRP).
   - Lựa chọn sắp xếp theo giá cao/thấp hoặc % biến động.

---

## 🐳 Triển khai với Docker & Nginx

### Build Docker Image:

```bash
docker build -t market-web:latest .
```

### Chạy Container:

```bash
docker run -d -p 3000:80 --name market-web market-web:latest
```

File cấu hình `nginx.conf` đã bao gồm nén Gzip, cache file tĩnh và reverse proxy `/api/` trỏ tới `market-read-service:8082`.
