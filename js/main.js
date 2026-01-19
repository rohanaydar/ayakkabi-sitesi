// Sepet işlevselliği
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Ürün verileri (gerçek uygulamada bir API'den gelecek)
const products = [
    {
        id: 1,
        name: "Spor Ayakkabı",
        price: 399.99,
        category: "spor",
        image: "images/urunler/spor1.jpg"
    },
    {
        id: 2,
        name: "Klasik Erkek Ayakkabı",
        price: 599.99,
        category: "erkek",
        image: "images/urunler/erkek1.jpg"
    },
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
    }
];

// DOM yüklendiğinde çalışacak
document.addEventListener('DOMContentLoaded', function() {
    // Sepet sayısını güncelle
    updateCartCount();
    
    // Popüler ürünleri göster
    if (document.querySelector('.product-grid')) {
        displayFeaturedProducts();
    }
    
    // Mobil menü
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.style.display = mainNav.style.display === 'block' ? 'none' : 'block';
        });
    }
});

// Popüler ürünleri göster
function displayFeaturedProducts() {
    const productGrid = document.querySelector('.product-grid');
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price.toFixed(2)} TL</p>
                <button class="add-to-cart" data-id="${product.id}">Sepete Ekle</button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Sepete ekle butonlarına tıklama
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Sepete ürün ekle
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // Ürün sepette var mı kontrol et
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        // Sepeti localStorage'a kaydet
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Sepet sayısını güncelle
        updateCartCount();
        
        // Kullanıcıya bildirim göster
        alert(`${product.name} sepete eklendi!`);
    }
}

// Sepet sayısını güncelle
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}
