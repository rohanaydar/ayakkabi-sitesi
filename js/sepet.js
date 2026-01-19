// Sepet sayfası işlevselliği
document.addEventListener('DOMContentLoaded', function() {
    // Sepeti yükle
    loadCart();
    
    // Ödeme butonu
    document.getElementById('checkoutBtn').addEventListener('click', function(e) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            e.preventDefault();
            alert('Sepetiniz boş. Ödeme yapabilmek için sepete ürün ekleyin.');
        }
    });
    
    // Kupon uygulama
    document.getElementById('applyCoupon').addEventListener('click', function() {
        const couponCode = document.getElementById('couponCode').value;
        if (couponCode) {
            applyCoupon(couponCode);
        }
    });
});

// Sepeti yükle
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const emptyCart = document.getElementById('emptyCart');
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartItemsContainer.style.display = 'none';
        updateCartSummary(0, 0);
    } else {
        emptyCart.style.display = 'none';
        cartItemsContainer.style.display = 'block';
        displayCartItems(cart);
        updateCartSummary(calculateSubtotal(cart), calculateShipping(cart));
    }
}

// Sepet öğelerini göster
function displayCartItems(cart) {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    cartItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.setAttribute('data-index', index);
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-meta">
                    <span>Beden: ${item.size || 'Standart'}</span>
                    <span> • Renk: ${item.color || 'Standart'}</span>
                </div>
                <div class="cart-item-price">${(item.price * item.quantity).toFixed(2)} TL</div>
            </div>
            <div class="cart-item-controls">
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus"><i class="fas fa-minus"></i></button>
                    <input type="number" value="${item.quantity}" min="1" max="10" class="quantity-input">
                    <button class="quantity-btn plus"><i class="fas fa-plus"></i></button>
                </div>
                <button class="cart-item-remove">
                    <i class="fas fa-trash"></i> Kaldır
                </button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Miktar değiştirme butonları
    setupQuantityControls();
    
    // Kaldır butonları
    setupRemoveButtons();
}

// Miktar kontrollerini kur
function setupQuantityControls() {
    const minusButtons = document.querySelectorAll('.quantity-btn.minus');
    const plusButtons = document.querySelectorAll('.quantity-btn.plus');
    const quantityInputs = document.querySelectorAll('.quantity-input');
    
    minusButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            updateQuantity(index, -1);
        });
    });
    
    plusButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            updateQuantity(index, 1);
        });
    });
    
    quantityInputs.forEach((input, index) => {
        input.addEventListener('change', function() {
            const newQuantity = parseInt(this.value);
            if (newQuantity >= 1 && newQuantity <= 10) {
                updateQuantity(index, 0, newQuantity);
            }
        });
    });
}

// Kaldır butonlarını kur
function setupRemoveButtons() {
    const removeButtons = document.querySelectorAll('.cart-item-remove');
    
    removeButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            removeFromCart(index);
        });
    });
}

// Miktarı güncelle
function updateQuantity(index, change, newQuantity = null) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (index >= 0 && index < cart.length) {
        if (newQuantity !== null) {
            cart[index].quantity = newQuantity;
        } else {
            cart[index].quantity += change;
            
            if (cart[index].quantity < 1) cart[index].quantity = 1;
            if (cart[index].quantity > 10) cart[index].quantity = 10;
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        updateCartCount();
    }
}

// Sepetten kaldır
function removeFromCart(index) {
    if (confirm('Bu ürünü sepetinizden çıkarmak istediğinize emin misiniz?')) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        updateCartCount();
    }
}

// Ara toplamı hesapla
function calculateSubtotal(cart) {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Kargo ücretini hesapla
function calculateShipping(cart) {
    const subtotal = calculateSubtotal(cart);
    return subtotal >= 150 ? 0 : 25; // 150 TL üzeri ücretsiz kargo
}

// Sepet özetini güncelle
function updateCartSummary(subtotal, shipping) {
    document.getElementById('subtotal').textContent = subtotal.toFixed(2) + ' TL';
    document.getElementById('shipping').textContent = shipping.toFixed(2) + ' TL';
    document.getElementById('total').textContent = (subtotal + shipping).toFixed(2) + ' TL';
}

// Kupon uygula
function applyCoupon(couponCode) {
    // Örnek kupon kodları (gerçek uygulamada sunucudan kontrol edilmeli)
    const coupons = {
        'INDIRIM10': 0.10, // %10 indirim
        'YENI25': 0.25,   // %25 indirim
        'AYAKKABI20': 0.20 // %20 indirim
    };
    
    if (coupons[couponCode]) {
        const discount = coupons[couponCode];
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = calculateSubtotal(cart);
        const shipping = calculateShipping(cart);
        const discountAmount = subtotal * discount;
        const total = (subtotal + shipping) - discountAmount;
        
        // İndirim satırını ekle
        let discountRow = document.querySelector('.summary-row.discount');
        if (!discountRow) {
            discountRow = document.createElement('div');
            discountRow.className = 'summary-row discount';
            const summaryDetails = document.querySelector('.summary-details');
            const totalRow = document.querySelector('.summary-row.total');
            summaryDetails.insertBefore(discountRow, totalRow);
        }
        
        discountRow.innerHTML = `
            <span>İndirim (${couponCode})</span>
            <span>-${discountAmount.toFixed(2)} TL</span>
        `;
        
        // Toplamı güncelle
        document.getElementById('total').textContent = total.toFixed(2) + ' TL';
        
        alert(`${discount * 100}% indirim uygulandı!`);
    } else {
        alert('Geçersiz kupon kodu!');
    }
}
