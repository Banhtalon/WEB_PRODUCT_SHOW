
const CART_KEY = "techzone_cart";
const API_BASE_URL = "http://127.0.0.1:8001";

function getCart() {
    try {
        const data = JSON.parse(localStorage.getItem(CART_KEY));
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
    if (!productId || !Number.isInteger(quantity) || quantity < 1) {
        return false;
    }

    const cart = getCart();
    const item = cart.find(p => p.id === productId);

    if (item) {
        item.quantity += quantity;
    } else {
        cart.push({ id: productId, quantity });
    }

    saveCart(cart);
    return true;
}

function updateCartQuantity(productId, quantity) {
    const cart = getCart();

    if (quantity <= 0) {
        saveCart(cart.filter(p => p.id !== productId));
    } else {
        const item = cart.find(p => p.id === productId);
        if (!item) return;
        item.quantity = quantity;
        saveCart(cart);
    }
}

function removeFromCart(productId) {
    saveCart(getCart().filter(p => p.id !== productId));
}

function formatCurrency(value) {
    return Number(value).toLocaleString("vi-VN") + "đ";
}

async function loadCart() {
    const container = document.getElementById("cart-items");
    if (!container) return;

    const totalElement = document.getElementById("cart-total");
    const countElement = document.getElementById("cart-count");
    const cart = getCart();

    container.replaceChildren();
    totalElement.textContent = "0đ";
    countElement.textContent = "0";

    if (cart.length === 0) {
        container.textContent = "Giỏ hàng của bạn đang trống.";
        return;
    }

    container.textContent = "Đang tải giỏ hàng...";

    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error("Không tải được sản phẩm.");

        const data = await response.json();
        const products = new Map(
            data.products.map(product => [product.id, product])
        );

        container.replaceChildren();
        let total = 0;
        let count = 0;

        for (const item of cart) {
            const product = products.get(item.id);

            if (!product) {
                const warning = document.createElement("p");
                warning.textContent =
                    `Sản phẩm ${item.id} không còn tồn tại.`;
                container.appendChild(warning);
                continue;
            }

            const stock = Number(product.stock) || 0;
            const quantity = Math.min(item.quantity, stock);
            const price = Number(product.price) || 0;

            const row = document.createElement("div");
            row.className = "cart-item border rounded-3 p-3 mb-3 bg-white";

            const name = document.createElement("h6");
            name.className = "fw-bold";
            name.textContent = product.name;

            const priceText = document.createElement("p");
            priceText.className = "text-primary mb-2";
            priceText.textContent = formatCurrency(price);

            const stockText = document.createElement("small");
            stockText.className = "d-block text-muted mb-2";
            stockText.textContent = `Tồn kho: ${stock}`;

            const controls = document.createElement("div");
            controls.className = "d-flex align-items-center gap-2 flex-wrap";

            const quantityInput = document.createElement("input");
            quantityInput.type = "number";
            quantityInput.min = "1";
            quantityInput.max = String(Math.max(stock, 1));
            quantityInput.value = String(quantity);
            quantityInput.className = "form-control";
            quantityInput.style.width = "85px";
            quantityInput.disabled = stock === 0;

            quantityInput.addEventListener("change", () => {
                const requested = Number(quantityInput.value);

                if (!Number.isInteger(requested) || requested < 1) {
                    quantityInput.value = String(quantity);
                    return;
                }

                updateCartQuantity(
                    item.id,
                    Math.min(requested, stock)
                );
                loadCart();
            });

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "btn btn-outline-danger btn-sm";
            removeButton.textContent = "Xóa";

            removeButton.addEventListener("click", () => {
                removeFromCart(item.id);
                loadCart();
            });

            controls.append(quantityInput, removeButton);
            row.append(name, priceText, stockText, controls);

            if (stock === 0) {
                const notice = document.createElement("p");
                notice.className = "text-danger mt-2 mb-0";
                notice.textContent = "Sản phẩm đang hết hàng.";
                row.appendChild(notice);
            } else if (quantity !== item.quantity) {
                const notice = document.createElement("p");
                notice.className = "text-warning mt-2 mb-0";
                notice.textContent =
                    "Số lượng trong giỏ vượt tồn kho hiện tại.";
                row.appendChild(notice);
            }

            container.appendChild(row);

            total += price * quantity;
            count += quantity;
        }

        totalElement.textContent = formatCurrency(total);
        countElement.textContent = String(count);

    } catch (error) {
        container.textContent =
            "Không tải được giỏ hàng. Hãy kiểm tra FastAPI.";
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", loadCart);
