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
 * Contact Form to WhatsApp Submit Handler
 */
function handleFormSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value;
  const company = document.getElementById('company').value;
  const phone = document.getElementById('phone').value;
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value;

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

