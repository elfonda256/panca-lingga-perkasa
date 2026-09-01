/**
 * PT PANCA LINGGA PERKASA - BACKEND REST API & STATIC SERVER
 * Powered by Node.js, Express, and JSON Data Store
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'plp_secret_jwt_key_2026_secure_company_profile';

// Database helper
const DB_FILE = path.join(__dirname, 'data', 'db.json');

function getDB() {
  if (!fs.existsSync(DB_FILE)) {
    const { seed } = require('./data/seed');
    seed();
  }
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(raw);
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure upload directory exists
const UPLOADS_DIR = path.join(__dirname, 'images');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e4);
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    cb(null, `upload_${cleanName}_${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg|gif|pdf/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Format file tidak didukung. Harap upload gambar (PNG, JPG, WEBP, SVG) atau PDF.'));
    }
  }
});

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Akses ditolak: Token autentikasi tidak ditemukan.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Sesi login telah kedaluwarsa atau token tidak valid.' });
    }
    req.user = user;
    next();
  });
}

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
  }

  const db = getDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ success: false, message: 'Email atau password salah.' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Email atau password salah.' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    message: 'Login berhasil!',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// GET /api/auth/me
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const db = getDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
  }
  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// PUT /api/auth/password
app.put('/api/auth/password', authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Password saat ini dan password baru wajib diisi.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Password baru minimal 6 karakter.' });
  }

  const db = getDB();
  const userIndex = db.users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
  }

  const user = db.users[userIndex];
  if (!bcrypt.compareSync(currentPassword, user.password)) {
    return res.status(400).json({ success: false, message: 'Password saat ini salah.' });
  }

  const salt = bcrypt.genSaltSync(10);
  db.users[userIndex].password = bcrypt.hashSync(newPassword, salt);
  saveDB(db);

  res.json({ success: true, message: 'Password berhasil diperbarui.' });
});

// ==========================================
// 2. DASHBOARD STATS ROUTE
// ==========================================

// GET /api/stats
app.get('/api/stats', authenticateToken, (req, res) => {
  const db = getDB();
  const totalProducts = db.products ? db.products.length : 0;
  const totalProjects = db.projects ? db.projects.length : 0;
  const totalServices = db.services ? db.services.length : 0;
  const totalMessages = db.messages ? db.messages.length : 0;
  const unreadMessages = db.messages ? db.messages.filter(m => m.status === 'unread').length : 0;

  const greenprimaCount = db.products ? db.products.filter(p => p.brand === 'greenprima').length : 0;
  const ecoproCount = db.products ? db.products.filter(p => p.brand === 'ecopro').length : 0;

  res.json({
    success: true,
    stats: {
      totalProducts,
      greenprimaCount,
      ecoproCount,
      totalProjects,
      totalServices,
      totalMessages,
      unreadMessages
    }
  });
});

// ==========================================
// 3. MEDIA UPLOAD ROUTE
// ==========================================

// POST /api/upload
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah.' });
  }

  const relativePath = `images/${req.file.filename}`;
  res.json({
    success: true,
    message: 'File berhasil diunggah.',
    filePath: relativePath,
    fileName: req.file.filename,
    fileSize: req.file.size
  });
});

// ==========================================
// 4. PRODUCTS CRUD ROUTES
// ==========================================

// GET /api/products (Public)
app.get('/api/products', (req, res) => {
  const { brand, category, search } = req.query;
  const db = getDB();
  let list = db.products || [];

  if (brand && brand !== 'all') {
    list = list.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }

  if (category && category !== 'all') {
    list = list.filter(p => (p.category || '').includes(category));
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      (p.specs && JSON.stringify(p.specs).toLowerCase().includes(q))
    );
  }

  // Sort by order ascending
  list.sort((a, b) => (a.order || 999) - (b.order || 999));

  res.json({ success: true, count: list.length, products: list });
});

// GET /api/products/:id (Public)
app.get('/api/products/:id', (req, res) => {
  const db = getDB();
  const product = (db.products || []).find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
  }
  res.json({ success: true, product });
});

// POST /api/products (Protected)
app.post('/api/products', authenticateToken, (req, res) => {
  const { brand, category, name, description, image, specs, fullModalDesc, badge } = req.body;
  if (!brand || !name || !description) {
    return res.status(400).json({ success: false, message: 'Brand, nama produk, dan deskripsi wajib diisi.' });
  }

  const db = getDB();
  if (!db.products) db.products = [];

  const newProduct = {
    id: 'prod-' + Date.now(),
    brand: brand.toLowerCase(),
    brandLabel: brand.toLowerCase() === 'greenprima' ? 'GreenPrima Instruments (UK)' : 'Shanghai Ecopro Environmental',
    category: category || 'all',
    categoryLabel: req.body.categoryLabel || category,
    name: name.trim(),
    image: image || 'images/prod-mag-flowmeter-unit.png',
    badge: badge || (brand.toLowerCase() === 'greenprima' ? '🇬🇧 GreenPrima' : '🇨🇳 Shanghai Ecopro'),
    description: description.trim(),
    specs: specs || {
      method: '-',
      range: '-',
      accuracy: '-',
      output: '-',
      bullet1: '-',
      bullet2: '-'
    },
    fullModalDesc: fullModalDesc || description,
    order: db.products.length + 1,
    createdAt: new Date().toISOString()
  };

  db.products.push(newProduct);
  saveDB(db);

  res.status(201).json({ success: true, message: 'Produk berhasil ditambahkan!', product: newProduct });
});

// PUT /api/products/:id (Protected)
app.put('/api/products/:id', authenticateToken, (req, res) => {
  const db = getDB();
  if (!db.products) db.products = [];

  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
  }

  const current = db.products[index];
  const updated = {
    ...current,
    ...req.body,
    id: current.id, // preserve ID
    updatedAt: new Date().toISOString()
  };

  db.products[index] = updated;
  saveDB(db);

  res.json({ success: true, message: 'Produk berhasil diperbarui!', product: updated });
});

// DELETE /api/products/:id (Protected)
app.delete('/api/products/:id', authenticateToken, (req, res) => {
  const db = getDB();
  if (!db.products) db.products = [];

  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
  }

  const deleted = db.products.splice(index, 1);
  saveDB(db);

  res.json({ success: true, message: 'Produk berhasil dihapus!', product: deleted[0] });
});

// ==========================================
// 5. PROJECTS / PORTFOLIO CRUD ROUTES
// ==========================================

// GET /api/projects (Public)
app.get('/api/projects', (req, res) => {
  const { group, search } = req.query;
  const db = getDB();
  let list = db.projects || [];

  if (group && group !== 'all') {
    list = list.filter(p => (p.group || '').includes(group));
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.client.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.story.toLowerCase().includes(q)
    );
  }

  list.sort((a, b) => (a.order || 999) - (b.order || 999));
  res.json({ success: true, count: list.length, projects: list });
});

// GET /api/projects/:id (Public)
app.get('/api/projects/:id', (req, res) => {
  const db = getDB();
  const project = (db.projects || []).find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Portofolio proyek tidak ditemukan.' });
  }
  res.json({ success: true, project });
});

// POST /api/projects (Protected)
app.post('/api/projects', authenticateToken, (req, res) => {
  const { group, title, client, location, tag, image, story, highlight } = req.body;
  if (!title || !client || !story) {
    return res.status(400).json({ success: false, message: 'Judul proyek, nama klien, dan uraian cerita wajib diisi.' });
  }

  const db = getDB();
  if (!db.projects) db.projects = [];

  const newProject = {
    id: 'proj-' + Date.now(),
    group: group || 'all',
    groupLabel: req.body.groupLabel || group,
    title: title.trim(),
    client: client.trim(),
    location: (location || 'Indonesia').trim(),
    tag: (tag || 'MEP & Engineering').trim(),
    image: image || 'images/proyek-soetta-dashboard.png',
    story: story.trim(),
    highlight: highlight || 'Presisi & Kualitas Standar Nasional',
    order: db.projects.length + 1,
    createdAt: new Date().toISOString()
  };

  db.projects.push(newProject);
  saveDB(db);

  res.status(201).json({ success: true, message: 'Portofolio proyek berhasil ditambahkan!', project: newProject });
});

// PUT /api/projects/:id (Protected)
app.put('/api/projects/:id', authenticateToken, (req, res) => {
  const db = getDB();
  if (!db.projects) db.projects = [];

  const index = db.projects.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Portofolio proyek tidak ditemukan.' });
  }

  const current = db.projects[index];
  const updated = {
    ...current,
    ...req.body,
    id: current.id,
    updatedAt: new Date().toISOString()
  };

  db.projects[index] = updated;
  saveDB(db);

  res.json({ success: true, message: 'Portofolio proyek berhasil diperbarui!', project: updated });
});

// DELETE /api/projects/:id (Protected)
app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  const db = getDB();
  if (!db.projects) db.projects = [];

  const index = db.projects.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Portofolio proyek tidak ditemukan.' });
  }

  const deleted = db.projects.splice(index, 1);
  saveDB(db);

  res.json({ success: true, message: 'Portofolio proyek berhasil dihapus!', project: deleted[0] });
});

// ==========================================
// 6. SERVICES & CAPABILITIES CRUD ROUTES
// ==========================================

// GET /api/services (Public)
app.get('/api/services', (req, res) => {
  const db = getDB();
  const list = db.services || [];
  list.sort((a, b) => (a.order || 999) - (b.order || 999));
  res.json({ success: true, count: list.length, services: list });
});

// POST /api/services (Protected)
app.post('/api/services', authenticateToken, (req, res) => {
  const { title, icon, description, image, features, featured } = req.body;
  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Judul layanan dan deskripsi wajib diisi.' });
  }

  const db = getDB();
  if (!db.services) db.services = [];

  const newService = {
    id: 'srv-' + Date.now(),
    title: title.trim(),
    icon: icon || 'wrench',
    description: description.trim(),
    image: image || '',
    features: Array.isArray(features) ? features : [],
    featured: !!featured,
    order: db.services.length + 1,
    createdAt: new Date().toISOString()
  };

  db.services.push(newService);
  saveDB(db);

  res.status(201).json({ success: true, message: 'Layanan berhasil ditambahkan!', service: newService });
});

// PUT /api/services/:id (Protected)
app.put('/api/services/:id', authenticateToken, (req, res) => {
  const db = getDB();
  if (!db.services) db.services = [];

  const index = db.services.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Layanan tidak ditemukan.' });
  }

  const current = db.services[index];
  const updated = {
    ...current,
    ...req.body,
    id: current.id,
    updatedAt: new Date().toISOString()
  };

  db.services[index] = updated;
  saveDB(db);

  res.json({ success: true, message: 'Layanan berhasil diperbarui!', service: updated });
});

// DELETE /api/services/:id (Protected)
app.delete('/api/services/:id', authenticateToken, (req, res) => {
  const db = getDB();
  if (!db.services) db.services = [];

  const index = db.services.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Layanan tidak ditemukan.' });
  }

  const deleted = db.services.splice(index, 1);
  saveDB(db);

  res.json({ success: true, message: 'Layanan berhasil dihapus!', service: deleted[0] });
});

// ==========================================
// 7. CONTACT MESSAGES / INBOX ROUTES
// ==========================================

// GET /api/messages (Protected)
app.get('/api/messages', authenticateToken, (req, res) => {
  const { status, search } = req.query;
  const db = getDB();
  let list = db.messages || [];

  if (status && status !== 'all') {
    list = list.filter(m => m.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(m => 
      m.name.toLowerCase().includes(q) ||
      m.company.toLowerCase().includes(q) ||
      m.phone.includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  }

  // Sort newest first
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ success: true, count: list.length, messages: list });
});

// POST /api/messages (Public - from web contact form)
app.post('/api/messages', (req, res) => {
  const { name, company, phone, service, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ success: false, message: 'Nama, telepon, dan pesan wajib diisi.' });
  }

  const db = getDB();
  if (!db.messages) db.messages = [];

  const newMessage = {
    id: 'msg-' + Date.now(),
    name: name.trim(),
    company: (company || '-').trim(),
    phone: phone.trim(),
    service: (service || 'Konsultasi Umum').trim(),
    message: message.trim(),
    status: 'unread',
    createdAt: new Date().toISOString()
  };

  db.messages.unshift(newMessage);
  saveDB(db);

  res.status(201).json({ success: true, message: 'Pesan berhasil dikirim dan tersimpan di sistem.', messageData: newMessage });
});

// PATCH /api/messages/:id/status (Protected)
app.patch('/api/messages/:id/status', authenticateToken, (req, res) => {
  const { status } = req.body;
  const db = getDB();
  if (!db.messages) db.messages = [];

  const msg = db.messages.find(m => m.id === req.params.id);
  if (!msg) {
    return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan.' });
  }

  msg.status = status || 'read';
  saveDB(db);

  res.json({ success: true, message: 'Status pesan berhasil diperbarui.', messageData: msg });
});

// DELETE /api/messages/:id (Protected)
app.delete('/api/messages/:id', authenticateToken, (req, res) => {
  const db = getDB();
  if (!db.messages) db.messages = [];

  const index = db.messages.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan.' });
  }

  const deleted = db.messages.splice(index, 1);
  saveDB(db);

  res.json({ success: true, message: 'Pesan berhasil dihapus!', messageData: deleted[0] });
});

// ==========================================
// 8. SETTINGS & PROFILE ROUTES
// ==========================================

// GET /api/settings (Public)
app.get('/api/settings', (req, res) => {
  const db = getDB();
  res.json({ success: true, settings: db.settings || {} });
});

// PUT /api/settings (Protected)
app.put('/api/settings', authenticateToken, (req, res) => {
  const db = getDB();
  db.settings = {
    ...db.settings,
    ...req.body
  };
  saveDB(db);

  res.json({ success: true, message: 'Pengaturan profil berhasil disimpan!', settings: db.settings });
});

// ==========================================
// 9. STATIC FILE SERVING & SPA FALLBACK
// ==========================================

// Serve /images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Serve /admin static files
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Serve main website static files
app.use(express.static(path.join(__dirname)));

// Root fallback to index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin fallback
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal pada server.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`==========================================================`);
  console.log(`🚀 PT PANCA LINGGA PERKASA - BACKEND CRUD SERVER AKTIF`);
  console.log(`🌐 Website Utama     : http://localhost:${PORT}/`);
  console.log(`⚙️  Admin Dashboard  : http://localhost:${PORT}/admin/`);
  console.log(`📡 REST API Endpoint : http://localhost:${PORT}/api/`);
  console.log(`==========================================================`);
});
