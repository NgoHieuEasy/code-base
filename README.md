

```markdown
# 🌍 Quy Trình Tự Động Hóa Đa Ngôn Ngữ (React i18n + AI)

Dự án này tích hợp hệ thống tự động hóa dịch thuật 100%. Lập trình viên chỉ cần tập trung viết Code,
hệ thống sẽ tự động quét, phân loại và dịch thuật sang nhiều ngôn ngữ khác nhau.

---

## 🚀 Tính Năng Chính

* **Tự động quét (Glob Scanning):** Tự động lùng sục mọi file `.tsx` trong thư mục `src/` để tìm kiếm hàm `t()`.
* **Phân cấp chuyên nghiệp (Nesting):** Hỗ trợ Key dạng dấu chấm (`homepage.header.title`) để tạo cấu trúc JSON gọn gàng, dễ quản lý.
* **AI Translation:** Tích hợp Google Translate API để tự động dịch từ tiếng Anh sang Tiếng Việt, Hàn, Trung, Thổ Nhĩ Kỳ...
* **Làm sạch dữ liệu (Auto-Cleaning):** Tự động chuyển đổi các Key kỹ thuật như `welcome_title` thành văn bản tự nhiên `welcome title` trước khi dịch.
* **Tự động hóa hoàn toàn (Husky):** Tự động cập nhật bản dịch ngay khi thực hiện `git commit`.

---

## 🛠 Cách Thức Hoạt Động

Hệ thống là sự kết hợp của 3 công nghệ then chốt:

### 1. Script Quét & Dịch (`auto-translate.cjs`)
Sử dụng thư viện **Glob** để tìm file và **Regex** để trích xuất Key. Script sẽ thực hiện một "Deep Merge"
để biến các chuỗi Key phẳng thành các Object lồng nhau trong file JSON đầu ra.

### 2. Husky (Git Hooks)
Husky đóng vai trò là "người gác cổng". Mỗi khi bạn thực hiện commit:
1. Husky gọi lệnh dịch.
2. Script quét toàn bộ code hiện tại.
3. Nếu có Key mới, AI sẽ dịch và ghi vào file JSON.
4. Lệnh `git add` được thực thi tự động để thêm các file JSON vào commit.

### 3. Tối ưu hóa Bản dịch
Script có cơ chế **Incremental Update**: Chỉ dịch những Key mới hoặc Key chưa có nội dung.
Nếu bạn đã sửa bản dịch thủ công trong file JSON, script sẽ tôn trọng và không ghi đè lên nội dung đó.

---

## 📖 Hướng Dẫn Sử Dụng

### 1. Cách viết Code
Sử dụng hàm `t()` với Key tiếng Anh phân cấp bởi dấu chấm. Nên dùng dấu gạch dưới `_` thay cho khoảng trắng trong Key:

```tsx
// Trong bất kỳ file .tsx nào
<h1>{t('homepage.welcome_header')}</h1>
<button>{t('common.button.submit_form')}</button>

```

### 2. Cách chạy lệnh thủ công

Để kiểm tra hoặc cập nhật bản dịch mà không cần commit:

```bash
npm run translate

```

### 3. Quy trình Commit tự động

Bạn chỉ việc làm việc bình thường, mọi thứ đã có Husky lo:

```bash
git add .
git commit -m "feat: thêm giao diện Header và các nút bấm"

```

*(Lúc này script dịch sẽ tự chạy và cập nhật các file JSON trong thư mục `public/locales/`)*.

---

## 📁 Cấu Trúc File Ngôn Ngữ (Output)

Hệ thống sẽ tự động tạo ra cấu trúc phân cấp như sau:

```json
{
  "homepage": {
    "welcome_header": "Chào mừng bạn"
  },
  "common": {
    "button": {
      "submit_form": "Gửi biểu mẫu"
    }
  }
}

```

---

## ⚙️ Cấu Hình Kỹ Thuật

Dự án sử dụng các thư viện chính sau:

* `react-i18next`: Thư viện lõi đa ngôn ngữ.
* `google-translate-api-x`: API dịch thuật AI.
* `glob`: Quét file hệ thống.
* `husky`: Tự động hóa Git Hooks.

---

*Phát triển bởi dự án Đa ngôn ngữ Tự động*

```
