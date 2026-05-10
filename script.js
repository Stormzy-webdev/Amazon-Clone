const products = [
  {
    id: 1,
    title: 'Wireless Noise Cancelling Headphones',
    category: 'Electronics',
    price: 89.99,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'Smart Watch Series Active',
    category: 'Electronics',
    price: 129.99,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'Classic Cotton Hoodie',
    category: 'Fashion',
    price: 34.99,
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    title: 'Leather Everyday Backpack',
    category: 'Fashion',
    price: 59.99,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    title: 'Modern Table Lamp',
    category: 'Home',
    price: 42.5,
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6,
    title: 'Non-Stick Cookware Set',
    category: 'Home',
    price: 78,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 7,
    title: 'Atomic Habits - Paperback',
    category: 'Books',
    price: 15.99,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 8,
    title: 'The Pragmatic Programmer',
    category: 'Books',
    price: 24.99,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80'
  }
];

const categoryGrid = document.getElementById('categoryGrid');
const productGrid = document.getElementById('productGrid');
const resultsText = document.getElementById('resultsText');
const cartCount = document.getElementById('cartCount');
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartPanel = document.getElementById('cartPanel');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const subtotal = document.getElementById('subtotal');
const clearCartBtn = document.getElementById('clearCartBtn');
const categoryFilter = document.getElementById('categoryFilter');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const themeToggle = document.getElementById('themeToggle');
const shopNowBtn = document.getElementById('shopNowBtn');
const menuBtn = document.getElementById('menuBtn');
const navMiddle = document.getElementById('navMiddle');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let searchTerm = '';

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function getCategories() {
  return [...new Set(products.map((product) => product.category))];
}

function renderCategories() {
  categoryGrid.innerHTML = '';

  getCategories().forEach((category) => {
    const card = document.createElement('article');
    card.className = 'category-card';
    card.innerHTML = `<h3>${category}</h3><p>Explore top ${category.toLowerCase()} picks</p>`;
    categoryGrid.appendChild(card);

    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function getFilteredProducts() {
  const selectedCategory = categoryFilter.value;
  const sortValue = sortSelect.value;

  let list = [...products];

  if (selectedCategory !== 'all') {
    list = list.filter((product) => product.category === selectedCategory);
  }

  if (searchTerm.trim()) {
    list = list.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (sortValue === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (sortValue === 'rating-high') {
    list.sort((a, b) => b.rating - a.rating);
  }

  return list;
}

function renderProducts() {
  const list = getFilteredProducts();
  productGrid.innerHTML = '';

  resultsText.textContent = `${list.length} product(s) found`;

  if (list.length === 0) {
    productGrid.innerHTML = '<p class="empty-state">No products found. Try another search.</p>';
    return;
  }

  list.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <p>${product.category}</p>
      <div class="meta">
        <span class="price">$${product.price.toFixed(2)}</span>
        <span class="rating">Rating ${product.rating}</span>
      </div>
      <button data-id="${product.id}">Add to Cart</button>
    `;

    productGrid.appendChild(card);
  });
}

function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    const product = products.find((item) => item.id === productId);
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-state">Your cart is empty.</p>';
  }

  let totalItems = 0;
  let totalAmount = 0;

  cart.forEach((item) => {
    totalItems += item.qty;
    totalAmount += item.price * item.qty;

    const cartItem = document.createElement('article');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <h4>${item.title}</h4>
      <div class="item-row">
        <p>Qty: ${item.qty}</p>
        <p>$${(item.price * item.qty).toFixed(2)}</p>
      </div>
      <button data-remove-id="${item.id}">Remove</button>
    `;
    cartItems.appendChild(cartItem);
  });

  cartCount.textContent = totalItems;
  subtotal.textContent = `$${totalAmount.toFixed(2)}`;
}

function toggleCart(isOpen) {
  cartPanel.classList.toggle('open', isOpen);
  overlay.classList.toggle('show', isOpen);
}

function applyTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  document.body.classList.toggle('dark', theme === 'dark');
  themeToggle.textContent = theme === 'dark' ? 'Light' : 'Dark';
}

productGrid.addEventListener('click', (event) => {
  const id = Number(event.target.dataset.id);
  if (id) {
    addToCart(id);
  }
});

cartItems.addEventListener('click', (event) => {
  const id = Number(event.target.dataset.removeId);
  if (id) {
    removeFromCart(id);
  }
});

cartBtn.addEventListener('click', () => toggleCart(true));
closeCartBtn.addEventListener('click', () => toggleCart(false));
overlay.addEventListener('click', () => toggleCart(false));

clearCartBtn.addEventListener('click', () => {
  cart = [];
  saveCart();
  renderCart();
});

categoryFilter.addEventListener('change', renderProducts);
sortSelect.addEventListener('change', renderProducts);

searchBtn.addEventListener('click', () => {
  searchTerm = searchInput.value;
  renderProducts();
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchTerm = searchInput.value;
    renderProducts();
  }
});

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
  applyTheme();
});

shopNowBtn.addEventListener('click', () => {
  document.querySelector('.products').scrollIntoView({ behavior: 'smooth' });
});

menuBtn.addEventListener('click', () => {
  navMiddle.classList.toggle('open');
});

renderCategories();
renderProducts();
renderCart();
applyTheme();
