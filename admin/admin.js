/**
 * PT PANCA LINGGA PERKASA - ADMIN CMS DASHBOARD JAVASCRIPT
 * Full CRUD & API Integration Engine
 */

const API_BASE = '/api';
let authToken = localStorage.getItem('plp_admin_token') || null;
let currentProducts = [];
let currentProjects = [];
let currentServices = [];
let currentMessages = [];
let currentSettings = {};

// On Load
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();
  checkAuth();
});

// Toast System
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let iconName = 'check-circle';
  if (type === 'error') iconName = 'alert-circle';
  if (type === 'info') iconName = 'info';

  toast.innerHTML = `
    <i data-lucide="${iconName}" class="icon-sm"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  if (typeof lucide !== 'undefined') lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==========================================================================
// 1. AUTHENTICATION & SESSION
// ==========================================================================

async function checkAuth() {
  if (!authToken) {
    showLoginView();
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();

    if (data.success && data.user) {
      document.getElementById('userDisplayName').textContent = data.user.name || 'Administrator';
      showAppView();
      loadAllData();
    } else {
      handleLogout();
    }
  } catch (err) {
    console.warn('Backend server not connected or offline:', err);
    // If offline, stay in login view or inform user
    showLoginView();
  }
}

function showLoginView() {
  document.getElementById('loginSection').style.display = 'flex';
  document.getElementById('adminApp').style.display = 'none';
}

function showAppView() {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('adminApp').style.display = 'flex';
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

async function handleAdminLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (data.success && data.token) {
      authToken = data.token;
      localStorage.setItem('plp_admin_token', authToken);
      document.getElementById('userDisplayName').textContent = data.user.name;
      showToast('Selamat datang kembali, ' + data.user.name + '!', 'success');
      showAppView();
      loadAllData();
    } else {
      showToast(data.message || 'Login gagal.', 'error');
    }
  } catch (err) {
    showToast('Gagal menghubungi server API. Pastikan server aktif.', 'error');
  }
}

function handleLogout() {
  authToken = null;
  localStorage.removeItem('plp_admin_token');
  showLoginView();
  showToast('Anda telah berhasil keluar.', 'info');
}

// Navigation Tabs
function switchNav(paneId) {
  // Update sidebar active buttons
  const buttons = document.querySelectorAll('.sidebar-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  // Match target button
  const matchingBtn = Array.from(buttons).find(b => {
    const onclickStr = b.getAttribute('onclick') || '';
    return onclickStr.includes(`'${paneId}'`);
  });
  if (matchingBtn) matchingBtn.classList.add('active');

  // Update panes
  const panes = document.querySelectorAll('.admin-pane');
  panes.forEach(pane => pane.classList.remove('active'));

  const targetPane = document.getElementById(`pane-${paneId}`);
  if (targetPane) targetPane.classList.add('active');

  // Update Header Title
  const titles = {
    overview: 'Ringkasan Dashboard',
    products: 'Katalog Produk & Instrumen',
    projects: 'Portofolio Proyek & Dedikasi Lapangan',
    services: 'Layanan & Kapabilitas Rekayasa',
    messages: 'Kotak Masuk Form Konsultasi',
    settings: 'Pengaturan Profil Perusahaan'
  };
  document.getElementById('pageTitle').textContent = titles[paneId] || 'Admin Dashboard';

  // Close mobile sidebar if open
  document.getElementById('sidebar').classList.remove('open');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function toggleMobileSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ==========================================================================
// 2. DATA LOADING & STATS
// ==========================================================================

async function loadAllData() {
  await Promise.all([
    fetchStats(),
    fetchProducts(),
    fetchProjects(),
    fetchServices(),
    fetchMessages(),
    fetchSettings()
  ]);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

async function fetchStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (data.success && data.stats) {
      document.getElementById('statProducts').textContent = data.stats.totalProducts;
      document.getElementById('statProjects').textContent = data.stats.totalProjects;
      document.getElementById('statServices').textContent = data.stats.totalServices;
      document.getElementById('statMessages').textContent = data.stats.totalMessages;
      document.getElementById('statUnreadMsg').textContent = data.stats.unreadMessages;

      const badge = document.getElementById('sidebarMsgBadge');
      if (data.stats.unreadMessages > 0) {
        badge.style.display = 'inline-block';
        badge.textContent = data.stats.unreadMessages;
      } else {
        badge.style.display = 'none';
      }
    }
  } catch (err) {
    console.error('Error fetching stats:', err);
  }
}

// ==========================================================================
// 3. PRODUCTS CRUD
// ==========================================================================

async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    const data = await res.json();
    if (data.success) {
      currentProducts = data.products || [];
      renderProductsTable(currentProducts);
    }
  } catch (err) {
    console.error('Error fetching products:', err);
  }
}

function renderProductsTable(products) {
  const tbody = document.getElementById('productsTableBody');
  if (!tbody) return;

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-muted);">Tidak ada produk yang sesuai.</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => {
    const brandBadge = p.brand === 'greenprima' 
      ? '<span class="badge badge-brand-gp">🇬🇧 GreenPrima</span>' 
      : '<span class="badge badge-brand-eco">🇨🇳 Shanghai Ecopro</span>';
    
    const imgSrc = p.image.startsWith('http') || p.image.startsWith('/') ? p.image : `../${p.image}`;
    const method = p.specs && p.specs.method ? p.specs.method : '-';
    const range = p.specs && p.specs.range ? p.specs.range : '-';

    return `
      <tr>
        <td>
          <img src="${imgSrc}" alt="${p.name}" class="item-thumb" onerror="this.src='../images/prod-mag-flowmeter-unit.png'">
        </td>
        <td>
          <strong style="color: var(--primary);">${escapeHtml(p.name)}</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(p.categoryLabel || p.category)}</div>
        </td>
        <td>${brandBadge}</td>
        <td>
          <div style="font-size: 0.8rem;"><strong>Metode:</strong> ${escapeHtml(method)}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);"><strong>Rentang:</strong> ${escapeHtml(range)}</div>
        </td>
        <td><span class="badge" style="background:#f1f5f9;">#${p.order || 1}</span></td>
        <td style="text-align: right;">
          <div class="row-actions" style="justify-content: flex-end;">
            <button class="btn-icon" title="Edit Produk" onclick="editProduct('${p.id}')">
              <i data-lucide="edit-3"></i>
            </button>
            <button class="btn-icon delete" title="Hapus Produk" onclick="deleteProduct('${p.id}', '${escapeHtml(p.name)}')">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function filterProducts() {
  const q = document.getElementById('prodSearchInput').value.toLowerCase();
  const brand = document.getElementById('prodBrandFilter').value;

  const filtered = currentProducts.filter(p => {
    const matchBrand = (brand === 'all' || p.brand === brand);
    const matchQuery = p.name.toLowerCase().includes(q) || 
                       p.description.toLowerCase().includes(q) ||
                       (p.category || '').toLowerCase().includes(q) ||
                       (p.specs && JSON.stringify(p.specs).toLowerCase().includes(q));
    return matchBrand && matchQuery;
  });

  renderProductsTable(filtered);
}

function openProductModal(prod = null) {
  const modal = document.getElementById('modalProduct');
  const title = document.getElementById('modalProductTitle');
  const form = document.getElementById('productForm');
  form.reset();

  if (prod) {
    title.textContent = 'Edit Produk: ' + prod.name;
    document.getElementById('prodId').value = prod.id;
    document.getElementById('prodBrand').value = prod.brand || 'greenprima';
    document.getElementById('prodCategory').value = prod.category || '';
    document.getElementById('prodName').value = prod.name || '';
    document.getElementById('prodBadge').value = prod.badge || '';
    document.getElementById('prodDesc').value = prod.description || '';
    document.getElementById('prodModalDesc').value = prod.fullModalDesc || prod.description || '';
    document.getElementById('prodImage').value = prod.image || '';

    const imgSrc = prod.image.startsWith('http') || prod.image.startsWith('/') ? prod.image : `../${prod.image}`;
    document.getElementById('prodImagePreview').src = imgSrc;

    const specs = prod.specs || {};
    document.getElementById('prodSpecMethod').value = specs.method || '';
    document.getElementById('prodSpecRange').value = specs.range || '';
    document.getElementById('prodSpecAccuracy').value = specs.accuracy || '';
    document.getElementById('prodSpecOutput').value = specs.output || '';
    document.getElementById('prodSpecBullet1').value = specs.bullet1 || '';
    document.getElementById('prodSpecBullet2').value = specs.bullet2 || '';
  } else {
    title.textContent = 'Tambah Produk Baru';
    document.getElementById('prodId').value = '';
    document.getElementById('prodImagePreview').src = '../images/prod-mag-flowmeter-unit.png';
    document.getElementById('prodImage').value = 'images/prod-mag-flowmeter-unit.png';
  }

  modal.classList.add('active');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function editProduct(id) {
  const prod = currentProducts.find(p => p.id === id);
  if (prod) openProductModal(prod);
}

async function handleProductSubmit(event) {
  event.preventDefault();
  const id = document.getElementById('prodId').value;
  const brand = document.getElementById('prodBrand').value;

  const payload = {
    brand: brand,
    brandLabel: brand === 'greenprima' ? 'GreenPrima Instruments (UK)' : 'Shanghai Ecopro Environmental',
    category: document.getElementById('prodCategory').value,
    name: document.getElementById('prodName').value,
    badge: document.getElementById('prodBadge').value,
    description: document.getElementById('prodDesc').value,
    fullModalDesc: document.getElementById('prodModalDesc').value,
    image: document.getElementById('prodImage').value,
    specs: {
      method: document.getElementById('prodSpecMethod').value,
      range: document.getElementById('prodSpecRange').value,
      accuracy: document.getElementById('prodSpecAccuracy').value,
      output: document.getElementById('prodSpecOutput').value,
      bullet1: document.getElementById('prodSpecBullet1').value,
      bullet2: document.getElementById('prodSpecBullet2').value
    }
  };

  try {
    const url = id ? `${API_BASE}/products/${id}` : `${API_BASE}/products`;
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      showToast(data.message || 'Produk berhasil disimpan!', 'success');
      closeModal('modalProduct');
      await fetchProducts();
      await fetchStats();
    } else {
      showToast(data.message || 'Gagal menyimpan produk.', 'error');
    }
  } catch (err) {
    showToast('Terjadi kesalahan jaringan saat menyimpan produk.', 'error');
  }
}

async function deleteProduct(id, name) {
  if (!confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) return;

  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (data.success) {
      showToast('Produk berhasil dihapus.', 'success');
      await fetchProducts();
      await fetchStats();
    } else {
      showToast(data.message || 'Gagal menghapus produk.', 'error');
    }
  } catch (err) {
    showToast('Terjadi kesalahan jaringan saat menghapus produk.', 'error');
  }
}

function handleBrandChange() {
  const brand = document.getElementById('prodBrand').value;
  const badgeInput = document.getElementById('prodBadge');
  if (brand === 'greenprima' && !badgeInput.value) {
    badgeInput.value = '🇬🇧 GreenPrima • Flowmeter';
  } else if (brand === 'ecopro' && !badgeInput.value) {
    badgeInput.value = '🇨🇳 Ecopro • Water Equipment';
  }
}

// ==========================================================================
// 4. PROJECTS / PORTFOLIO CRUD
// ==========================================================================

async function fetchProjects() {
  try {
    const res = await fetch(`${API_BASE}/projects`);
    const data = await res.json();
    if (data.success) {
      currentProjects = data.projects || [];
      renderProjectsTable(currentProjects);
    }
  } catch (err) {
    console.error('Error fetching projects:', err);
  }
}

function renderProjectsTable(projects) {
  const tbody = document.getElementById('projectsTableBody');
  if (!tbody) return;

  if (projects.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-muted);">Tidak ada portofolio proyek.</td></tr>`;
    return;
  }

  tbody.innerHTML = projects.map(p => {
    const imgSrc = p.image.startsWith('http') || p.image.startsWith('/') ? p.image : `../${p.image}`;
    return `
      <tr>
        <td>
          <img src="${imgSrc}" alt="${p.title}" class="item-thumb" onerror="this.src='../images/proyek-soetta-dashboard.png'">
        </td>
        <td>
          <strong style="color: var(--primary);">${escapeHtml(p.title)}</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(p.groupLabel || p.group)}</div>
        </td>
        <td><span class="badge" style="background:#f1f5f9; color:var(--primary); font-weight:700;">${escapeHtml(p.client)}</span></td>
        <td>
          <div style="font-size: 0.8rem;">📍 ${escapeHtml(p.location)}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">🏷️ ${escapeHtml(p.tag)}</div>
        </td>
        <td>
          <span style="font-size: 0.75rem; color: #047857; background: var(--success-bg); padding: 0.2rem 0.5rem; border-radius: 4px;">
            ✓ ${escapeHtml(p.highlight || 'Presisi Mutu')}
          </span>
        </td>
        <td style="text-align: right;">
          <div class="row-actions" style="justify-content: flex-end;">
            <button class="btn-icon" title="Edit Proyek" onclick="editProject('${p.id}')">
              <i data-lucide="edit-3"></i>
            </button>
            <button class="btn-icon delete" title="Hapus Proyek" onclick="deleteProject('${p.id}', '${escapeHtml(p.title)}')">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function filterProjects() {
  const q = document.getElementById('projSearchInput').value.toLowerCase();
  const group = document.getElementById('projGroupFilter').value;

  const filtered = currentProjects.filter(p => {
    const matchGroup = (group === 'all' || (p.group || '').includes(group));
    const matchQuery = p.title.toLowerCase().includes(q) || 
                       p.client.toLowerCase().includes(q) ||
                       p.location.toLowerCase().includes(q) ||
                       p.story.toLowerCase().includes(q);
    return matchGroup && matchQuery;
  });

  renderProjectsTable(filtered);
}

function openProjectModal(proj = null) {
  const modal = document.getElementById('modalProject');
  const title = document.getElementById('modalProjectTitle');
  const form = document.getElementById('projectForm');
  form.reset();

  if (proj) {
    title.textContent = 'Edit Proyek: ' + proj.title;
    document.getElementById('projId').value = proj.id;
    document.getElementById('projGroup').value = proj.group || 'airport';
    document.getElementById('projClient').value = proj.client || '';
    document.getElementById('projTitle').value = proj.title || '';
    document.getElementById('projLocation').value = proj.location || '';
    document.getElementById('projTag').value = proj.tag || '';
    document.getElementById('projStory').value = proj.story || '';
    document.getElementById('projHighlight').value = proj.highlight || '';
    document.getElementById('projImage').value = proj.image || '';

    const imgSrc = proj.image.startsWith('http') || proj.image.startsWith('/') ? proj.image : `../${proj.image}`;
    document.getElementById('projImagePreview').src = imgSrc;
  } else {
    title.textContent = 'Tambah Portofolio Proyek';
    document.getElementById('projId').value = '';
    document.getElementById('projImagePreview').src = '../images/proyek-soetta-dashboard.png';
    document.getElementById('projImage').value = 'images/proyek-soetta-dashboard.png';
  }

  modal.classList.add('active');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function editProject(id) {
  const proj = currentProjects.find(p => p.id === id);
  if (proj) openProjectModal(proj);
}

async function handleProjectSubmit(event) {
  event.preventDefault();
  const id = document.getElementById('projId').value;

  const payload = {
    group: document.getElementById('projGroup').value,
    client: document.getElementById('projClient').value,
    title: document.getElementById('projTitle').value,
    location: document.getElementById('projLocation').value,
    tag: document.getElementById('projTag').value,
    story: document.getElementById('projStory').value,
    highlight: document.getElementById('projHighlight').value,
    image: document.getElementById('projImage').value
  };

  try {
    const url = id ? `${API_BASE}/projects/${id}` : `${API_BASE}/projects`;
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      showToast(data.message || 'Portofolio proyek berhasil disimpan!', 'success');
      closeModal('modalProject');
      await fetchProjects();
      await fetchStats();
    } else {
      showToast(data.message || 'Gagal menyimpan proyek.', 'error');
    }
  } catch (err) {
    showToast('Terjadi kesalahan jaringan saat menyimpan portofolio proyek.', 'error');
  }
}

async function deleteProject(id, title) {
  if (!confirm(`Apakah Anda yakin ingin menghapus portofolio "${title}"?`)) return;

  try {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (data.success) {
      showToast('Portofolio proyek berhasil dihapus.', 'success');
      await fetchProjects();
      await fetchStats();
    } else {
      showToast(data.message || 'Gagal menghapus proyek.', 'error');
    }
  } catch (err) {
    showToast('Terjadi kesalahan jaringan saat menghapus proyek.', 'error');
  }
}

// ==========================================================================
// 5. SERVICES CRUD
// ==========================================================================

async function fetchServices() {
  try {
    const res = await fetch(`${API_BASE}/services`);
    const data = await res.json();
    if (data.success) {
      currentServices = data.services || [];
      renderServicesTable(currentServices);
    }
  } catch (err) {
    console.error('Error fetching services:', err);
  }
}

function renderServicesTable(services) {
  const tbody = document.getElementById('servicesTableBody');
  if (!tbody) return;

  tbody.innerHTML = services.map(s => {
    const featList = (s.features || []).map(f => `<li>• ${escapeHtml(f)}</li>`).join('');
    return `
      <tr>
        <td>
          <div class="stat-icon blue" style="width:36px; height:36px;"><i data-lucide="${s.icon || 'wrench'}"></i></div>
        </td>
        <td>
          <strong style="color: var(--primary);">${escapeHtml(s.title)}</strong>
        </td>
        <td style="font-size: 0.8rem; color: var(--text-muted); max-width: 320px;">
          ${escapeHtml(s.description)}
        </td>
        <td>
          <ul style="font-size: 0.75rem; list-style:none;">${featList}</ul>
        </td>
        <td>
          ${s.featured ? '<span class="badge badge-brand-gp">⭐ Solusi Favorit</span>' : '<span class="badge badge-status-read">Standar</span>'}
        </td>
        <td style="text-align: right;">
          <div class="row-actions" style="justify-content: flex-end;">
            <button class="btn-icon" title="Edit Layanan" onclick="editService('${s.id}')">
              <i data-lucide="edit-3"></i>
            </button>
            <button class="btn-icon delete" title="Hapus Layanan" onclick="deleteService('${s.id}', '${escapeHtml(s.title)}')">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function openServiceModal(srv = null) {
  const modal = document.getElementById('modalService');
  const title = document.getElementById('modalServiceTitle');
  const form = document.getElementById('serviceForm');
  form.reset();

  if (srv) {
    title.textContent = 'Edit Layanan: ' + srv.title;
    document.getElementById('srvId').value = srv.id;
    document.getElementById('srvTitle').value = srv.title || '';
    document.getElementById('srvIcon').value = srv.icon || 'wrench';
    document.getElementById('srvDesc').value = srv.description || '';
    document.getElementById('srvFeatures').value = (srv.features || []).join('\n');
    document.getElementById('srvImage').value = srv.image || '';
    document.getElementById('srvFeatured').checked = !!srv.featured;
  } else {
    title.textContent = 'Tambah Layanan Baru';
    document.getElementById('srvId').value = '';
  }

  modal.classList.add('active');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function editService(id) {
  const srv = currentServices.find(s => s.id === id);
  if (srv) openServiceModal(srv);
}

async function handleServiceSubmit(event) {
  event.preventDefault();
  const id = document.getElementById('srvId').value;
  const feats = document.getElementById('srvFeatures').value
    .split('\n')
    .map(f => f.trim())
    .filter(f => f.length > 0);

  const payload = {
    title: document.getElementById('srvTitle').value,
    icon: document.getElementById('srvIcon').value,
    description: document.getElementById('srvDesc').value,
    features: feats,
    image: document.getElementById('srvImage').value,
    featured: document.getElementById('srvFeatured').checked
  };

  try {
    const url = id ? `${API_BASE}/services/${id}` : `${API_BASE}/services`;
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      showToast(data.message || 'Layanan berhasil disimpan!', 'success');
      closeModal('modalService');
      await fetchServices();
      await fetchStats();
    } else {
      showToast(data.message || 'Gagal menyimpan layanan.', 'error');
    }
  } catch (err) {
    showToast('Terjadi kesalahan jaringan saat menyimpan layanan.', 'error');
  }
}

async function deleteService(id, title) {
  if (!confirm(`Apakah Anda yakin ingin menghapus layanan "${title}"?`)) return;

  try {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (data.success) {
      showToast('Layanan berhasil dihapus.', 'success');
      await fetchServices();
      await fetchStats();
    } else {
      showToast(data.message || 'Gagal menghapus layanan.', 'error');
    }
  } catch (err) {
    showToast('Terjadi kesalahan jaringan saat menghapus layanan.', 'error');
  }
}

// ==========================================================================
// 6. CONTACT MESSAGES / INBOX
// ==========================================================================

async function fetchMessages() {
  try {
    const res = await fetch(`${API_BASE}/messages`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (data.success) {
      currentMessages = data.messages || [];
      renderMessagesTable(currentMessages);
      renderRecentOverviewMessages(currentMessages);
    }
  } catch (err) {
    console.error('Error fetching messages:', err);
  }
}

function renderMessagesTable(messages) {
  const tbody = document.getElementById('messagesTableBody');
  if (!tbody) return;

  if (messages.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--text-muted);">Belum ada pesan masuk.</td></tr>`;
    return;
  }

  tbody.innerHTML = messages.map(m => {
    const dateStr = new Date(m.createdAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
    const statusBadge = m.status === 'unread' 
      ? '<span class="badge badge-status-unread">Baru (Unread)</span>' 
      : '<span class="badge badge-status-read">Selesai</span>';

    const cleanPhone = m.phone.replace(/[^0-9]/g, '');
    const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const waText = encodeURIComponent(`Halo Bpk/Ibu ${m.name} (${m.company}), kami dari tim PT Panca Lingga Perkasa ingin menindaklanjuti pesan Anda terkait: ${m.service}`);

    return `
      <tr style="${m.status === 'unread' ? 'background: #fffbeb;' : ''}">
        <td style="font-size: 0.8rem; color: var(--text-light); white-space: nowrap;">${dateStr}</td>
        <td>
          <strong style="color: var(--primary);">${escapeHtml(m.name)}</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(m.company)}</div>
        </td>
        <td>
          <a href="https://wa.me/${waPhone}?text=${waText}" target="_blank" style="color: #0284c7; text-decoration: none; font-weight: 600;">
            📱 ${escapeHtml(m.phone)}
          </a>
        </td>
        <td><span class="badge" style="background:#f1f5f9;">${escapeHtml(m.service)}</span></td>
        <td style="font-size: 0.8rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${escapeHtml(m.message)}
        </td>
        <td>${statusBadge}</td>
        <td style="text-align: right;">
          <div class="row-actions" style="justify-content: flex-end;">
            <button class="btn-icon" title="Lihat Pesan Lengkap" onclick="viewMessageDetail('${m.id}')">
              <i data-lucide="eye"></i>
            </button>
            <button class="btn-icon delete" title="Hapus Pesan" onclick="deleteMessage('${m.id}')">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderRecentOverviewMessages(messages) {
  const tbody = document.getElementById('overviewRecentMsgTable');
  if (!tbody) return;

  const recent = messages.slice(0, 5);
  if (recent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 1.5rem; color: var(--text-muted);">Belum ada pesan konsultasi masuk.</td></tr>`;
    return;
  }

  tbody.innerHTML = recent.map(m => {
    const dateStr = new Date(m.createdAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
    const statusBadge = m.status === 'unread' 
      ? '<span class="badge badge-status-unread">Baru</span>' 
      : '<span class="badge badge-status-read">Dibaca</span>';

    return `
      <tr>
        <td style="font-size: 0.75rem; color: var(--text-light);">${dateStr}</td>
        <td><strong>${escapeHtml(m.name)}</strong> (${escapeHtml(m.company)})</td>
        <td>${escapeHtml(m.phone)}</td>
        <td>${escapeHtml(m.service)}</td>
        <td>${statusBadge}</td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="viewMessageDetail('${m.id}')">
            <i data-lucide="eye"></i> Buka
          </button>
        </td>
      </tr>
    `;
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function filterMessages() {
  const q = document.getElementById('msgSearchInput').value.toLowerCase();
  const status = document.getElementById('msgStatusFilter').value;

  const filtered = currentMessages.filter(m => {
    const matchStatus = (status === 'all' || m.status === status);
    const matchQuery = m.name.toLowerCase().includes(q) ||
                       m.company.toLowerCase().includes(q) ||
                       m.phone.includes(q) ||
                       m.message.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  renderMessagesTable(filtered);
}

async function viewMessageDetail(id) {
  const msg = currentMessages.find(m => m.id === id);
  if (!msg) return;

  document.getElementById('viewMsgName').textContent = msg.name;
  document.getElementById('viewMsgCompany').textContent = msg.company || '-';
  document.getElementById('viewMsgPhone').textContent = msg.phone;
  document.getElementById('viewMsgService').textContent = msg.service;
  document.getElementById('viewMsgContent').textContent = msg.message;
  document.getElementById('viewMsgTime').textContent = new Date(msg.createdAt).toLocaleString('id-ID');

  const cleanPhone = msg.phone.replace(/[^0-9]/g, '');
  const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
  const waText = encodeURIComponent(`Halo Bpk/Ibu ${msg.name} (${msg.company}), kami dari tim PT Panca Lingga Perkasa ingin menindaklanjuti konsultasi Anda terkait layanan: ${msg.service}`);
  document.getElementById('viewMsgWaLink').href = `https://wa.me/${waPhone}?text=${waText}`;

  // Automatically mark as read
  if (msg.status === 'unread') {
    try {
      await fetch(`${API_BASE}/messages/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: 'read' })
      });
      await fetchMessages();
      await fetchStats();
    } catch (e) {
      console.warn(e);
    }
  }

  document.getElementById('modalViewMessage').classList.add('active');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

async function deleteMessage(id) {
  if (!confirm('Hapus pesan ini dari inbox?')) return;

  try {
    const res = await fetch(`${API_BASE}/messages/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (data.success) {
      showToast('Pesan berhasil dihapus.', 'success');
      await fetchMessages();
      await fetchStats();
    }
  } catch (err) {
    showToast('Gagal menghapus pesan.', 'error');
  }
}

// ==========================================================================
// 7. SETTINGS & PROFILE
// ==========================================================================

async function fetchSettings() {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    const data = await res.json();
    if (data.success && data.settings) {
      currentSettings = data.settings;
      populateSettingsForm(data.settings);
    }
  } catch (err) {
    console.error('Error fetching settings:', err);
  }
}

function populateSettingsForm(s) {
  document.getElementById('setCompanyName').value = s.companyName || '';
  document.getElementById('setSinceYear').value = s.sinceYear || 2015;
  document.getElementById('setTagline').value = s.tagline || '';
  document.getElementById('setMotto').value = s.motto || '';
  document.getElementById('setWhatsApp').value = s.whatsapp || '';
  document.getElementById('setEmail').value = s.email || '';
  document.getElementById('setAddressTangerang').value = s.addressTangerang || '';
  document.getElementById('setAddressCirebon').value = s.addressCirebon || '';
  document.getElementById('setOperatingHours').value = s.operatingHours || '';
  document.getElementById('setMetaDescription').value = s.metaDescription || '';
}

async function handleSaveSettings(event) {
  event.preventDefault();
  const payload = {
    companyName: document.getElementById('setCompanyName').value,
    sinceYear: parseInt(document.getElementById('setSinceYear').value, 10),
    tagline: document.getElementById('setTagline').value,
    motto: document.getElementById('setMotto').value,
    whatsapp: document.getElementById('setWhatsApp').value,
    phone: document.getElementById('setWhatsApp').value,
    email: document.getElementById('setEmail').value,
    addressTangerang: document.getElementById('setAddressTangerang').value,
    addressCirebon: document.getElementById('setAddressCirebon').value,
    operatingHours: document.getElementById('setOperatingHours').value,
    metaDescription: document.getElementById('setMetaDescription').value
  };

  try {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      showToast('Pengaturan profil website berhasil disimpan!', 'success');
      currentSettings = data.settings;
    } else {
      showToast(data.message || 'Gagal menyimpan pengaturan.', 'error');
    }
  } catch (err) {
    showToast('Terjadi kesalahan jaringan saat menyimpan pengaturan.', 'error');
  }
}

// ==========================================================================
// 8. MEDIA UPLOADER HELPER
// ==========================================================================

async function uploadImage(fileInput, targetInputId, previewImgId = null) {
  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  showToast('Mengunggah file...', 'info');

  try {
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: formData
    });
    const data = await res.json();

    if (data.success && data.filePath) {
      document.getElementById(targetInputId).value = data.filePath;
      if (previewImgId) {
        document.getElementById(previewImgId).src = `../${data.filePath}`;
      }
      showToast('File berhasil diunggah!', 'success');
    } else {
      showToast(data.message || 'Upload gagal.', 'error');
    }
  } catch (err) {
    showToast('Terjadi kesalahan jaringan saat mengunggah file.', 'error');
  }
}

// ==========================================================================
// 9. PASSWORD MODAL
// ==========================================================================

function openPasswordModal() {
  document.getElementById('passwordForm').reset();
  document.getElementById('modalPassword').classList.add('active');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

async function handleChangePassword(event) {
  event.preventDefault();
  const currentPassword = document.getElementById('currPass').value;
  const newPassword = document.getElementById('newPass').value;
  const confirmPassword = document.getElementById('confirmPass').value;

  if (newPassword !== confirmPassword) {
    showToast('Konfirmasi password baru tidak cocok!', 'error');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (data.success) {
      showToast('Password berhasil diubah. Silakan gunakan password baru pada login berikutnya.', 'success');
      closeModal('modalPassword');
    } else {
      showToast(data.message || 'Gagal mengubah password.', 'error');
    }
  } catch (err) {
    showToast('Terjadi kesalahan jaringan saat mengubah password.', 'error');
  }
}

// Modal Helpers
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// Close modal when clicking backdrop
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('active');
  }
});

// Escape key to close modals
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.modal-backdrop.active');
    if (activeModal) activeModal.classList.remove('active');
  }
});

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
