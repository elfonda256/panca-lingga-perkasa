/**
 * PT PANCA LINGGA PERKASA - INTERACTIVE SCRIPTS
 * Lucide Icons, Filter Animations, Modal, Form to WhatsApp Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const menuIcon = document.getElementById('menuIcon');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking nav links on mobile
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
        }
      });
    });
  }

  // 3. Brand Switcher Tabs (GreenPrima vs Shanghai Ecopro)
  const brandTabs = document.querySelectorAll('.brand-tab');
  const brandPanes = document.querySelectorAll('.brand-pane');

  brandTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      brandTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.getAttribute('data-target');
      brandPanes.forEach(pane => {
        if (pane.id === targetId) {
          pane.style.display = 'block';
          pane.classList.add('active');
          setTimeout(() => {
            pane.style.opacity = '1';
          }, 20);
        } else {
          pane.style.display = 'none';
          pane.classList.remove('active');
          pane.style.opacity = '0';
        }
      });
    });
  });

  // 4. Product Sub-Filters (Scoped per brand pane)
  brandPanes.forEach(pane => {
    const filterBtns = pane.querySelectorAll('.filter-btn');
    const productCards = pane.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        productCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category') || '';
          const categories = cardCategory.split(' ');
          if (filterValue === 'all' || categories.includes(filterValue)) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 200);
          }
        });
      });
    });
  });

  // 4. Portfolio / Jejak Langkah Filter
  const portFilterBtns = document.querySelectorAll('.port-filter-btn');
  const portCards = document.querySelectorAll('.portfolio-card');

  portFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      portFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const groupValue = btn.getAttribute('data-port');

      portCards.forEach(card => {
        const cardGroup = card.getAttribute('data-group');
        if (groupValue === 'all' || cardGroup === groupValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 5. Active Navbar Link Highlight on Scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-list a[href*=${sectionId}]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        if (navItem) navItem.classList.add('active');
      } else {
        if (navItem) navItem.classList.remove('active');
      }
    });
  });
});

/**
 * Product Modal Logic
 */
function openProductModal(name, desc, method, range, accuracy, output) {
  const modal = document.getElementById('productModal');
  document.getElementById('modalProductName').textContent = name;
  document.getElementById('modalProductDesc').textContent = desc;
  document.getElementById('modalSpecMethod').textContent = method;
  document.getElementById('modalSpecRange').textContent = range;
  document.getElementById('modalSpecAccuracy').textContent = accuracy;
  document.getElementById('modalSpecOutput').textContent = output;

  const waText = encodeURIComponent(`Halo Tim PT Panca Lingga Perkasa, saya tertarik untuk mendiskusikan spesifikasi teknis dan penawaran harga untuk produk: ${name}.`);
  document.getElementById('modalWaBtn').setAttribute('href', `https://wa.me/6281390506150?text=${waText}`);

  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // prevent background scrolling
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Close modal when clicking outside of the modal box
window.addEventListener('click', (e) => {
  const modal = document.getElementById('productModal');
  if (e.target === modal) {
    closeProductModal();
  }
});

// Close modal on Escape key press
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProductModal();
  }
});

/**
 * Contact Form to WhatsApp & Database Integration
 */
async function handleFormSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value;
  const company = document.getElementById('company').value;
  const phone = document.getElementById('phone').value;
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value;

  // Asynchronously save to backend database if API is running
  try {
    fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, company, phone, service, message })
    }).catch(e => console.log('Backend offline or static mode:', e));
  } catch (e) {
    // Ignore error
  }

  const text = `*Halo PT Panca Lingga Perkasa, Ada Pesan Masuk dari Website:*\n\n` +
               `*Nama:* ${name}\n` +
               `*Instansi/Perusahaan:* ${company}\n` +
               `*WhatsApp/Telp:* ${phone}\n` +
               `*Kategori Layanan:* ${service}\n` +
               `*Rincian Kebutuhan:*\n${message}\n\n` +
               `_Mohon tindak lanjut dan konfirmasi penawarannya. Terima kasih!_`;

  const waUrl = `https://wa.me/6281390506150?text=${encodeURIComponent(text)}`;
  
  // Open WhatsApp in new tab
  window.open(waUrl, '_blank');
}

/**
 * 6. Theme Toggle (Mode Siang & Mode Malam)
 */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleMobile = document.getElementById('themeToggleMobile');

  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('plp_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('plp_theme', 'light');
    }
  }

  // Load saved theme (default light mode for pristine readability)
  const savedTheme = localStorage.getItem('plp_theme');
  if (savedTheme === 'dark') {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(isDark ? 'light' : 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', toggleTheme);
  }
}

// Initialize theme on load
initTheme();

/**
 * 7. Scroll Reveal & Staggered Animations
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.section-head, .story-card, .human-highlight-card, .vision-mission-box, ' +
    '.service-card, .product-card, .portfolio-card, .why-card, .pillar-card, ' +
    '.client-logo-card, .legality-card, .contact-form-card, .quick-callout-box, .loc-card'
  );

  revealElements.forEach(el => {
    el.classList.add('reveal-item');
  });

  // Apply staggered delay for grid items
  const grids = document.querySelectorAll('.service-grid, .product-grid, .portfolio-grid, .why-grid, .client-logo-grid, .legality-grid');
  grids.forEach(grid => {
    const items = grid.children;
    Array.from(items).forEach((item, index) => {
      item.style.transitionDelay = `${(index % 6) * 100}ms`;
    });
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once animated, we don't need to observe it again
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * 8. Animated Number Counter on Scroll
 */
function initNumberCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        const match = text.match(/^(\d+)(.*)$/);
        
        if (match) {
          const targetNum = parseInt(match[1], 10);
          const suffix = match[2] || '';
          let currentNum = 0;
          const duration = 1400;
          const startTime = performance.now();

          function updateCounter(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            currentNum = Math.floor(easeProgress * targetNum);
            el.textContent = currentNum + suffix;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = targetNum + suffix;
            }
          }

          requestAnimationFrame(updateCounter);
        }
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => counterObserver.observe(num));
}

/**
 * 9. Back To Top Floating Button with Scroll Progress
 */
function initBackToTop() {
  let backBtn = document.getElementById('backToTop');
  if (!backBtn) {
    backBtn = document.createElement('button');
    backBtn.id = 'backToTop';
    backBtn.className = 'back-to-top';
    backBtn.setAttribute('aria-label', 'Kembali ke atas');
    backBtn.innerHTML = `
      <svg class="progress-ring" width="48" height="48">
        <circle class="progress-ring-circle" stroke="var(--color-amber)" stroke-width="3" fill="transparent" r="21" cx="24" cy="24"/>
      </svg>
      <i data-lucide="arrow-up" class="icon-sm"></i>
    `;
    document.body.appendChild(backBtn);
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  const circle = backBtn.querySelector('.progress-ring-circle');
  const radius = circle.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = `${circumference}`;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollFraction = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    const offset = circumference - scrollFraction * circumference;
    circle.style.strokeDashoffset = offset;

    if (scrollTop > 350) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 10. Subtle 3D Tilt Parallax on Hero Visual Card
 */
function initHeroTilt() {
  const heroCard = document.querySelector('.main-card');
  if (!heroCard) return;

  heroCard.addEventListener('mousemove', (e) => {
    const rect = heroCard.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = (y / rect.height) * -8;
    const tiltY = (x / rect.width) * 8;

    heroCard.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  heroCard.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/**
 * 11. Dynamic API Content Hydration (Synchronize with CMS Backend)
 */
async function initLiveDynamicData() {
  try {
    // 1. Fetch Products
    const prodRes = await fetch('/api/products');
    if (prodRes.ok) {
      const prodData = await prodRes.json();
      if (prodData.success && Array.isArray(prodData.products) && prodData.products.length > 0) {
        renderDynamicProducts(prodData.products);
      }
    }

    // 2. Fetch Projects
    const projRes = await fetch('/api/projects');
    if (projRes.ok) {
      const projData = await projRes.json();
      if (projData.success && Array.isArray(projData.projects) && projData.projects.length > 0) {
        renderDynamicProjects(projData.projects);
      }
    }
  } catch (e) {
    // Graceful fallback to static DOM if backend is not running
  }
}

function renderDynamicProducts(products) {
  const gpGrid = document.getElementById('greenprimaGrid');
  const ecoGrid = document.getElementById('ecoproGrid');

  const gpProducts = products.filter(p => p.brand === 'greenprima');
  const ecoProducts = products.filter(p => p.brand === 'ecopro');

  if (gpGrid && gpProducts.length > 0) {
    gpGrid.innerHTML = gpProducts.map(p => generateProductCardHtml(p)).join('');
  }

  if (ecoGrid && ecoProducts.length > 0) {
    ecoGrid.innerHTML = ecoProducts.map(p => generateProductCardHtml(p)).join('');
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function generateProductCardHtml(p) {
  const specs = p.specs || {};
  const b1 = specs.bullet1 ? `<span><i data-lucide="check-circle" class="icon-xs"></i> ${escapeHtmlForAttr(specs.bullet1)}</span>` : '';
  const b2 = specs.bullet2 ? `<span><i data-lucide="check-circle" class="icon-xs"></i> ${escapeHtmlForAttr(specs.bullet2)}</span>` : '';
  const badgeStyle = p.brand === 'ecopro' ? 'style="background:#0284c7;"' : '';
  
  const modalDesc = p.fullModalDesc || p.description || '';
  const modalArgs = [
    p.name || '',
    modalDesc,
    specs.method || '-',
    specs.range || '-',
    specs.accuracy || '-',
    specs.output || '-'
  ].map(str => `'${escapeHtmlForAttr(str)}'`).join(', ');

  return `
    <div class="product-card" data-category="${p.category || 'all'}">
      <div class="product-img-wrap">
        <span class="product-category-badge" ${badgeStyle}>${p.badge || (p.brand === 'greenprima' ? '🇬🇧 GreenPrima' : '🇨🇳 Ecopro')}</span>
        <img src="${p.image}" alt="${escapeHtmlForAttr(p.name)}" class="product-img" onerror="this.src='images/prod-mag-flowmeter-unit.png'">
      </div>
      <div class="product-body">
        <h3 class="product-name">${escapeHtmlForAttr(p.name)}</h3>
        <p class="product-desc">${escapeHtmlForAttr(p.description)}</p>
        <div class="product-specs">
          ${b1}
          ${b2}
        </div>
        <div class="product-footer">
          <button class="btn btn-outline btn-block" onclick="openProductModal(${modalArgs})">
            <span>Lihat Detail Spesifikasi</span>
            <i data-lucide="external-link" class="icon-xs"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderDynamicProjects(projects) {
  const portGrid = document.getElementById('portfolioGrid');
  if (!portGrid || projects.length === 0) return;

  portGrid.innerHTML = projects.map(p => `
    <div class="portfolio-card" data-group="${p.group || 'all'}">
      <div class="portfolio-media">
        <img src="${p.image}" alt="${escapeHtmlForAttr(p.title)}" class="portfolio-img" onerror="this.src='images/proyek-soetta-dashboard.png'">
        <span class="port-client-badge">${escapeHtmlForAttr(p.client)}</span>
      </div>
      <div class="portfolio-body">
        <div class="portfolio-meta">
          <span><i data-lucide="map-pin" class="icon-xs"></i> ${escapeHtmlForAttr(p.location)}</span>
          <span><i data-lucide="tag" class="icon-xs"></i> ${escapeHtmlForAttr(p.tag)}</span>
        </div>
        <h3 class="port-title">${escapeHtmlForAttr(p.title)}</h3>
        <p class="port-story">${escapeHtmlForAttr(p.story)}</p>
        <div class="port-highlight-pill">
          <i data-lucide="check-circle" class="icon-xs"></i> ${escapeHtmlForAttr(p.highlight || 'Presisi Mutu')}
        </div>
      </div>
    </div>
  `).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function escapeHtmlForAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Run all animations once DOM is fully ready
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNumberCounters();
  initBackToTop();
  initHeroTilt();
  initLiveDynamicData();
});


