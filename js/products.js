// products.js - Ürün listeleme ve filtreleme işlevleri

// Örnek ürün veritabanı
const productDatabase = {
    getProducts: function(count = 50, filters = {}) {
        const allProducts = generateSampleProducts(count);
        
        // Filtreleme
        return allProducts.filter(product => {
            if (filters.category && product.category !== filters.category) return false;
            if (filters.minPrice && product.price < filters.minPrice) return false;
            if (filters.maxPrice && product.price > filters.maxPrice) return false;
            if (filters.brand && product.brand !== filters.brand) return false;
            if (filters.color && product.color !== filters.color) return false;
            if (filters.discountOnly && product.discount === 0) return false;
            if (filters.inStockOnly && product.stock === 0) return false;
            
            return true;
        });
    },
    
    getProductById: function(id) {
        const products = generateSampleProducts(50);
        return products.find(p => p.id === parseInt(id)) || null;
    },
    
    getCategories: function() {
        return [
            { id: 'spor', name: 'Spor Ayakkabı', count: 15, icon: 'fa-running' },
            { id: 'erkek', name: 'Erkek Ayakkabı', count: 12, icon: 'fa-male' },
            { id: 'bot', name: 'Bot', count: 8, icon: 'fa-boot' },
            { id: 'kadin', name: 'Kadın Ayakkabı', count: 10, icon: 'fa-female' },
            { id: 'cocuk', name: 'Çocuk Ayakkabı', count: 8, icon: 'fa-child' },
            { id: 'terlik', name: 'Terlik & Sandalet', count: 7, icon: 'fa-socks' }
        ];
    },
    
    getBrands: function() {
        return ['Nike', 'Adidas', 'Puma', 'New Balance', 'Reebok', 'Converse', 'Vans'];
    },
    
    getColors: function() {
        return ['Siyah', 'Beyaz', 'Mavi', 'Kırmızı', 'Gri', 'Kahverengi', 'Yeşil'];
    }
};

// URL parametrelerini oku
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        category: params.get('kategori'),
        search: params.get('q'),
        minPrice: params.get('min'),
        maxPrice: params.get('max'),
        brand: params.get('marka'),
        color: params.get('renk'),
        sort: params.get('siralama') || 'popular'
    };
}

// Ürünleri sırala
function sortProducts(products, sortBy) {
    const sorted = [...products];
    
    switch(sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'discount':
            return sorted.sort((a, b) => b.discount - a.discount);
        case 'new':
            return sorted.sort((a, b) => b.isNew - a.isNew);
        default:
            return sorted.sort((a, b) => b.ratingCount - a.ratingCount); // Popüler
    }
}

// Sayfalama sistemi
class Pagination {
    constructor(items, itemsPerPage = 12) {
        this.items = items;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.totalPages = Math.ceil(items.length / itemsPerPage);
    }
    
    getCurrentPageItems() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.items.slice(start, end);
    }
    
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            return true;
        }
        return false;
    }
    
    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            return true;
        }
        return false;
    }
    
    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            return true;
        }
        return false;
    }
    
    getPaginationInfo() {
        return {
            current: this.currentPage,
            total: this.totalPages,
            items: this.items.length,
            start: (this.currentPage - 1) * this.itemsPerPage + 1,
            end: Math.min(this.currentPage * this.itemsPerPage, this.items.length)
        };
    }
}

// Ürün listeleme sayfası için
if (document.querySelector('.products-page')) {
    document.addEventListener('DOMContentLoaded', function() {
        const params = getUrlParams();
        
        // Ürünleri filtrele
        const filters = {
            category: params.category,
            minPrice: params.minPrice ? parseFloat(params.minPrice) : null,
            maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : null,
            brand: params.brand,
            color: params.color
        };
        
        let products = productDatabase.getProducts(50, filters);
        
        // Arama filtrelemesi
        if (params.search) {
            const searchTerm = params.search.toLowerCase();
            products = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.brand.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
            
            // Arama terimini göster
            const searchInfo = document.getElementById('searchInfo');
            if (searchInfo) {
                searchInfo.textContent = `"${params.search}" için ${products.length} sonuç bulundu`;
            }
        }
        
        // Sıralama
        products = sortProducts(products, params.sort);
        
        // Sayfalama
        const pagination = new Pagination(products);
        displayProductsPage(pagination);
        
        // Sıralama değişikliği
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.value = params.sort;
            sortSelect.addEventListener('change', function() {
                const url = new URL(window.location);
                url.searchParams.set('siralama', this.value);
                window.location.href = url.toString();
            });
        }
        
        // Sayfalama kontrolleri
        setupPaginationControls(pagination);
    });
}

function displayProductsPage(pagination) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    const products = pagination.getCurrentPageItems();
    const info = pagination.getPaginationInfo();
    
    // Ürünleri göster
    productsGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    // Sayfalama bilgisini güncelle
    const pageInfo = document.getElementById('pageInfo');
    if (pageInfo) {
        pageInfo.textContent = `${info.start}-${info.end} / ${info.items} ürün`;
    }
}

function setupPaginationControls(pagination) {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageNumbers = document.querySelector('.page-numbers');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (pagination.prevPage()) {
                displayProductsPage(pagination);
                updatePaginationUI(pagination);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (pagination.nextPage()) {
                displayProductsPage(pagination);
                updatePaginationUI(pagination);
            }
        });
    }
    
    updatePaginationUI(pagination);
}

function updatePaginationUI(pagination) {
    const info = pagination.getPaginationInfo();
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageNumbers = document.querySelector('.page-numbers');
    
    // Önceki/Sonraki butonlarını güncelle
    if (prevBtn) prevBtn.disabled = info.current === 1;
    if (nextBtn) nextBtn.disabled = info.current === info.total;
    
    // Sayfa numaralarını güncelle
    if (pageNumbers) {
        pageNumbers.innerHTML = '';
        
        const maxPages = 5;
        let startPage = Math.max(1, info.current - Math.floor(maxPages / 2));
        let endPage = Math.min(info.total, startPage + maxPages - 1);
        
        if (endPage - startPage + 1 < maxPages) {
            startPage = Math.max(1, endPage - maxPages + 1);
        }
        
        // İlk sayfa
        if (startPage > 1) {
            const firstPage = document.createElement('button');
            firstPage.className = 'page-btn';
            firstPage.textContent = '1';
            firstPage.addEventListener('click', () => {
                pagination.goToPage(1);
                displayProductsPage(pagination);
                updatePaginationUI(pagination);
            });
            pageNumbers.appendChild(firstPage);
            
            if (startPage > 2) {
                const dots = document.createElement('span');
                dots.className = 'page-dots';
                dots.textContent = '...';
                pageNumbers.appendChild(dots);
            }
        }
        
        // Sayfa numaraları
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${i === info.current ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                pagination.goToPage(i);
                displayProductsPage(pagination);
                updatePaginationUI(pagination);
            });
            pageNumbers.appendChild(pageBtn);
        }
        
        // Son sayfa
        if (endPage < info.total) {
            if (endPage < info.total - 1) {
                const dots = document.createElement('span');
                dots.className = 'page-dots';
                dots.textContent = '...';
                pageNumbers.appendChild(dots);
            }
            
            const lastPage = document.createElement('button');
            lastPage.className = 'page-btn';
            lastPage.textContent = info.total;
            lastPage.addEventListener('click', () => {
                pagination.goToPage(info.total);
                displayProductsPage(pagination);
                updatePaginationUI(pagination);
            });
            pageNumbers.appendChild(lastPage);
        }
    }
}
