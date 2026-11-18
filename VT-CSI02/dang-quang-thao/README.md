# 🎓 UniGuide VN — Hệ Thống Học Liệu & Tư Vấn 20 Ngành Đại Học Việt Nam (Đồ Án SPCK CSI02)

Dự án xây dựng cổng tra cứu **20 ngành học đại học trọng điểm tại Việt Nam** tích hợp trợ lý cố vấn học thuật AI **UniBot** sử dụng **Google Gemini (3.1 Flash Lite / 3.5 Flash Lite)** với kỹ thuật **Context Injection** và **System Instruction**.

---

## 📂 Cấu trúc thư mục dự án

```text
SPCK Thao/
├── colab_training/
│   └── build_knowledge_base.ipynb  # File chạy trên Google Colab (10 bước chuẩn CSI02)
├── html_js_web/
│   ├── assets/                     # Bộ ảnh học thuật tạo bằng AI
│   ├── index.html                  # Giao diện trang chủ (Danh sách 20 ngành + Khung Chatbot)
│   ├── style.css                   # Thiết kế học thuật (Academic Editorial, không gradient/tím)
│   ├── script.js                   # Xử lý tìm kiếm, lọc ngành học & kết nối Gemini API
│   └── backend.py                  # Server FastAPI kết nối Python với giao diện HTML
├── streamlit_app/
│   └── app.py                      # Phiên bản giao diện Web bằng Streamlit
└── requirements.txt                # Các thư viện Python cần cài đặt
```

---

## 🚀 Hướng dẫn chạy dự án

### Cách 1: Chạy trực tiếp giao diện Web (`HTML / CSS / JS`)
1. Mở file `html_js_web/index.html` trên trình duyệt (hoặc chạy bằng **Live Server** trong VS Code / Antigravity).
2. Nhấn nút **Cấu hình Gemini API Key** ở góc trên bên phải -> Dán mã `GEMINI_API_KEY` (lấy miễn phí từ [Google AI Studio](https://aistudio.google.com/app/apikey)) -> Nhấn **Kiểm tra & Lưu kết nối**.
3. Tra cứu danh sách 20 ngành học bên trái và đặt câu hỏi trực tiếp cho **UniBot** bên phải.

### Cách 2: Chạy qua Server Python (`FastAPI`)
```powershell
pip install -r requirements.txt
python html_js_web/backend.py
```
Truy cập địa chỉ: `http://127.0.0.1:8000`

### Cách 3: Chạy phiên bản `Streamlit`
```powershell
streamlit run streamlit_app/app.py
```

