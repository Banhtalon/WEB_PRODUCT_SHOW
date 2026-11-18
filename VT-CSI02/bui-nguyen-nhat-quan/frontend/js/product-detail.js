let currentProduct = null;
const API_BASE = "http://127.0.0.1:8001";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const icons = {
    laptop: "💻",
    phone: "📱",
    headphone: "🎧",
    keyboard: "⌨️",
    mouse: "🖱️"
};

const labels = {
    cpu: "CPU",
    processor: "Bộ xử lý",
    ram: "RAM",
    storage: "Bộ nhớ",
    ssd: "SSD",
    screen: "Màn hình",
    display: "Màn hình",
    battery: "Pin",
    battery_life: "Thời lượng pin",
    connection: "Kết nối",
    connectivity: "Kết nối",
    dpi: "DPI",
    switch: "Switch",
    switch_type: "Loại switch",
    layout: "Layout"
};

function formatPrice(price) {
    return typeof price === "number"
        ? price.toLocaleString("vi-VN") + "đ"
        : "Liên hệ";
}

function showError(message) {
    const errorBox = document.getElementById("error-message");

    errorBox.textContent = message;
    errorBox.classList.remove("d-none");
}

// Hiển thị thông số dưới dạng bảng
function showSpecifications(product) {
    const container = document.getElementById("product-specs");

    const specs = { ...product.specifications };

    // Hỗ trợ các trường thông số nằm trực tiếp trong Firestore
    for (const key of Object.keys(labels)) {
        if (product[key] != null && specs[key] == null) {
            specs[key] = product[key];
        }
    }

    const table = document.createElement("table");
    table.className = "table table-bordered bg-white";

    const tbody = document.createElement("tbody");

    for (const [key, value] of Object.entries(specs)) {
        if (value == null || value === "") continue;

        const row = document.createElement("tr");

        const labelCell = document.createElement("th");
        labelCell.textContent = labels[key] || key;
        labelCell.style.width = "40%";

        const valueCell = document.createElement("td");
        valueCell.textContent = String(value);

        row.append(labelCell, valueCell);
        tbody.appendChild(row);
    }

    if (tbody.children.length === 0) {
        container.textContent = "Chưa có thông số kỹ thuật.";
        return;
    }

    table.appendChild(tbody);
    container.appendChild(table);
}

// Hiển thị sản phẩm
function renderProduct(product) {
    currentProduct = product;
    
    const addButton = document.getElementById("add-to-cart");
    addButton.disabled = Number(product.stock) <= 0;

    document.title = `${product.name} - TechZone AI`;

    document.getElementById("product-brand").textContent =
        product.brand || "";

    document.getElementById("product-name").textContent =
        product.name || "Sản phẩm";

    document.getElementById("product-price").textContent =
        formatPrice(product.price);

    document.getElementById("product-description").textContent =
        product.description || "Chưa có mô tả sản phẩm.";

    const stock = document.getElementById("product-stock");
    const quantity = Number(product.stock || 0);

    stock.textContent = quantity > 0
        ? `Còn ${quantity} sản phẩm`
        : "Tạm hết hàng";

    stock.className = quantity > 0
        ? "text-success fw-semibold"
        : "text-danger fw-semibold";

    // Hình ảnh sản phẩm
    const image = document.getElementById("product-image");
    const icon = document.getElementById("product-icon");

    icon.textContent = icons[product.category] || "📦";

    const imageUrl = product.image || product.image_url;

    if (
        typeof imageUrl === "string" &&
        /^https:\/\//i.test(imageUrl)
    ) {
        image.onload = () => {
            image.classList.remove("d-none");
            icon.classList.add("d-none");
        };

        image.onerror = () => {
            image.classList.add("d-none");
            icon.classList.remove("d-none");
        };

        image.src = imageUrl;
    }

    showSpecifications(product);

    document.getElementById("product-detail")
        .classList.remove("d-none");
}

// Tải dữ liệu từ backend
async function loadProduct() {
    try {
        if (!productId) {
            throw new Error("Không tìm thấy mã sản phẩm.");
        }

        const response = await fetch(
            `${API_BASE}/products/${encodeURIComponent(productId)}`
        );

        if (!response.ok) {
            throw new Error("Không tìm thấy sản phẩm trong cửa hàng.");
        }

        const product = await response.json();
        renderProduct(product);

    } catch (error) {
        showError(error.message);

    } finally {
        document.getElementById("loading")
            .classList.add("d-none");
    }
}


// Thêm sản phẩm vào giỏ hàng
const addButton = document.getElementById("add-to-cart");

addButton.addEventListener("click", function() {
    if (!currentProduct) return;

    if (Number(currentProduct.stock) <= 0) {
        alert("Sản phẩm hiện đã hết hàng.");
        return;
    }

    const cart = getCart();
    const existing = cart.find(
        item => item.id === currentProduct.id
    );

    const currentQuantity = existing ? existing.quantity : 0;

    if (currentQuantity >= Number(currentProduct.stock)) {
        alert("Số lượng trong giỏ đã đạt tồn kho hiện tại.");
        return;
    }

    addToCart(currentProduct.id, 1);

    alert("Đã thêm sản phẩm vào giỏ hàng!");

    window.location.href = "cart.html";
});

loadProduct();
