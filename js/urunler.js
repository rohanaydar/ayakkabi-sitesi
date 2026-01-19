// Ürünler sayfası işlevselliği
document.addEventListener('DOMContentLoaded', function() {
    // Ürünleri yükle
    loadProducts();
    
    // Filtreleme işlevleri
    setupFilters();
    
    // Sıralama işlevi
    document.getElementById('sort').addEventListener('change', sortProducts);
});

// Ürünleri yükle
function loadProducts() {
    const productsGrid = document.querySelector('.products-grid');
    const productCount = document.getElementById('productCount');
    
    // Örnek ürün verileri (gerçek uygulamada API'den gelecek)
    const products = [
        {
            id: 1,
            name: "Spor Ayakkabı",
            price: 399.99,
            category: "spor",
            image: "images/urunler/spor1.jpg",
            sizes: [36, 37, 38, 39, 40]
        },
        {
            id: 2,
            name: "Klasik Erkek Ayakkabı",
            price: 599.99,
            category: "erkek",
            image: "images/urunler/erkek1.jpg",
            sizes: [40, 41, 42, 43, 44]
        },
        {
            id: 3,
            name: "Kadın Topuklu Ayakkabı",
            price: 499.99,
            category: "kadin",
            image: "images/urunler/kadin1.jpg",
            sizes: [36, 37, 38]
        },
        {
            id: 4,
            name: "Çocuk Spor Ayakkabı",
            price: 299.99,
            category: "cocuk",
            image: "images/urunler/cocuk1.jpg",
            sizes: [28, 29, 30, 31, 32]
        },
        {
            id: 5,
            name: "Koşu Ayakkabısı",
            price: 449.99,
            category: "spor",
            image: "images/urunler/spor2.jpg",
            sizes: [39, 40, 41, 42, 43]
        },
        {
            id: 6,
            name: "Erkek Bot",
            price: 699.99,
            category: "erkek",
            image: "images/urunler/erkek2.jpg",
            sizes: [41, 42, 43, 44]
        },
        {
            id: 7,
            name: "Kadın Babet",
            price: 349.99,
            category: "kadin",
            image: "images/urunler/kadin2.jpg",
            sizes: [36, 37, 38, 39]
        },
        {
            id: 8,
            name: "Çocuk Bot",
            price: 399.99,
            category: "cocuk",
            image: "images/urunler/cocuk2.jpg",
            sizes: [30, 31, 32, 33]
        }
    ];
    
    // Ürünleri göster
    displayProducts(products);
    
    // Ürün sayısını güncelle
    productCount.textContent = products.length;
}

// Ürünleri göster
function displayProducts(products) {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-category', product.category);
        productCard.setAttribute('data-price', product.price);
        
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
        
        productsGrid.appendChild(productCard);
    });
    
    // Sepete ekle butonlarına tıklama
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Filtreleme işlevleri
function setupFilters() {
    // Kategori filtreleri
    const categoryLinks = document.querySelectorAll('.category-filter a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Aktif sınıfını güncelle
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Ürünleri filtrele
            filterProducts();
        });
    });
    
    // Fiyat filtresi
    const priceSlider = document.getElementById('priceRange');
    const maxPriceValue = document.getElementById('maxPriceValue');
    
    priceSlider.addEventListener('input', function() {
        maxPriceValue.textContent = this.value + ' TL';
        filterProducts();
    });
    
    // Beden filtresi
    const sizeButtons = document.querySelectorAll('.size-btn');
    let selectedSizes = [];
    
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const size = this.getAttribute('data-size');
            
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                selectedSizes = selectedSizes.filter(s => s !== size);
            } else {
                this.classList.add('active');
                selectedSizes.push(size);
            }
            
            filterProducts();
        });
    });
    
    // Filtreleri temizle
    document.querySelector('.clear-filters').addEventListener('click', function() {
        // Kategorileri sıfırla
        categoryLinks.forEach(l => {
            l.classList.remove('active');
            if (l.getAttribute('data-category') === 'all') {
                l.classList.add('active');
            }
        });
        
        // Fiyat filtresini sıfırla
        priceSlider.value = 1000;
        maxPriceValue.textContent = '1000 TL';
        
        // Beden filtrelerini sıfırla
        sizeButtons.forEach(btn => btn.classList.remove('active'));
        selectedSizes = [];
        
        // Ürünleri yeniden yükle
        loadProducts();
    });
}

// Ürünleri filtrele
function filterProducts() {
    const activeCategory = document.querySelector('.category-filter a.active').getAttribute('data-category');
    const maxPrice = parseInt(document.getElementById('priceRange').value);
    const selectedSizes = Array.from(document.querySelectorAll('.size-btn.active'))
        .map(btn => parseInt(btn.getAttribute('data-size')));
    
    const productCards = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const price = parseFloat(card.getAttribute('data-price'));
        
        // Filtreleme koşulları
        const categoryMatch = activeCategory === 'all' || category === activeCategory;
        const priceMatch = price <= maxPrice;
        
        // Eğer beden filtresi varsa (gerçek uygulamada ürünün bedenlerini kontrol et)
        let sizeMatch = true;
        if (selectedSizes.length > 0) {
            // Not: Bu örnekte ürün bedenleri yok, gerçek uygulamada kontrol edilmeli
            sizeMatch = true;
        }
        
        // Ürünü göster/gizle
        if (categoryMatch && priceMatch && sizeMatch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Görünen ürün sayısını güncelle
    document.getElementById('productCount').textContent = visibleCount;
}

// Ürünleri sırala
function sortProducts() {
    const sortValue = document.getElementById('sort').value;
    const productsGrid = document.querySelector('.products-grid');
    const productCards = Array.from(productsGrid.querySelectorAll('.product-card'));
    
    productCards.sort((a, b) => {
        const aPrice = parseFloat(a.getAttribute('data-price'));
        const bPrice = parseFloat(b.getAttribute('data-price'));
        const aName = a.querySelector('.product-title').textContent;
        const bName = b.querySelector('.product-title').textContent;
        
        switch(sortValue) {
            case 'price-low':
                return aPrice - bPrice;
            case 'price-high':
                return bPrice - aPrice;
            case 'name-a':
                return aName.localeCompare(bName);
            default:
                return 0;
        }
    });
    
    // Sıralanmış ürünleri yeniden ekle
    productCards.forEach(card => productsGrid.appendChild(card));
}
