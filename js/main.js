// Kral Sneaker - Ana JavaScript Dosyası

// Global değişkenler
let cart = JSON.parse(localStorage.getItem('kralSneakerCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('kralSneakerWishlist')) || [];

// DOM yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    console.log('Kral Sneaker yüklendi! 👑');
    
    // Temel işlevleri başlat
    initMobileMenu();
    initHeroSlider();
    initProductFilters();
    initBackToTop();
    updateCartCount();
    loadFlashProducts();
    loadFeaturedProducts();
    
    // WhatsApp ve Instagram butonları
    initFloatingButtons();
    
    // Promo timer
    initPromoTimer();
    
    // Newsletter form
    initNewsletter();
    
    // Testimonial slider
    initTestimonialSlider();
});

// ===== MOBILE MENU =====
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            mobileMenuOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Mobile search
    const mobileSearchBtn = document.querySelector('.mobile-search button');
    if (mobileSearchBtn) {
        mobileSearchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const searchInput = document.querySelector('.mobile-search input');
            if (searchInput.value.trim()) {
                window.location.href = `urunler.html?q=${encodeURIComponent(searchInput.value)}`;
            }
        });
    }
}

function closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    
    mobileMenu.classList.remove('active');
    mobileMenuOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ===== HERO SLIDER =====
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Slider'ı başlat
    showSlide(currentSlide);
    
    // Otomatik slider
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Önceki butonu
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            clearInterval(slideInterval);
            prevSlide();
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
    
    // Sonraki butonu
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            clearInterval(slideInterval);
            nextSlide();
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
    
    // Noktalar (dots)
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            clearInterval(slideInterval);
            currentSlide = index;
            showSlide(currentSlide);
            slideInterval = setInterval(nextSlide, 5000);
        });
    });
    
    // Fare slider üzerine gelince durdur
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        heroSlider.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 5000));
    }
    
    function showSlide(index) {
        // Tüm slaytları gizle
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Tüm noktaları pasif yap
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Aktif slaytı göster
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }
}

// ===== FLASH PRODUCTS =====
function loadFlashProducts() {
    const flashContainer = document.querySelector('.flash-products');
    if (!flashContainer) return;
    
    // Örnek flash ürünler
    const flashProducts = [
        {
            id: 101,
            name: "Nike Air Max",
            price: 799.99,
            oldPrice: 1199.99,
            discount: 33,
            image: "images/products/flash1.jpg",
            category: "spor",
            rating: 4.5,
            stock: 15
        },
        {
            id: 102,
            name: "Adidas Ultraboost",
            price: 899.99,
            oldPrice: 1299.99,
            discount: 31,
            image: "images/products/flash2.jpg",
            category: "spor",
            rating: 4.8,
            stock: 8
        },
        {
            id: 103,
            name: "Erkek Deri Bot",
            price: 599.99,
            oldPrice: 899.99,
            discount: 33,
            image: "images/products/flash3.jpg",
            category: "bot",
            rating: 4.3,
            stock: 12
        },
        {
            id: 104,
            name: "Çocuk Spor Ayakkabı",
            price: 299.99,
            oldPrice: 449.99,
            discount: 33,
            image: "images/products/flash4.jpg",
            category: "cocuk",
            rating: 4.6,
            stock: 20
        }
    ];
    
    // Flash ürünleri göster
    flashProducts.forEach(product => {
        const productCard = createProductCard(product, true);
        flashContainer.appendChild(productCard);
    });
}

// ===== FEATURED PRODUCTS =====
function loadFeaturedProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!productsGrid) return;
    
    // 50 örnek ürün oluştur
    const allProducts = generateSampleProducts(50);
    let displayedProducts = 12; // İlk yüklemede gösterilecek ürün sayısı
    let currentFilter = 'all';
    
    // İlk ürünleri göster
    displayProducts(allProducts.slice(0, displayedProducts));
    updateLoadMoreButton();
    
    // Filtre butonları
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Aktif butonu güncelle
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.dataset.filter;
            displayedProducts = 12;
            
            // Filtrele
            const filteredProducts = filterProducts(allProducts, currentFilter);
            displayProducts(filteredProducts.slice(0, displayedProducts));
            updateLoadMoreButton(filteredProducts.length);
        });
    });
    
    // Görünüm değiştirme
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            productsGrid.className = `products-grid ${view}-view`;
        });
    });
    
    // Daha fazla yükle butonu
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            displayedProducts += 12;
            const filteredProducts = filterProducts(allProducts, currentFilter);
            displayProducts(filteredProducts.slice(0, displayedProducts));
            updateLoadMoreButton(filteredProducts.length);
        });
    }
    
    function displayProducts(products) {
        productsGrid.innerHTML = '';
        products.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }
    
    function filterProducts(products, filter) {
        if (filter === 'all') return products;
        
        return products.filter(product => {
            if (filter === 'indirim') return product.discount > 0;
            if (filter === 'yeni') return product.isNew;
            return product.category === filter;
        });
    }
    
    function updateLoadMoreButton(total = allProducts.length) {
        if (!loadMoreBtn) return;
        
        const remaining = total - displayedProducts;
        if (remaining <= 0) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.innerHTML = `<i class="fas fa-plus"></i> Daha Fazla Ürün Göster (${displayedProducts}/${total})`;
        }
    }
}

// Örnek ürünler oluştur
function generateSampleProducts(count) {
    const brands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Reebok', 'Converse', 'Vans'];
    const categories = ['spor', 'erkek', 'bot', 'kadin', 'cocuk', 'terlik'];
    const colors = ['Siyah', 'Beyaz', 'Mavi', 'Kırmızı', 'Gri', 'Kahverengi'];
    
    const products = [];
    
    for (let i = 1; i <= count; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const basePrice = Math.floor(Math.random() * 400) + 200; // 200-600 TL
        const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 40) + 10 : 0; // %10-50 indirim
        const price = discount > 0 ? basePrice * (1 - discount/100) : basePrice;
        
        products.push({
            id: i,
            name: `${brand} ${getProductNameByCategory(category)} ${color}`,
            price: parseFloat(price.toFixed(2)),
            oldPrice: discount > 0 ? basePrice : null,
            discount: discount,
            image: `images/products/product${(i % 20) + 1}.jpg`,
            category: category,
            color: color,
            brand: brand,
            rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0-5.0
            ratingCount: Math.floor(Math.random() * 100) + 10,
            stock: Math.floor(Math.random() * 50) + 5,
            isNew: Math.random() > 0.7,
            description: `${color} renkli, ${brand} marka ${category} ayakkabı. Yüksek kalite ve konfor.`
        });
    }
    
    return products;
}

function getProductNameByCategory(category) {
    const names = {
        'spor': 'Spor Ayakkabı',
        'erkek': 'Erkek Ayakkabısı',
        'bot': 'Bot',
        'kadin': 'Kadın Ayakkabısı',
        'cocuk': 'Çocuk Ayakkabısı',
        'terlik': 'Terlik'
    };
    return names[category] || 'Ayakkabı';
}

// Ürün kartı oluştur
function createProductCard(product, isFlash = false) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.dataset.category = product.category;
    
    let badge = '';
    if (product.discount > 0) {
        badge = `<span class="product-badge">-%${product.discount}</span>`;
    } else if (product.isNew) {
        badge = `<span class="product-badge" style="background-color: var(--accent-green);">Yeni</span>`;
    }
    
    const oldPrice = product.oldPrice ? 
        `<span class="old-price">${product.oldPrice.toFixed(2)} TL</span>` : '';
    
    const ratingStars = generateStarRating(product.rating);
    
    card.innerHTML = `
        ${badge}
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">
                <span class="current-price">${product.price.toFixed(2)} TL</span>
                ${oldPrice}
            </div>
            <div class="product-rating">
                ${ratingStars}
                <span class="rating-count">(${product.ratingCount})</span>
            </div>
            <div class="product-actions">
                <button class="action-btn add-to-cart" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Sepete Ekle
                </button>
                <button class="action-btn add-to-wishlist" data-id="${product.id}">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            ${isFlash ? `<div class="stock-info">Son ${product.stock} ürün!</div>` : ''}
        </div>
    `;
    
    // Sepete ekle butonu
    const addToCartBtn = card.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        addToCart(product.id);
    });
    
    // Favorilere ekle butonu
    const wishlistBtn = card.querySelector('.add-to-wishlist');
    wishlistBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleWishlist(product.id);
        updateWishlistButton(this, product.id);
    });
    
    // Ürün detayına git
    card.addEventListener('click', function(e) {
        if (!e.target.closest('button')) {
            window.location.href = `urun-detay.html?id=${product.id}`;
        }
    });
    
    return card;
}

// Yıldız rating oluştur
function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// ===== SEPET İŞLEMLERİ =====
function addToCart(productId, quantity = 1, size = 'M', color = 'Standart') {
    // Ürün bilgilerini al (gerçek uygulamada API'den gelecek)
    const product = getProductById(productId);
    
    if (!product) {
        showNotification('Ürün bulunamadı!', 'error');
        return;
    }
    
    // Sepette var mı kontrol et
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity,
            size: size,
            color: color,
            maxStock: product.stock || 10
        });
    }
    
    // Sepeti kaydet
    localStorage.setItem('kralSneakerCart', JSON.stringify(cart));
    
    // Sepet sayacını güncelle
    updateCartCount();
    
    // Bildirim göster
    showNotification(`${product.name} sepete eklendi!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('kralSneakerCart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.maxStock || 10));
        localStorage.setItem('kralSneakerCart', JSON.stringify(cart));
        updateCartCount();
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// ===== FAVORİ İŞLEMLERİ =====
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    
    if (index === -1) {
        wishlist.push(productId);
        showNotification('Favorilere eklendi!', 'success');
    } else {
        wishlist.splice(index, 1);
        showNotification('Favorilerden çıkarıldı!', 'info');
    }
    
    localStorage.setItem('kralSneakerWishlist', JSON.stringify(wishlist));
}

function updateWishlistButton(button, productId) {
    const isInWishlist = wishlist.includes(productId);
    
    if (isInWishlist) {
        button.innerHTML = '<i class="fas fa-heart"></i>';
        button.style.color = 'var(--accent-red)';
    } else {
        button.innerHTML = '<i class="far fa-heart"></i>';
        button.style.color = '';
    }
}

// ===== ÜRÜN BULMA =====
function getProductById(productId) {
    // Örnek ürünler (gerçek uygulamada API'den gelecek)
    const sampleProducts = generateSampleProducts(1);
    sampleProducts[0].id = productId;
    return sampleProducts[0];
}

// ===== FİLTRELEME =====
function initProductFilters() {
    const searchForm = document.querySelector('.search-bar form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input[type="text"]');
            if (searchInput.value.trim()) {
                window.location.href = `urunler.html?q=${encodeURIComponent(searchInput.value)}`;
            }
        });
    }
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== FLOATING BUTTONS =====
function initFloatingButtons() {
    // WhatsApp butonu
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            // Gerçek WhatsApp numarası buraya gelecek
            const phone = '905551234567';
            const message = 'Merhaba, Kral Sneaker hakkında bilgi almak istiyorum.';
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        });
    }
    
    // Instagram butonu
    const instagramBtn = document.querySelector('.instagram-btn');
    if (instagramBtn) {
        instagramBtn.addEventListener('click', function(e) {
            window.open('https://instagram.com/kralsneaker', '_blank');
        });
    }
}

// ===== PROMO TIMER =====
function initPromoTimer() {
    const timerElement = document.getElementById('promoTimer');
    if (!timerElement) return;
    
    // 3 saatlik timer
    let timeLeft = 3 * 60 * 60; // 3 saat saniye cinsinden
    
    function updateTimer() {
        if (timeLeft <= 0) {
            timerElement.textContent = 'Süre Doldu!';
            return;
        }
        
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        
        timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeLeft--;
    }
    
    // Her saniye güncelle
    updateTimer();
    setInterval(updateTimer, 1000);
}

// ===== NEWSLETTER =====
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!validateEmail(email)) {
            showNotification('Lütfen geçerli bir e-posta adresi giriniz.', 'error');
            return;
        }
        
        // Burada API'ye gönderim yapılacak
        console.log('Newsletter aboneliği:', email);
        
        // Başarılı mesajı
        showNotification('Bülten aboneliğiniz başarıyla gerçekleşti!', 'success');
        emailInput.value = '';
    });
}

// ===== TESTIMONIAL SLIDER =====
function initTestimonialSlider() {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (!testimonialSlider) return;
    
    // Responsive için herhangi bir ek işlem gerekmiyor
    // CSS grid ile hallediliyor
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = 'info') {
    // Bildirim container'ını kontrol et
    let notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 300px;
        `;
        document.body.appendChild(notificationContainer);
    }
    
    // Bildirim oluştur
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        background: ${type === 'success' ? 'var(--accent-green)' : 
                     type === 'error' ? 'var(--accent-red)' : 
                     'var(--primary-color)'};
        color: white;
        padding: 15px 20px;
        border-radius: var(--radius-sm);
        margin-bottom: 10px;
        box-shadow: var(--shadow-lg);
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    // İkon seç
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    // Bildirimi ekle
    notificationContainer.appendChild(notification);
    
    // 5 saniye sonra kaldır
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Animasyonlar için CSS ekle
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== PERFORMANS OPTİMİZASYONU =====
// Resimler için lazy loading
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Sayfa yükleme animasyonu
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    initLazyLoading();
});
