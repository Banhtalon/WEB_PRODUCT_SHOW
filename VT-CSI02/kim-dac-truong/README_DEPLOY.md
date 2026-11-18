# LDBot – phiên bản đã chỉnh sửa để chạy và deploy

## Đã sửa / bổ sung

- Giao diện tiếng Việt giữ chủ đề Lamar Davis; bỏ công tắc Mock Mode và API key khỏi trang khách.
- Website và API chạy trên **cùng một origin**; JavaScript gọi `/api/...`, không dùng `127.0.0.1` cố định.
- Backend tự đọc `.env`; API chỉ dùng `GEMINI_API_KEY` phía server.
- Chống tình trạng Gemini trả `200 null`; trả lỗi rõ ràng, không hiển thị stack trace/secret.
- Chat trả `ordered_items` kiểm tra danh sách món; AI chỉ gợi ý thêm vào giỏ, **không tự tạo đơn**.
- 12 món được giữ lại; **giá VND được thêm để minh họa** trong `menu.csv`, không phải báo giá thật.
- Giỏ hàng tăng/giảm số lượng, tính tiền, checkout có tên/số điện thoại, tạo đơn thật trong SQLite.
- `/admin` có xác thực HTTP Basic, cho xem và thay đổi trạng thái đơn.
- Có `/api/health`, `.gitignore`, `.env.example`, `render.yaml` và chỉ dẫn dưới đây.

## A. Chạy trên Windows (làm từng bước)

1. Giải nén ZIP thành thư mục, ví dụ `D:\LDBot_Deploy_Ready`. **Không chép đè lên dự án cũ**; giữ bản backup.
2. Mở VS Code vào thư mục mới. Mở Terminal PowerShell trong thư mục mới.
3. Tạo môi trường ảo bằng Python 3.12:

   ```powershell
   py -3.12 -m venv .venv
   .\.venv\Scripts\Activate.ps1
   python -m pip install -r requirements.txt
   ```

   Nếu bị chặn chạy script, trong Terminal đó chạy: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned`, rồi activate lại.

4. Sao chép file mẫu thành `.env`:

   ```powershell
   Copy-Item .env.example .env
   ```

   Mở `.env` và sửa:
   - `DEMO_MODE=true` để thử mà không cần API Key; phản hồi sẽ ghi rõ **Demo AI**.
   - Muốn dùng Gemini thật: tạo API Key tại AI Studio, điền `GEMINI_API_KEY=...`, đặt `DEMO_MODE=false`.
   - Đổi `ADMIN_PASSWORD` thành mật khẩu mạnh, riêng của bạn. **Không bao giờ upload `.env` lên GitHub**.

5. Chạy:

   ```powershell
   python -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
   ```

6. Dùng trình duyệt mở **http://127.0.0.1:8000/** (không cần Live Server), thử 12 món và giỏ hàng.
7. Gửi đơn tại Checkout. Mở **http://127.0.0.1:8000/admin** và đăng nhập bằng `ADMIN_USERNAME`/`ADMIN_PASSWORD` để kiểm tra đơn vừa lưu.
8. Xem API tại **http://127.0.0.1:8000/docs**, trạng thái tại `/api/health`.
9. Database tạo tự động tại `data/restaurant.db`. Sao lưu file này nếu muốn giữ đơn đã tạo.

## B. Deploy Render từng bước

**Bản demo nhanh**: một Web Service của Render phục vụ cả HTML + API + quản trị. Có thể bắt đầu bằng Free nếu còn được cung cấp theo tài khoản. **Trên Free, SQLite không được lưu bền vững:** dữ liệu đặt món có thể mất khi service restart/redeploy. Không sử dụng như hệ thống nhận đơn thật cho nhà hàng khi chưa có lưu trữ bền vững. Render Free cũng có thể ngủ khi không có truy cập.

1. Tạo một repository **private** trên GitHub, ví dụ `ldbot-demo`.
2. Trong repo, chọn **Add file → Upload files**. Upload **các file bên trong thư mục `LDBot_Deploy_Ready`** (`app.py`, `admin.html`, `index.html`, `menu.csv`, `config.json`, `requirements.txt`, `render.yaml`, `.python-version`, `.env.example`, `.gitignore`, `README_DEPLOY.md`). **Không upload `.env`, `.venv`, `data/` hoặc file `.db`.** Nếu giao diện web bỏ qua file bắt đầu dấu chấm, tạo các file đó qua GitHub → Add file → Create new file, hoặc dùng git CLI.
3. Mở https://dashboard.render.com/ → **New → Web Service**.
4. Kết nối GitHub, chọn repository `ldbot-demo` và nhánh `main`.
5. Cấu hình: Language/Runtime `Python 3`; Root Directory để trống; Build Command `pip install -r requirements.txt`; Start Command `uvicorn app:app --host 0.0.0.0 --port $PORT`.
6. Trong **Environment**, khai báo:
   - `GEMINI_API_KEY` = khóa Gemini THẬT, không phải `YOUR_ACTUAL...`. Có thể bỏ trống nếu dùng demo.
   - `GEMINI_MODEL` = `gemini-2.5-flash`
   - `DEMO_MODE` = `false` khi thử Gemini thật; đặt `true` để demo ngay nếu chưa có API Key hợp lệ.
   - `ADMIN_USERNAME` = `admin`
   - `ADMIN_PASSWORD` = mật khẩu mạnh của riêng bạn.
   - `PYTHON_VERSION` = `3.12.8` (nếu cần và được hỗ trợ).
7. Chọn gói theo nhu cầu (Free nếu đang khả dụng cho demo) và bấm **Create Web Service / Deploy**.
8. Trong tab Events/Logs, chờ thông báo deploy thành công. Mở URL `https://<ten-service>.onrender.com/` do Render cấp, **không tự đoán URL**.
9. Kiểm tra lần lượt `/<trang-chu>`, `/api/health`, `/api/menu`, chat AI, giỏ hàng, đặt món, `/admin`. Trình duyệt có thể yêu cầu tài khoản khi mở `/admin`.
10. Khi sửa code: cập nhật repository (commit/push); Render sẽ tự deploy nếu bật Auto-Deploy.

### Muốn giữ SQLite qua lần deploy/restart

Trên Render, cần **dịch vụ trả phí có persistent disk** và đặt mount path ví dụ `/var/data`, sau đó khai báo environment `DATA_DIR=/var/data`. Chỉ dữ liệu dưới mount path mới giữ bền vững. Hoặc chuyển sang database như PostgreSQL qua hệ thống phù hợp. Nếu vẫn dùng Free, đừng tin SQLite là lưu đơn vĩnh viễn.

## C. Một số lỗi thường gặp

- `API_KEY_INVALID`: Khóa Gemini bị Google từ chối; tạo/chọn lại khóa tại Google AI Studio, cập nhật `GEMINI_API_KEY` trong Render Environment, deploy/restart lại. `Key loaded: True` không chứng minh khóa hợp lệ.
- Chat hiển thị `AI chưa cấu hình`: điền đúng API Key hoặc đặt `DEMO_MODE=true` cho **demo mô phỏng**.
- `ModuleNotFoundError`: cài lại `pip install -r requirements.txt` và đúng `.venv`.
- Deploy thành công nhưng trang không lên: kiểm tra Start Command dùng `--host 0.0.0.0 --port $PORT`, và `index.html` ở thư mục gốc repo.
- `503` ở `/admin`: chưa thiết lập `ADMIN_PASSWORD` trên server.
- Đơn bị mất trên Free: do hệ thống file tạm, chuyển sang persistent disk/database phù hợp.

## D. Những giới hạn còn lại

- Giá trong CSV là **giá demo do người chỉnh sửa bổ sung**; thay bằng giá chính thức trước khi dùng thật.
- Không có cổng thanh toán, xác nhận bếp tự động, email/SMS, chống spam chuyên sâu hoặc hệ thống phân quyền đa cấp.
- Xác thực quản trị bằng Basic Auth chỉ phù hợp MVP/demo trên HTTPS; dùng hệ thống xác thực đầy đủ trước khi triển khai thương mại.
- Backend không tự kiểm tra được API Key Gemini khi chưa có request AI. Kiểm tra thủ công bằng một câu hỏi thật.
- Đơn hàng công khai có thể bị tạo bởi người truy cập; với sản phẩm thật phải bổ sung giới hạn tốc độ, xác minh, quy trình vận hành, chính sách dữ liệu cá nhân.
