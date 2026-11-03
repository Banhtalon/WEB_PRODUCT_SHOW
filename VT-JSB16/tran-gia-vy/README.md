# VietNews — Website Tin Tức bằng HTML & CSS Thuần

## Giới thiệu
**VietNews** là website tin tức có giao diện hiện đại, được xây dựng hoàn toàn bằng **HTML5** và **CSS3 thuần** (không sử dụng framework như Bootstrap hay backend Python/Flask), dễ dàng mở trực tiếp trên trình duyệt hoặc qua Live Server trong Visual Studio Code.

## Tính năng nổi bật
- **Trang chủ (`index.html`)**:
  - Khu vực Hero nổi bật kèm thanh tìm kiếm và bài viết tâm điểm.
  - **Bộ lọc danh mục bằng CSS thuần** (`Tất cả`, `Công nghệ`, `Du lịch`, `Giáo dục`, `Khoa học`, `Thể thao`, `Đời sống`) sử dụng kỹ thuật `input[type="radio"]:checked`.
  - Lưới 6 bài viết chọn lọc được bố cục bằng **CSS Grid** và **Flexbox**.
- **Trang chi tiết bài viết (`articles/article-1.html` → `article-6.html`)**:
  - Hiển thị đầy đủ nội dung từng bài viết, thông tin tác giả, ngày đăng và danh sách **bài viết liên quan**.
- **Trang gửi tin cộng đồng (`submit.html`)**:
  - Biểu mẫu gửi bài viết có kiểm tra dữ liệu đầu vào bằng HTML5 (`required`, `maxlength`, `type="url"`) và hiển thị thông báo gửi thành công bằng `:target` thuần CSS.
- **Giao diện Responsive**:
  - Tương thích hoàn toàn với máy tính, máy tính bảng và điện thoại (menu thu gọn mở/đóng bằng CSS Checkbox).

## Cấu trúc thư mục
```text
VietNews_Website/
├── index.html                  # Trang chủ (Bài nổi bật, lọc danh mục, danh sách tin tức)
├── submit.html                 # Trang biểu mẫu gửi tin tức cộng đồng
├── 404.html                    # Trang thông báo lỗi 404
├── README.md                   # Tài liệu hướng dẫn dự án
├── css/
│   └── style.css               # Tập tin định kiểu CSS thuần (Variables, Grid, Flexbox, Responsive)
└── articles/                   # Thư mục các trang chi tiết bài viết
    ├── article-1.html          # Bài 1 (Công nghệ): Trí tuệ nhân tạo đang thay đổi cách chúng ta học tập và làm việc
    ├── article-2.html          # Bài 2 (Đời sống): Những thói quen nhỏ giúp xây dựng lối sống xanh mỗi ngày
    ├── article-3.html          # Bài 3 (Giáo dục): Học tập chủ động: Bí quyết ghi nhớ kiến thức lâu hơn
    ├── article-4.html          # Bài 4 (Thể thao): Vận động mỗi ngày: Bắt đầu từ những mục tiêu vừa sức
    ├── article-5.html          # Bài 5 (Du lịch): Khám phá vẻ đẹp thiên nhiên qua những chuyến đi có trách nhiệm
    └── article-6.html          # Bài 6 (Khoa học): Vì sao việc tìm hiểu khoa học từ những câu hỏi nhỏ rất quan trọng?
```

## Cách chạy dự án
1. Mở thư mục `VietNews_Website` trong **Visual Studio Code**.
2. Nhấn đúp vào tệp `index.html` để mở trực tiếp trên trình duyệt, hoặc nhấn chuột phải vào `index.html` chọn **Open with Live Server**.
