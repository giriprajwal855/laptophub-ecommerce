require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const crypto = require('crypto');

const { brands, products, getProduct, getBrand, getByBrand, addProduct, updateProduct, deleteProduct } = require('./data/products');
const { createUser, verifyUser, getUsers } = require('./data/users');
const orders = require('./data/orders');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Khalti Sandbox Config ----------
const KHALTI = {
  secretKey: process.env.KHALTI_SECRET_KEY || '05bf95cc57244045b8df5fad06748dab',
  initiateUrl: process.env.KHALTI_INITIATE_URL || 'https://dev.khalti.com/api/v2/epayment/initiate/',
  lookupUrl: process.env.KHALTI_LOOKUP_URL || 'https://dev.khalti.com/api/v2/epayment/lookup/',
  returnUrl: process.env.KHALTI_RETURN_URL || `http://localhost:${PORT}/payment/success`,
  websiteUrl: process.env.KHALTI_WEBSITE_URL || `http://localhost:${PORT}`
};

// ---------- eSewa Sandbox Config ----------
const ESEWA = {
  productCode: process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST',
  secretKey: process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q',
  formUrl: process.env.ESEWA_FORM_URL || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
  successUrl: process.env.ESEWA_SUCCESS_URL || `http://localhost:${PORT}/payment/esewa/success`,
  failureUrl: process.env.ESEWA_FAILURE_URL || `http://localhost:${PORT}/payment/esewa/failure`
};

const esewaSign = (message) =>
  crypto.createHmac('sha256', ESEWA.secretKey).update(message).digest('base64');

// ---------- Middleware ----------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'laptop-hub-secret-key-change-me',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
  })
);

// ---------- Helpers ----------
const formatPrice = (n) => `Rs. ${Math.round(n).toLocaleString('en-US')}`;

// Require login before buying (checkout)
function requireAuth(req, res, next) {
  if (req.session.user) return next();
  return res.redirect(`/login?next=${encodeURIComponent(req.path)}`);
}

// Require admin login
function requireAdmin(req, res, next) {
  if (req.session.isAdmin) return next();
  return res.redirect('/admin/login');
}

const getCart = (req) => (req.session.cart = req.session.cart || {});

const cartCount = (req) =>
  Object.values(getCart(req)).reduce((a, b) => a + b, 0);

const cartItems = (req) =>
  Object.entries(getCart(req)).map(([id, qty]) => ({
    product: getProduct(id),
    qty,
    subtotal: getProduct(id) ? getProduct(id).price * qty : 0
  })).filter((i) => i.product);

const cartTotals = (req) => {
  const items = cartItems(req);
  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  const tax = Math.round(subtotal * 0.13 * 100) / 100;
  const delivery = subtotal > 0 ? (subtotal >= 150000 ? 0 : 200) : 0;
  return { items, subtotal, tax, delivery, total: Math.round((subtotal + tax + delivery) * 100) / 100 };
};

// ---------- Auth ----------

// ---------- Global template locals ----------
app.use((req, res, next) => {
  res.locals.brands = brands;
  res.locals.products = products;
  res.locals.cartCount = cartCount(req);
  res.locals.currentPath = req.path;
  res.locals.formatPrice = formatPrice;
  res.locals.currentUser = req.session.user || null;
  res.locals.isAdmin = !!req.session.isAdmin;
  next();
});

// ---------- Routes ----------
app.get('/', (req, res) => {
  const featured = products.filter((p) => p.badge === 'Flagship');
  const bestSellers = products.filter((p) => p.badge && p.badge !== 'Flagship').slice(0, 8);
  const newArrivals = [...products].sort(() => Math.random() - 0.5).slice(0, 8);
  res.render('index', {
    title: 'LaptopHub — Premium Laptops',
    featured: featured[0] || products[0],
    bestSellers,
    newArrivals
  });
});

app.get('/shop', (req, res) => {
  const { brand, q, sort, cat } = req.query;
  let list = [...products];

  if (brand) list = list.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
  if (cat) list = list.filter((p) => p.category === cat);
  if (q) list = list.filter((p) => (p.name + ' ' + p.brand).toLowerCase().includes(q.toLowerCase()));

  if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);

  const categories = [...new Set(products.map((p) => p.category))];
  res.render('shop', {
    title: brand ? `${brand} Laptops` : 'All Laptops',
    list,
    activeBrand: brand || '',
    activeCat: cat || '',
    activeSort: sort || 'default',
    q: q || '',
    categories
  });
});

app.get('/brand/:slug', (req, res) => {
  const brand = getBrand(req.params.slug);
  if (!brand) return res.status(404).render('error', { title: 'Brand not found' });
  res.render('shop', {
    title: `${brand.name} Laptops`,
    list: getByBrand(brand.name),
    activeBrand: brand.name,
    activeCat: '',
    activeSort: 'default',
    q: '',
    categories: [...new Set(products.map((p) => p.category))]
  });
});

app.get('/product/:id', (req, res) => {
  const product = getProduct(req.params.id);
  if (!product) return res.status(404).render('error', { title: 'Product not found' });
  const related = getByBrand(product.brand).filter((p) => p.id !== product.id).slice(0, 4);
  res.render('product', { title: product.name, product, related });
});

app.post('/cart/add', (req, res) => {
  const { id, qty } = req.body;
  if (!getProduct(id)) return res.status(400).json({ error: 'Invalid product' });
  const cart = getCart(req);
  cart[id] = (cart[id] || 0) + (parseInt(qty, 10) || 1);
  res.json({ ok: true, count: cartCount(req) });
});

app.post('/cart/update', (req, res) => {
  const { id, qty } = req.body;
  const cart = getCart(req);
  const n = parseInt(qty, 10);
  if (n <= 0) delete cart[id];
  else cart[id] = n;
  res.redirect('/cart');
});

app.post('/cart/remove', (req, res) => {
  const { id } = req.body;
  delete getCart(req)[id];
  res.redirect('/cart');
});

app.get('/cart', (req, res) => {
  const totals = cartTotals(req);
  res.render('cart', { title: 'Your Cart', totals });
});

app.get('/checkout', requireAuth, (req, res) => {
  const totals = cartTotals(req);
  if (totals.items.length === 0) return res.redirect('/shop');
  res.render('checkout', { title: 'Checkout', totals });
});

// ---------- Auth ----------
app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect(req.query.next || '/');
  res.render('login', {
    title: 'Login',
    next: (req.query.next && req.query.next.startsWith('/')) ? req.query.next : '/checkout',
    error: null
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const next = (req.body.next && req.body.next.startsWith('/')) ? req.body.next : '/checkout';
  const user = verifyUser(email, password);
  if (!user) {
    return res.status(401).render('login', { title: 'Login', next, error: 'Invalid email or password.' });
  }
  req.session.user = user;
  res.redirect(next);
});

app.get('/signup', (req, res) => {
  if (req.session.user) return res.redirect(req.query.next || '/');
  res.render('signup', {
    title: 'Sign Up',
    next: (req.query.next && req.query.next.startsWith('/')) ? req.query.next : '/checkout',
    error: null
  });
});

app.post('/signup', (req, res) => {
  const { name, email, phone, password, confirm } = req.body;
  const next = (req.body.next && req.body.next.startsWith('/')) ? req.body.next : '/checkout';

  if (!name || !name.trim()) {
    return res.status(400).render('signup', { title: 'Sign Up', next, error: 'Please enter your name.' });
  }
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).render('signup', { title: 'Sign Up', next, error: 'Please enter a valid email address.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).render('signup', { title: 'Sign Up', next, error: 'Password must be at least 6 characters.' });
  }
  if (password !== confirm) {
    return res.status(400).render('signup', { title: 'Sign Up', next, error: 'Passwords do not match.' });
  }

  try {
    const user = createUser({ name, email, phone, password });
    req.session.user = user;
    res.redirect(next);
  } catch (e) {
    res.status(400).render('signup', { title: 'Sign Up', next, error: e.message });
  }
});

app.post('/logout', (req, res) => {
  req.session.user = null;
  res.redirect('/');
});

// Step 1: initiate payment server-side, then redirect to the chosen gateway
app.post('/checkout', requireAuth, async (req, res) => {
  const totals = cartTotals(req);
  if (totals.items.length === 0) return res.redirect('/shop');

  const { name, email, phone, address, pay } = req.body;
  const paymentMethod = pay === 'esewa' ? 'esewa' : 'khalti';
  const purchaseOrderId = `ord-${Date.now()}`;

  const pending = {
    gateway: paymentMethod,
    purchaseOrderId,
    amount: totals.total,
    customer: { name, email, phone, address },
    items: cartItems(req),
    totals
  };

  // ---------- eSewa: signed HTML form (redirect flow) ----------
  if (paymentMethod === 'esewa') {
    const totalAmount = totals.total.toFixed(2);
    const transactionUuid = `TXN-${Date.now()}`;
    const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA.productCode}`;

    req.session.pendingOrder = {
      ...pending,
      pidx: null,
      transactionUuid
    };

    return res.render('esewa-redirect', {
      title: 'Redirecting to eSewa…',
      formUrl: ESEWA.formUrl,
      fields: {
        amount: totals.subtotal.toFixed(2),
        tax_amount: totals.tax.toFixed(2),
        total_amount: totalAmount,
        transaction_uuid: transactionUuid,
        product_code: ESEWA.productCode,
        product_service_charge: '0',
        product_delivery_charge: totals.delivery.toFixed(2),
        success_url: ESEWA.successUrl,
        failure_url: ESEWA.failureUrl,
        signed_field_names: 'total_amount,transaction_uuid,product_code',
        signature: esewaSign(message)
      }
    });
  }

  // ---------- Khalti: server-side initiate + redirect ----------
  const payload = {
    return_url: KHALTI.returnUrl,
    website_url: KHALTI.websiteUrl,
    amount: String(Math.round(totals.total * 100)),
    purchase_order_id: purchaseOrderId,
    purchase_order_name: `LaptopHub order ${purchaseOrderId}`,
    customer_info: { name, email, phone }
  };

  try {
    const resp = await fetch(KHALTI.initiateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Key ${KHALTI.secretKey}`
      },
      body: JSON.stringify(payload)
    });
    const data = await resp.json();

    if (!data.pidx || !data.payment_url) {
      return res.status(502).render('error', {
        title: 'Payment gateway error',
        message: JSON.stringify(data)
      });
    }

    req.session.pendingOrder = {
      ...pending,
      pidx: data.pidx
    };

    res.redirect(data.payment_url);
  } catch (e) {
    res.status(502).render('error', { title: 'Payment gateway error', message: e.message });
  }
});

// Step 2: Khalti redirects here after payment with ?pidx=...
app.get('/payment/success', async (req, res) => {
  const pending = req.session.pendingOrder;
  if (!pending || pending.gateway !== 'khalti') return res.render('error', { title: 'No pending order' });

  const pidx = req.query.pidx || pending.pidx;
  try {
    const resp = await fetch(KHALTI.lookupUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Key ${KHALTI.secretKey}`
      },
      body: JSON.stringify({ pidx })
    });
    const status = await resp.json();

    if (status.status === 'Completed') {
      const order = {
        ...pending,
        transactionId: status.transaction_id,
        pidx,
        paidAt: new Date()
      };
      req.session.orders = req.session.orders || [];
      req.session.orders.push(order);
      orders.createOrder({
        orderId: pending.purchaseOrderId,
        gateway: 'khalti',
        pidx,
        transactionId: status.transaction_id,
        amount: pending.amount,
        customer: pending.customer,
        items: pending.items,
        totals: pending.totals
      });
      req.session.cart = {};
      req.session.pendingOrder = null;
      return res.render('payment-success', { title: 'Payment Successful', order });
    }

    if (status.status === 'Pending' || status.status === 'Initiated') {
      return res.render('error', {
        title: 'Payment pending',
        message: 'Your payment is still being processed. Please check back shortly.'
      });
    }

    req.session.pendingOrder = null;
    return res.render('payment-failure', { title: 'Payment Failed' });
  } catch (e) {
    res.render('error', { title: 'Payment error', message: e.message });
  }
});

app.get('/payment/failure', (req, res) => {
  req.session.pendingOrder = null;
  res.render('payment-failure', { title: 'Payment Failed' });
});

// eSewa redirects here after payment with ?data=<base64 JSON>&signature=<sig>
app.get('/payment/esewa/success', async (req, res) => {
  const pending = req.session.pendingOrder;
  if (!pending || pending.gateway !== 'esewa') {
    return res.render('error', { title: 'No pending order' });
  }

  let raw;
  let payload;
  try {
    raw = Buffer.from(req.query.data, 'base64').toString('utf8');
    payload = JSON.parse(raw);
  } catch (e) {
    return res.render('error', { title: 'Invalid eSewa response' });
  }

  // Rebuild the signed message from signed_field_names, using the RAW field
  // tokens (JSON.parse would lose the decimal, e.g. 1000.0 -> 1000).
  const fields = String(payload.signed_field_names || '').split(',').map((s) => s.trim()).filter(Boolean);
  const message = fields.map((f) => `${f}=${rawJsonField(raw, f)}`).join(',');
  if (!payload.signature || payload.signature !== esewaSign(message)) {
    return res.render('error', { title: 'eSewa signature verification failed' });
  }
  if (pending.transactionUuid && payload.transaction_uuid !== pending.transactionUuid) {
    return res.render('error', { title: 'eSewa transaction mismatch' });
  }

  if (payload.status !== 'COMPLETE') {
    req.session.pendingOrder = null;
    return res.render('payment-failure', { title: 'Payment Failed' });
  }

  const order = {
    ...pending,
    pidx: null,
    transactionId: payload.transaction_code || payload.transaction_uuid,
    paidAt: new Date()
  };
  req.session.orders = req.session.orders || [];
  req.session.orders.push(order);
  orders.createOrder({
    orderId: pending.purchaseOrderId,
    gateway: 'esewa',
    pidx: null,
    transactionId: payload.transaction_code || payload.transaction_uuid,
    amount: pending.amount,
    customer: pending.customer,
    items: pending.items,
    totals: pending.totals
  });
  req.session.cart = {};
  req.session.pendingOrder = null;
  return res.render('payment-success', { title: 'Payment Successful', order });
});

function rawJsonField(jsonText, field) {
  const re = new RegExp(`"${field}"\\s*:\\s*("(?:[^"\\\\]|\\\\.)*"|\\d+(?:\\.\\d+)?|null|true|false)`, 'm');
  const m = jsonText.match(re);
  if (!m) return '';
  return m[1].startsWith('"') ? JSON.parse(m[1]) : m[1];
}

app.get('/payment/esewa/failure', (req, res) => {
  req.session.pendingOrder = null;
  res.render('payment-failure', { title: 'Payment Failed' });
});

// ---------- Admin ----------
const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

app.get('/admin/login', (req, res) => {
  if (req.session.isAdmin) return res.redirect('/admin');
  res.render('admin/login', { title: 'Admin Login', error: null });
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    return res.redirect('/admin');
  }
  res.status(401).render('admin/login', { title: 'Admin Login', error: 'Invalid admin credentials.' });
});

app.post('/admin/logout', (req, res) => {
  req.session.isAdmin = null;
  res.redirect('/admin/login');
});

app.get('/admin', requireAdmin, (req, res) => {
  const allOrders = orders.getOrders();
  const revenue = allOrders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((s, o) => s + (o.amount || 0), 0);
  res.render('admin/dashboard', {
    title: 'Dashboard',
    path: '/admin',
    stats: {
      products: products.length,
      orders: allOrders.length,
      revenue,
      users: getUsers().length
    },
    recentOrders: allOrders.slice(0, 5)
  });
});

app.get('/admin/orders', requireAdmin, (req, res) => {
  res.render('admin/orders', {
    title: 'Orders',
    path: '/admin/orders',
    orders: orders.getOrders(),
    orderStatuses: ORDER_STATUSES
  });
});

app.post('/admin/orders/:id/status', requireAdmin, (req, res) => {
  const status = ORDER_STATUSES.includes(req.body.status) ? req.body.status : 'Pending';
  orders.updateStatus(req.params.id, status);
  res.redirect('/admin/orders');
});

app.get('/admin/products', requireAdmin, (req, res) => {
  res.render('admin/products', { title: 'Products', path: '/admin/products' });
});

app.get('/admin/products/new', requireAdmin, (req, res) => {
  res.render('admin/product-form', {
    title: 'Add Product',
    path: '/admin/products',
    product: null,
    error: null
  });
});

app.post('/admin/products', requireAdmin, (req, res) => {
  const specs = parseSpecs(req.body.specs);
  const product = addProduct({ ...req.body, specs });
  res.redirect('/admin/products');
});

app.get('/admin/products/:id/edit', requireAdmin, (req, res) => {
  const product = getProduct(req.params.id);
  if (!product) return res.status(404).render('error', { title: 'Product not found' });
  res.render('admin/product-form', {
    title: `Edit ${product.name}`,
    path: '/admin/products',
    product,
    error: null
  });
});

app.post('/admin/products/:id', requireAdmin, (req, res) => {
  const specs = parseSpecs(req.body.specs);
  updateProduct(req.params.id, { ...req.body, specs });
  res.redirect('/admin/products');
});

app.post('/admin/products/:id/delete', requireAdmin, (req, res) => {
  deleteProduct(req.params.id);
  res.redirect('/admin/products');
});

app.get('/admin/users', requireAdmin, (req, res) => {
  res.render('admin/users', { title: 'Users', path: '/admin/users', users: getUsers() });
});

function parseSpecs(text) {
  const specs = {};
  if (!text) return specs;
  for (const line of String(text).split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      if (key && value) specs[key] = value;
    }
  }
  return specs;
}

app.use((req, res) => res.status(404).render('error', { title: 'Page not found' }));

app.listen(PORT, () => {
  console.log(`LaptopHub running at http://localhost:${PORT}`);
});