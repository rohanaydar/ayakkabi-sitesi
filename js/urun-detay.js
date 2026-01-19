// Ürün detay sayfası işlevselliği
document.addEventListener('DOMContentLoaded', function() {
    // URL'den ürün ID'sini al
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || '1';
    
    // Ürün verilerini yükle
    loadProductDetails(productId);
    
    // Resim galerisi
    setupImageGallery();
    
    // Miktar seçici
    setupQuantitySelector();
    
    // Tab yönetimi
    setupTabs();
    
    // Sepete ekle butonu
    document.querySelector('.add-to-cart-btn').addEventListener('click', function() {
        const productId = parseInt(this.getAttribute('data-product-id'));
        const size = document.getElementById('size').value;
        const quantity = parseInt(document.getElementById('quantity').value);
        
        if (!size) {
            alert('Lütfen bir beden seçiniz.');
            return;
        }
        
        addToCart(productId, size, quantity);
    });
});

// Ürün detaylarını yükle
function loadProductDetails(productId) {
    // Örnek ürün verileri (gerçek uygulamada API'den gelecek)
    const products = {
        '1': {
            id: 1,
            name: "Spor Ayakkabı",
            price: 399.99,
            oldPrice: 499.99,
            discount: 20,
            category: "spor",
            images: [
                "images/urunler/spor1-large.jpg",
                "images/urunler/spor1-thumb1.jpg",
                "images/urunler/spor1-thumb2.jpg",
                "images/urunler/spor1-thumb3.jpg",
                "images/urunler/spor1-thumb4.jpg"
            ],
            description: "Bu spor ayakkabısı, günlük kullanım için ideal olup hem konfor hem de şıklık sunar.",
            features: [
                "%100 Nefes Alabilen Kumaş",
                "Hafif ve Esnek Taban",
                "Kaymaz Taban",
                "Yıkanabilir"
            ],
            sizes: [36, 37, 38, 39, 40, 41, 42],
            colors: ["siyah", "beyaz", "mavi"],
            rating: 4.5,
            reviewCount: 24
        },
        '2': {
            id: 2,
            name: "Klasik Erkek Ayakkabı",
            price: 599.99,
            oldPrice: 749.99,
            discount: 20,
            category: "erkek",
            images: [
                "images/urunler/erkek1-large.jpg",
                "images/urunler/erkek1-thumb1.jpg",
                "images/urunler/erkek1-thumb2.jpg",
                "images/urunler/erkek1-thumb3.jpg",
                "images/urunler/erkek1-thumb4.jpg"
            ],
            description: "Bu klasik erkek ayakkabısı, şıklık ve konforu bir araya getiriyor.",
            features: [
                "%100 Gerçek Deri",
                "Hafif ve Esnek Taban",
                "Nefes Alabilen Astar",
                "Su Geçirmez"
            ],
            sizes: [40, 41, 42, 43, 44],
            colors: ["siyah", "kahverengi", "bordo"],
            rating: 4.5,
            reviewCount: 24
        }
    };
    
    const product = products[productId] || products['1'];
    
    // Ürün bilgilerini güncelle
    document.querySelector('.product-title').textContent = product.name;
    document.querySelector('.current-price').textContent = product.price.toFixed(2) + ' TL';
    document.querySelector('.old-price').textContent = product.oldPrice ? product.oldPrice.toFixed(2) + ' TL' : '';
    document.querySelector('.discount').textContent = product.discount ? '%' + product.discount : '';
    
    // Resimleri güncelle
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage && product.images && product.images.length > 0) {
        mainImage.src = product.images[0];
        mainImage.alt = product.name;
    }
    
    // Boyut seçeneklerini doldur
    const sizeSelect = document.getElementById('size');
    sizeSelect.innerHTML = '<option value="">Beden Seçiniz</option>';
    
    product.sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeSelect.appendChild(option);
    });
    
    // Benzer ürünleri yükle
    loadSimilarProducts(product.category, product.id);
}

// Resim galerisi kurulumu
function setupImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainImage');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Aktif sınıfını güncelle
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Ana resmi değiştir
            if (this.src) {
                mainImage.src = this.src.replace('-thumb', '-large');
            }
        });
    });
}

// Miktar seçici
function setupQuantitySelector() {
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const quantityInput = document.getElementById('quantity');
    
    minusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });
    
    plusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value < 10) {
            quantityInput.value = value + 1;
        }
    });
    
    quantityInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (value < 1) this.value = 1;
        if (value > 10) this.value = 10;
    });
}

// Tab yönetimi
function setupTabs() {
    const tabHeaders = document.querySelectorAll('.tab-header');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Aktif sınıflarını güncelle
            tabHeaders.forEach(h => h.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Yıldız değerlendirmesi
    const ratingStars = document.querySelectorAll('.rating-stars i');
    ratingStars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });
        
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            setRating(rating);
        });
    });
    
    // Fare ayrıldığında mevcut derecelendirmeyi geri yükle
    document.querySelector('.rating-stars').addEventListener('mouseleave', function() {
        const currentRating = parseInt(document.querySelector('.rating-stars').getAttribute('data-current-rating') || '0');
        highlightStars(currentRating);
    });
}

// Yıldızları vurgula
function highlightStars(rating) {
    const stars = document.querySelectorAll('.rating-stars i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas', 'active');
        } else {
            star.classList.remove('fas', 'active');
            star.classList.add('far');
        }
    });
}

// Derecelendirme ayarla
function setRating(rating) {
    document.querySelector('.rating-stars').setAttribute('data-current-rating', rating);
    highlightStars(rating);
}

// Benzer ürünleri yükle
function loadSimilarProducts(category, excludeId) {
    // Örnek benzer ürünler (gerçek uygulamada API'den gelecek)
    const similarProducts = [
        {
            id: 3,
            name: "Kadın Topuklu Ayakkabı",
            price: 499.99,
            category: "kadin",
            image: "images/urunler/kadin1.jpg"
        },
        {
            id: 4,
            name: "Çocuk Spor Ayakkabı",
            price: 299.99,
            category: "cocuk",
            image: "images/urunler/cocuk1.jpg"
        },
        {
            id: 5,
            name: "Koşu Ayakkabısı",
            price: 449.99,
            category: "spor",
            image: "images/urunler/spor2.jpg"
        },
        {
            id: 6,
            name: "Erkek Bot",
            price: 699.99,
            category: "erkek",
            image: "images/urunler/erkek2.jpg"
        }
    ];
    
    // Aynı kategorideki ürünleri filtrele (mevcut ürün hariç)
    const filteredProducts = similarProducts.filter(p => 
        p.category === category && p.id !== excludeId
    );
    
    // Eğer aynı kategoride yeterli ürün yoksa, diğer ürünleri ekle
    if (filteredProducts.length < 2) {
        const otherProducts = similarProducts.filter(p => 
            p.category !== category && p.id !== excludeId
        ).slice(0, 4 - filteredProducts.length);
        
        filteredProducts.push(...otherProducts);
    }
    
    // Benzer ürünleri göster
    const productGrid = document.querySelector('.related-products .product-grid');
    if (productGrid) {
        productGrid.innerHTML = '';
        
        filteredProducts.slice(0, 4).forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <a href="urun-detay.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="product-img">
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-price">${product.price.toFixed(2)} TL</p>
                        <button class="add-to-cart" data-id="${product.id}">Sepete Ekle</button>
                    </div>
                </a>
            `;
            
            productGrid.appendChild(productCard);
        });
        
        // Sepete ekle butonlarına tıklama
        const addToCartButtons = productGrid.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);
            });
        });
    }
}
