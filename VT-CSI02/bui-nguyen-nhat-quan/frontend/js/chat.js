
const API_URL = "http://127.0.0.1:8001/chat";
const PRODUCT_API_URL = "http://127.0.0.1:8001";

// Lấy các thành phần HTML
const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const suggestionButtons = document.querySelectorAll(".suggestion-btn"); 

// Lưu phiên chat trong tab trình duyệt hiện tại
let sessionId = sessionStorage.getItem("techzone_session_id");

// Trạng thái gửi tin nhắn
let dangGui = false;
let deXuatDangCho = null;

// Hàm hiển thị tin nhắn
function hienThiTinNhan(noiDung, nguoiGui) {
    const message = document.createElement("div");
    message.className = `message ${nguoiGui}`;

    const content = document.createElement("div");
    content.className = "message-content";

    // Dùng textContent để hiển thị nội dung an toàn
    content.textContent = noiDung;

    // Giữ các dấu xuống dòng trong phản hồi AI
    content.style.whiteSpace = "pre-line";

    message.appendChild(content);
    chatMessages.appendChild(message);

    // Tự động cuộn xuống tin nhắn mới nhất
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return message;
}



function hienThiSanPham(danhSach) {
    if (!Array.isArray(danhSach) || danhSach.length === 0) {
        return;
    }

    const container = document.createElement("div");
    container.className = "product-results";

    const icons = {
        laptop: "💻",
        phone: "📱",
        headphone: "🎧",
        keyboard: "⌨️",
        mouse: "🖱️"
    };

    // Chọn thông số theo loại sản phẩm
    function layThongSo(sp) {
        const specs = sp.specifications || {};

        function giaTri(...keys) {
            for (const key of keys) {
                const value = sp[key] ?? specs[key];
                if (value !== undefined && value !== null && value !== "") {
                    return String(value);
                }
            }
            return "";
        }

        switch (sp.category) {
            case "laptop":
                return [
                    giaTri("cpu", "processor"),
                    giaTri("ram"),
                    giaTri("storage", "ssd")
                ];

            case "phone":
                return [
                    giaTri("screen", "display"),
                    giaTri("ram"),
                    giaTri("storage")
                ];

            case "headphone":
                return [
                    giaTri("connection", "connectivity"),
                    giaTri("battery", "battery_life")
                ];

            case "keyboard":
                return [
                    giaTri("switch", "switch_type"),
                    giaTri("layout"),
                    giaTri("connection")
                ];

            case "mouse":
                return [
                    giaTri("dpi"),
                    giaTri("connection", "connectivity"),
                    giaTri("battery")
                ];

            default:
                return [];
        }
    }

    danhSach.forEach(function(sp) {
        const card = document.createElement("article");
        card.className = "product-chat-card";

        // Hình ảnh
        const imageBox = document.createElement("div");
        imageBox.className = "product-chat-image";

        const imageUrl = sp.image || sp.image_url;

        if (
            typeof imageUrl === "string" &&
            /^https:\/\//i.test(imageUrl)
        ) {
            const img = document.createElement("img");
            img.src = imageUrl;
            img.alt = sp.name || "Sản phẩm";
            img.loading = "lazy";

            img.onerror = function() {
                imageBox.textContent = icons[sp.category] || "📦";
            };

            imageBox.appendChild(img);
        } else {
            imageBox.textContent = icons[sp.category] || "📦";
        }

        // Nội dung
        const info = document.createElement("div");
        info.className = "product-chat-info";

        const category = document.createElement("span");
        category.className = "product-chat-category";
        category.textContent = sp.brand || sp.category || "Công nghệ";

        const name = document.createElement("h6");
        name.textContent = sp.name || "Sản phẩm";

        const price = document.createElement("div");
        price.className = "product-chat-price";

        price.textContent = typeof sp.price === "number"
            ? sp.price.toLocaleString("vi-VN") + "đ"
            : "Liên hệ";

        const specs = document.createElement("p");
        specs.className = "product-chat-specs";

        specs.textContent = layThongSo(sp)
            .filter(Boolean)
            .join(" · ");

        const stock = document.createElement("small");
        stock.className = "product-chat-stock";
        stock.textContent = `Còn ${sp.stock ?? 0} sản phẩm`;

        
        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-outline-primary btn-sm product-detail-btn";
        button.textContent = "Xem chi tiết";

        button.disabled = !sp.id;

        button.addEventListener("click", function() {
            if (!sp.id) return;

            const url = `product-detail.html?id=${encodeURIComponent(sp.id)}`;

            window.location.href = url;
        });


        info.append(category, name, price);

        if (specs.textContent) {
            info.appendChild(specs);
        }

        info.append(stock, button);
        card.append(imageBox, info);
        container.appendChild(card);
    });

    chatMessages.appendChild(container);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// Vô hiệu hóa đề xuất cũ khi khách gửi tin nhắn mới
function voHieuHoaDeXuatCu() {
    if (!deXuatDangCho) return;

    deXuatDangCho.status.textContent =
        "Đề xuất đã hết hiệu lực vì bạn gửi tin nhắn mới.";

    deXuatDangCho.confirmButton.disabled = true;
    deXuatDangCho.cancelButton.disabled = true;

    deXuatDangCho = null;
}


// Hiển thị đề xuất thêm sản phẩm vào giỏ hàng
function hienThiDeXuatGioHang(action) {
    if (!action || !action.id) return;

    const card = document.createElement("div");
    card.className = "card border-primary shadow-sm mt-3";

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h6");
    title.className = "fw-bold";
    title.textContent = "🛒 Đề xuất thêm vào giỏ hàng";

    const name = document.createElement("p");
    name.className = "mb-1";
    name.textContent = action.name || "Sản phẩm";

    const quantity = document.createElement("p");
    quantity.className = "mb-1";
    quantity.textContent =
        `Số lượng: ${action.quantity}`;

    const price = document.createElement("p");
    price.className = "text-primary fw-bold mb-2";
    price.textContent =
        Number(action.price).toLocaleString("vi-VN") + "đ";

    const status = document.createElement("p");
    status.className = "small text-muted mb-3";
    status.textContent =
        "Bạn có muốn thêm sản phẩm này vào giỏ hàng không?";

    const confirmButton = document.createElement("button");
    confirmButton.type = "button";
    confirmButton.className = "btn btn-primary btn-sm me-2";
    confirmButton.textContent = "Xác nhận";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "btn btn-outline-secondary btn-sm";
    cancelButton.textContent = "Hủy";

    body.append(
        title,
        name,
        quantity,
        price,
        status,
        confirmButton,
        cancelButton
    );

    card.appendChild(body);
    chatMessages.appendChild(card);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    deXuatDangCho = {
        status,
        confirmButton,
        cancelButton
    };

    // Khách chọn hủy
    cancelButton.addEventListener("click", function() {
        status.textContent = "Bạn đã hủy đề xuất thêm sản phẩm.";
        confirmButton.disabled = true;
        cancelButton.disabled = true;
        deXuatDangCho = null;
    });

    // Khách xác nhận thêm vào giỏ
    confirmButton.addEventListener("click", async function() {

        confirmButton.disabled = true;
        cancelButton.disabled = true;

        try {
            // Kiểm tra cart.js đã được tải chưa
            if (
                typeof getCart !== "function" ||
                typeof addToCart !== "function"
            ) {
                throw new Error(
                    "Không tìm thấy chức năng giỏ hàng."
                );
            }

            // Lấy thông tin mới nhất từ Firebase
            const response = await fetch(
                `${PRODUCT_API_URL}/products/${encodeURIComponent(action.id)}`
            );

            if (!response.ok) {
                throw new Error(
                    "Sản phẩm không còn tồn tại."
                );
            }

            const product = await response.json();

            const stock = Number(product.stock) || 0;
            const soLuongThem = Number(action.quantity) || 1;

            // Kiểm tra số lượng hiện có trong giỏ
            const cart = getCart();

            const sanPhamTrongGio = cart.find(
                item => String(item.id) === String(action.id)
            );

            const soLuongHienTai = sanPhamTrongGio
                ? Number(sanPhamTrongGio.quantity) || 0
                : 0;

            // Kiểm tra tồn kho
            if (stock <= 0) {
                throw new Error(
                    "Sản phẩm hiện đã hết hàng."
                );
            }

            if (soLuongThem + soLuongHienTai > stock) {
                throw new Error(
                    `Không đủ hàng. Hiện còn ${stock} sản phẩm, `
                    + `trong giỏ đã có ${soLuongHienTai} sản phẩm.`
                );
            }

            // Thêm vào giỏ hàng
            const thanhCong = addToCart(
                String(action.id),
                soLuongThem
            );

            if (!thanhCong) {
                throw new Error(
                    "Không thể thêm sản phẩm vào giỏ hàng."
                );
            }

            status.textContent =
                "✓ Đã thêm sản phẩm vào giỏ hàng thành công!";

            status.className =
                "small text-success fw-bold mb-0";

            confirmButton.remove();
            cancelButton.remove();

            deXuatDangCho = null;

        } catch (error) {
            status.textContent = error.message;
            status.className = "small text-danger mb-3";

            confirmButton.disabled = false;
            cancelButton.disabled = false;

            console.error("Lỗi thêm giỏ hàng:", error);
        }
    });
}

// Hàm gửi tin nhắn đến FastAPI

async function guiTinNhan(noiDung) {
    noiDung = noiDung.trim();

    if (!noiDung || dangGui) {
        return;
    }
    voHieuHoaDeXuatCu();

    dangGui = true;
    sendButton.disabled = true;
    messageInput.disabled = true;

    // Hiển thị tin nhắn người dùng
    hienThiTinNhan(noiDung, "user");
    messageInput.value = "";

    // Hiển thị trạng thái chờ
    const loading = hienThiTinNhan(
        "TechZone AI đang trả lời...",
        "bot"
    );

    try {
        // Hàm gửi yêu cầu đến FastAPI
        async function goiChat(id) {
            return fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: noiDung,
                    session_id: id
                })
            });
        }

        // Gửi tin nhắn
        let response = await goiChat(sessionId);

        // Nếu phiên cũ không tồn tại, tạo phiên mới
        if (response.status === 404 && sessionId) {
            sessionId = null;
            sessionStorage.removeItem("techzone_session_id");

            response = await goiChat(null);
        }

        // Đọc kết quả
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                typeof data.detail === "string"
                    ? data.detail
                    : "Không thể gửi tin nhắn."
            );
        }

        // Lưu session ID mới
        sessionId = data.session_id;
        sessionStorage.setItem(
            "techzone_session_id",
            sessionId
        );

        // Xóa trạng thái chờ
        loading.remove();

        // Hiển thị câu trả lời
        hienThiTinNhan(data.reply, "bot");

        // Hiển thị thẻ sản phẩm
        hienThiSanPham(data.products);
        
        // Hiển thị đề xuất thêm vào giỏ hàng
        hienThiDeXuatGioHang(data.cart_action);

    } catch (error) {
        loading.remove();

        console.error("Lỗi chatbot:", error);

        hienThiTinNhan(
            "Xin lỗi, mình chưa thể trả lời. Bạn hãy thử lại nhé!",
            "bot"
        );

    } finally {
        dangGui = false;
        sendButton.disabled = false;
        messageInput.disabled = false;
        messageInput.focus();
    }
}


// Sự kiện nhấn nút Gửi hoặc Enter
chatForm.addEventListener("submit", function(event) {
    event.preventDefault();

    guiTinNhan(messageInput.value);
});

// Sự kiện nhấn các nút gợi ý
suggestionButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const noiDung = button.dataset.message;
        guiTinNhan(noiDung);
    });
});
