const products = [
  {
    id: 1,
    title: 'Wireless Noise Cancelling Headphones',
    category: 'Electronics',
    price: 89.99,
    rating: 4.6,
    image: 'resources/headphones.jpg'
  },
  {
    id: 2,
    title: 'Smart Watch Series Active',
    category: 'Electronics',
    price: 129.99,
    rating: 4.3,
    image: 'resources/smartwatch.jpg'
  },
  {
    id: 3,
    title: 'Classic Cotton Hoodie',
    category: 'Fashion',
    price: 34.99,
    rating: 4.2,
    image: 'resources/hoodie.jpg'
  },
  {
    id: 4,
    title: 'Leather Everyday Backpack',
    category: 'Fashion',
    price: 59.99,
    rating: 4.5,
    image: 'resources/backpack.jpg'
  },
  {
    id: 5,
    title: 'Modern Table Lamp',
    category: 'Home',
    price: 42.5,
    rating: 4.1,
    image: 'resources/lamp.jpg'
  },
  {
    id: 6,
    title: 'Non-Stick Cookware Set',
    category: 'Home',
    price: 78,
    rating: 4.4,
    image: 'resources/cookware.jpg'
  },
  {
    id: 7,
    title: 'Atomic Habits - Paperback',
    category: 'Books',
    price: 15.99,
    rating: 4.9,
    image: 'resources/atomic habits.jpg'
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
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterBtn = document.getElementById('filterBtn');
const filterMenu = document.getElementById('filterMenu');
const filterDropdown = document.getElementById('filterDropdown');
const themeToggle = document.getElementById('themeToggle');
const shopNowBtn = document.getElementById('shopNowBtn');
const menuBtn = document.getElementById('menuBtn');
const navMiddle = document.getElementById('navMiddle');
const cartToast = document.getElementById('cartToast');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let searchTerm = '';
let selectedCategory = 'All';
let toastTimeoutId;
const randFormatter = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR'
});

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
  });
}

function renderFilterMenu() {
  const categories = ['All', ...getCategories()];
  filterMenu.innerHTML = '';

  categories.forEach((category) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'filter-option';
    option.textContent = category;
    option.dataset.category = category;
    filterMenu.appendChild(option);
  });
}

function getFilteredProducts() {
  let list = [...products];

  if (selectedCategory !== 'All') {
    list = list.filter((product) => product.category === selectedCategory);
  }

  if (searchTerm.trim()) {
    list = list.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
        <span class="price">${randFormatter.format(product.price)}</span>
        <span class="rating">Rating ${product.rating}</span>
      </div>
      <button data-id="${product.id}">Add to Cart</button>
    `;

    productGrid.appendChild(card);
  });
}

function showCartToast(message) {
  cartToast.textContent = message;
  cartToast.classList.add('show');

  clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(() => {
    cartToast.classList.remove('show');
  }, 1400);
}

function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);
  const product = products.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  renderCart();
  if (product) {
    showCartToast(`${product.title} added to cart`);
  }
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
        <p>${randFormatter.format(item.price * item.qty)}</p>
      </div>
      <button data-remove-id="${item.id}">Remove</button>
    `;
    cartItems.appendChild(cartItem);
  });

  cartCount.textContent = totalItems;
  subtotal.textContent = randFormatter.format(totalAmount);
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

filterBtn.addEventListener('click', () => {
  const isOpen = filterMenu.classList.toggle('open');
  filterBtn.setAttribute('aria-expanded', String(isOpen));
});

filterMenu.addEventListener('click', (event) => {
  const chosenCategory = event.target.dataset.category;
  if (!chosenCategory) {
    return;
  }

  selectedCategory = chosenCategory;
  filterBtn.textContent = chosenCategory;
  filterMenu.classList.remove('open');
  filterBtn.setAttribute('aria-expanded', 'false');
  renderProducts();
});

document.addEventListener('click', (event) => {
  if (!filterDropdown.contains(event.target)) {
    filterMenu.classList.remove('open');
    filterBtn.setAttribute('aria-expanded', 'false');
  }
});

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
renderFilterMenu();
renderProducts();
renderCart();
applyTheme();
