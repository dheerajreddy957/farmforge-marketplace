const API_BASE = 'https://farmforge-backend-production.up.railway.app/api/users'

const state = {
  user: null,
  activeView: 'overview',
  users: [],
  products: [],
  orders: [],
  feedback: [],
  loading: false,
  error: '',
}

const fallbackData = {
  users: [
    { id: 1, name: 'Priya Sharma', email: 'priya@farmforge.com', role: 'Farmer', status: 'Active' },
    { id: 2, name: 'Samuel Ortiz', email: 'samuel@globalbuyer.com', role: 'Buyer', status: 'Active' },
    { id: 3, name: 'Ayesha Khan', email: 'ayesha@adminhub.com', role: 'Admin', status: 'Active' },
  ],
  products: [
    { id: 1, name: 'Organic Mango Jam', category: 'Processed Food', farmer: 'Priya Sharma', price: 18, quantity: 120, description: 'Premium mango jam made from fresh orchard fruit.' },
    { id: 2, name: 'Handmade Wheat Snacks', category: 'Snack Food', farmer: 'Priya Sharma', price: 12, quantity: 80, description: 'Nutritious snacks made with locally grown wheat.' },
    { id: 3, name: 'Dried Chili Powder', category: 'Spice', farmer: 'Priya Sharma', price: 9, quantity: 210, description: 'Bold spice powder from rural agriculture producers.' },
  ],
  orders: [
    { id: 'ORD-1001', product: 'Organic Mango Jam', buyer: 'Samuel Ortiz', farmer: 'Priya Sharma', status: 'Pending', total: 180, date: '2026-04-05' },
    { id: 'ORD-1002', product: 'Dried Chili Powder', buyer: 'Samuel Ortiz', farmer: 'Priya Sharma', status: 'Completed', total: 54, date: '2026-03-29' },
  ],
  feedback: [
    { id: 1, author: 'Samuel Ortiz', role: 'Buyer', product: 'Organic Mango Jam', rating: 5, note: 'Authentic farm flavor and excellent packaging.' },
    { id: 2, author: 'Renuka Patel', role: 'Buyer', product: 'Dried Chili Powder', rating: 4, note: 'Great aroma and consistent quality.' },
  ],
}

const root = document.getElementById('app')

function apiFetch(path, options) {
  return fetch(`${API_BASE}${path}`, options).then((res) => {
    if (!res.ok) throw new Error('API error')
    return res.json()
  })
}

async function loadData() {
  state.loading = true
  state.error = ''
  render()

  try {
    const [users, products, orders, feedback] = await Promise.all([
      apiFetch('/users'),
      apiFetch('/products'),
      apiFetch('/orders'),
      apiFetch('/feedback'),
    ])
    state.users = users
    state.products = products
    state.orders = orders
    state.feedback = feedback
  } catch (error) {
    state.error = 'Backend is not reachable. Using local demo data.'
    state.users = fallbackData.users
    state.products = fallbackData.products
    state.orders = fallbackData.orders
    state.feedback = fallbackData.feedback
  } finally {
    state.loading = false
    render()
  }
}

async function loginUser(credentials) {
  if (!credentials.name || !credentials.email || !credentials.password) {
    state.error = 'All fields are required.'
    render()
    return
  }

  try {
    const user = await apiFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
    state.user = user
  } catch (error) {
    state.error = 'Backend login failed. Using offline mode.'
    const existing = fallbackData.users.find((u) => u.email === credentials.email)
    state.user = existing || { id: 4, name: credentials.name, email: credentials.email, role: credentials.role, status: 'Active' }
  }

  if (!state.user) {
    state.error = 'Unable to login. Check credentials.'
    render()
    return
  }

  state.activeView = 'overview'
  await loadData()
}

function logout() {
  state.user = null
  state.activeView = 'overview'
  state.error = ''
  render()
}

function setActiveView(view) {
  state.activeView = view
  render()
}

async function placeOrder(productId) {
  const product = state.products.find((item) => item.id === productId)
  if (!product || product.quantity <= 0) return

  try {
    const order = await apiFetch('/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, buyer: state.user.name, quantity: 1 }),
    })
    state.orders.unshift(order)
    state.products = state.products.map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
  } catch (error) {
    const fallbackOrder = {
      id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      product: product.name,
      buyer: state.user.name,
      farmer: product.farmer,
      status: 'Pending',
      total: product.price,
      date: new Date().toISOString().slice(0, 10),
    }
    state.orders.unshift(fallbackOrder)
    state.products = state.products.map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
  }
  render()
}

async function submitFeedback(productId, note) {
  const product = state.products.find((item) => item.id === productId)
  if (!product || !note.trim()) return

  try {
    const saved = await apiFetch('/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, author: state.user.name, role: state.user.role, rating: 5, note }),
    })
    state.feedback.unshift(saved)
  } catch (error) {
    state.feedback.unshift({
      id: state.feedback.length + 1,
      author: state.user.name,
      role: state.user.role,
      product: product.name,
      rating: 5,
      note,
    })
  }
  render()
}

function buildLoginPage() {
  return `
    <div class="login-page">
      <div class="login-panel">
        <div class="login-header">
          <span>FarmForge</span>
          <p>Support farmers to create value-added agricultural products and connect with buyers globally.</p>
        </div>
        <h1>Login</h1>
        <p class="login-intro">Secure access for Admin, Farmer, or Buyer roles. Start managing products, orders, and feedback now.</p>
        ${state.error ? `<div class="form-error">${state.error}</div>` : ''}
        <form id="login-form" class="login-form">
          <label>
            Full name
            <input id="login-name" placeholder="e.g. Priya Sharma" />
          </label>
          <label>
            Email address
            <input id="login-email" type="email" placeholder="you@domain.com" />
          </label>
          <label>
            Password
            <input id="login-password" type="password" placeholder="Enter your password" />
          </label>
          <label>
            Role
            <select id="login-role">
              <option value="Admin">Admin</option>
              <option value="Farmer">Farmer</option>
              <option value="Buyer">Buyer</option>
            </select>
          </label>
          <button type="submit" class="btn btn-primary">Continue</button>
        </form>
        <div class="login-footnote">Build rural entrepreneurship through farm-based processed foods, handmade goods, and global buyer access.</div>
      </div>
    </div>
  `
}

function buildDashboard() {
  const activeView = state.activeView
  const user = state.user

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'products', label: 'Products' },
    { id: 'orders', label: 'Orders' },
    { id: 'feedback', label: 'Feedback' },
  ]
  if (user.role === 'Admin') navItems.push({ id: 'users', label: 'Users' })

  return `
    <div class="app-shell">
      <aside class="side-nav">
        <div class="brand-block">
          <span>FarmForge</span>
          <small>Marketplace platform</small>
        </div>
        <nav class="nav-list">
          ${navItems
            .map(
              (item) => `
              <button class="nav-link ${activeView === item.id ? 'active' : ''}" data-nav="${item.id}">${item.label}</button>
            `
            )
            .join('')}
        </nav>
        <div class="role-card">
          <span>Active role</span>
          <strong>${user.role}</strong>
          <small>${user.name}</small>
        </div>
      </aside>
      <main class="main-panel">
        <header class="topbar">
          <div>
            <p>Welcome back, <strong>${user.name}</strong></p>
            <span>${user.role} dashboard</span>
          </div>
          <button class="btn btn-secondary" id="logout-button">Sign out</button>
        </header>
        <div class="page-header">
          <h1>${activeView.charAt(0).toUpperCase() + activeView.slice(1)}</h1>
          <p>Manage listings, orders, and platform activity with a clean and professional market dashboard.</p>
        </div>
        ${state.loading ? '<div class="data-status">Loading marketplace data…</div>' : ''}
        ${state.error && !state.loading ? `<div class="form-error">${state.error}</div>` : ''}
        ${renderSection()}
      </main>
    </div>
  `
}

function renderSection() {
  switch (state.activeView) {
    case 'overview':
      return buildOverview()
    case 'products':
      return buildProducts()
    case 'orders':
      return buildOrders()
    case 'feedback':
      return buildFeedback()
    case 'users':
      return buildUsers()
    default:
      return ''
  }
}

function buildOverview() {
  const availableProducts = state.products.filter((item) => item.quantity > 0).length
  const pendingOrders = state.orders.filter((order) => order.status === 'Pending').length
  return `
    <section class="section-content">
      <div class="section-row">
        <div class="card large-card">
          <h2>Marketplace overview</h2>
          <p>Track inventory, orders, and reviews while supporting farmers in building value-added agricultural products.</p>
          <div class="stats-grid">
            <div class="stat-card"><span>${availableProducts}</span><small>Active listings</small></div>
            <div class="stat-card"><span>${pendingOrders}</span><small>Pending orders</small></div>
            <div class="stat-card"><span>${state.feedback.length}</span><small>Buyer reviews</small></div>
            <div class="stat-card"><span>${state.users.length}</span><small>Platform users</small></div>
          </div>
        </div>
        <div class="card help-card">
          <h3>Role guidance</h3>
          <p>${state.user.role === 'Admin' ? 'Approve accounts and oversee the marketplace with confidence.' : state.user.role === 'Farmer' ? 'Publish products, manage stock, and connect with buyers globally.' : 'Browse curated farm products and place orders for quality ingredients.'}</p>
          <div class="key-points"><span>Clear inventory</span><span>Order visibility</span><span>Global reach</span></div>
        </div>
      </div>
    </section>
  `
}

function buildProducts() {
  return `
    <section class="section-content">
      <h2>Available agricultural products</h2>
      <div class="card-grid">
        ${state.products
          .map(
            (item) => `
            <article class="product-card">
              <div class="product-meta"><strong>${item.name}</strong><span>${item.category}</span></div>
              <div class="product-body"><p>${item.description}</p></div>
              <div class="product-footer"><span>${item.farmer}</span><strong>$${item.price.toFixed(2)}</strong><span>${item.quantity} units</span></div>
              ${state.user.role === 'Buyer' ? `<button class="btn btn-secondary" data-order="${item.id}" ${item.quantity === 0 ? 'disabled' : ''}>${item.quantity > 0 ? 'Place order' : 'Sold out'}</button>` : ''}
            </article>
          `
          )
          .join('')}
      </div>
    </section>
  `
}

function buildOrders() {
  return `
    <section class="section-content">
      <h2>Orders</h2>
      <div class="orders-table card">
        <div class="orders-header row-heading"><span>Reference</span><span>Product</span><span>Buyer</span><span>Status</span><span>Total</span></div>
        ${state.orders
          .map(
            (order) => `
            <div class="orders-row">
              <span>${order.id}</span>
              <span>${order.product}</span>
              <span>${order.buyer}</span>
              <span><span class="status-pill status-${order.status.toLowerCase()}">${order.status}</span></span>
              <span>$${order.total.toFixed(2)}</span>
            </div>
          `
          )
          .join('')}
      </div>
    </section>
  `
}

function buildFeedback() {
  const productOptions = state.products
    .map((product) => `<option value="${product.id}">${product.name}</option>`)
    .join('')
  return `
    <section class="section-content">
      <h2>Feedback and reviews</h2>
      <div class="card-grid">
        ${state.feedback
          .map(
            (item) => `
            <article class="feedback-card">
              <div class="feedback-header"><strong>${item.product}</strong><span>${item.rating} / 5</span></div>
              <p>${item.note}</p>
              <footer>${item.author} · ${item.role}</footer>
            </article>
          `
          )
          .join('')}
      </div>
      ${state.user.role === 'Buyer' ? `
        <div class="card feedback-form-card">
          <h3>Submit a review</h3>
          <label>
            Product
            <select id="feedback-product">${productOptions}</select>
          </label>
          <label>
            Review
            <textarea id="feedback-note" placeholder="Share your buying experience"></textarea>
          </label>
          <button class="btn btn-primary" id="feedback-submit">Submit review</button>
        </div>
      ` : ''}
    </section>
  `
}

function buildUsers() {
  if (state.user.role !== 'Admin') return '<section class="section-content"><div class="card"><p>Access restricted to administrators.</p></div></section>'
  return `
    <section class="section-content">
      <h2>User administration</h2>
      <div class="users-table card">
        <div class="orders-header row-heading"><span>Name</span><span>Role</span><span>Email</span><span>Status</span></div>
        ${state.users
          .map(
            (user) => `
            <div class="orders-row">
              <span>${user.name}</span>
              <span>${user.role}</span>
              <span>${user.email}</span>
              <span>${user.status}</span>
            </div>
          `
          )
          .join('')}
      </div>
    </section>
  `
}

function render() {
  if (!root) return
  root.innerHTML = state.user ? buildDashboard() : buildLoginPage()
  attachListeners()
}

function attachListeners() {
  const loginForm = document.getElementById('login-form')
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault()
      const name = document.getElementById('login-name').value.trim()
      const email = document.getElementById('login-email').value.trim()
      const password = document.getElementById('login-password').value
      const role = document.getElementById('login-role').value
      state.error = ''
      render()
      await loginUser({ name, email, password, role })
    })
  }

  document.querySelectorAll('[data-nav]').forEach((button) => {
    button.addEventListener('click', () => setActiveView(button.dataset.nav))
  })

  const logoutButton = document.getElementById('logout-button')
  if (logoutButton) {
    logoutButton.addEventListener('click', logout)
  }

  document.querySelectorAll('[data-order]').forEach((button) => {
    button.addEventListener('click', () => placeOrder(Number(button.dataset.order)))
  })

  const feedbackSubmit = document.getElementById('feedback-submit')
  if (feedbackSubmit) {
    feedbackSubmit.addEventListener('click', () => {
      const productId = Number(document.getElementById('feedback-product').value)
      const note = document.getElementById('feedback-note').value.trim()
      submitFeedback(productId, note)
    })
  }
}

render()
