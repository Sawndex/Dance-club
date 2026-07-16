/* ==========================================================================
   APU DANCE CLUB — script.js
   Handles: mobile nav, sticky header, hero slider, scroll-reveal animations,
   back-to-top, FAQ accordion behaviour, form validation/feedback,
   gallery lightbox, dynamic footer year.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initStickyHeader();
  initNavAutoHide();
  initNavOthersDropdown();
  initHeroSlider();
  initScrollReveal();
  initBackToTop();
  initFaqAccordion();
  initFaqSearch();
  initForms();
  initGalleryLightbox();
  initFooterYear();
});

/* -------------------------------------------------------------------------
   Mobile navigation toggle
   ------------------------------------------------------------------------- */
function initNavToggle() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a link is clicked (mobile)
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
}

/* -------------------------------------------------------------------------
   Header bar auto-hide — the whole bar (background + nav pill) detaches
   on scroll-down and re-attaches on scroll-up. The logo lives outside the
   header now (see .site-logo), so it's unaffected by this and stays fixed
   in place the entire time.
   ------------------------------------------------------------------------- */
function initNavAutoHide() {
  const header = document.querySelector('header');
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;
  const REVEAL_THRESHOLD = 80; // don't hide near the very top of the page

  function update() {
    const currentY = window.scrollY;
    const nav = document.getElementById('primary-nav');
    const navIsOpenOnMobile = nav && nav.classList.contains('open');

    if (currentY <= REVEAL_THRESHOLD || navIsOpenOnMobile) {
      header.classList.remove('nav-hidden');
    } else if (currentY > lastY) {
      // scrolling down
      header.classList.add('nav-hidden');
      closeOthersDropdown();
    } else if (currentY < lastY) {
      // scrolling up
      header.classList.remove('nav-hidden');
    }

    lastY = currentY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

/* -------------------------------------------------------------------------
   "Others" dropdown — bouncy open animation, springy close animation
   ------------------------------------------------------------------------- */
function closeOthersDropdown() {
  const toggle = document.getElementById('nav-others-toggle');
  const menu = document.getElementById('nav-others-menu');
  if (!menu || !toggle) return;
  if (!menu.classList.contains('open')) return;

  menu.classList.remove('open');
  menu.classList.add('closing');
  toggle.setAttribute('aria-expanded', 'false');

  const clearClosing = () => {
    menu.classList.remove('closing');
    menu.removeEventListener('animationend', clearClosing);
  };
  menu.addEventListener('animationend', clearClosing);
}

function initNavOthersDropdown() {
  const toggle = document.getElementById('nav-others-toggle');
  const menu = document.getElementById('nav-others-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.contains('open');
    if (isOpen) {
      closeOthersDropdown();
    } else {
      menu.classList.remove('closing');
      menu.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      closeOthersDropdown();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeOthersDropdown();
      toggle.focus();
    }
  });

  // Close after choosing a link
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeOthersDropdown());
  });
}


function initStickyHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  const onScroll = () => {
    const isScrolled = window.scrollY > 20;
    header.classList.toggle('scrolled', isScrolled);
    // Drives the fixed logo's size morph (bigger at top, compact once scrolled).
    document.body.classList.toggle('page-scrolled', isScrolled);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* -------------------------------------------------------------------------
   Hero slider — auto-advance, manual controls, dot navigation,
   pause on hover/focus, keyboard accessible
   ------------------------------------------------------------------------- */
function initHeroSlider() {
  const slider = document.getElementById('hero-slider');
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('.hero-slide'));
  const dots = Array.from(slider.querySelectorAll('.slider-dot'));
  const prevBtn = slider.querySelector('.slider-prev');
  const nextBtn = slider.querySelector('.slider-next');
  if (!slides.length) return;

  let current = Math.max(0, slides.findIndex(s => s.classList.contains('active')));
  let timer = null;
  const INTERVAL = 6000;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    dots[current] && dots[current].setAttribute('aria-selected', 'false');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
    dots[current] && dots[current].setAttribute('aria-selected', 'true');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function start() {
    if (reduceMotion) return;
    stop();
    timer = setInterval(next, INTERVAL);
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  nextBtn && nextBtn.addEventListener('click', () => { next(); start(); });
  prevBtn && prevBtn.addEventListener('click', () => { prev(); start(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); start(); }));

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  slider.addEventListener('focusin', stop);
  slider.addEventListener('focusout', start);

  // Keyboard arrows when slider (or its children) has focus
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); start(); }
    if (e.key === 'ArrowLeft') { prev(); start(); }
  });

  start();
}

/* -------------------------------------------------------------------------
   Scroll-reveal: fade/slide sections & cards into view
   ------------------------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    'main > section, .event-card, .team-card, .showcase-item, .blog-post, .testimonial-card, .faq-item'
  );
  if (!targets.length) return;

  targets.forEach(el => el.classList.add('reveal'));

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* -------------------------------------------------------------------------
   Back-to-top button
   ------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const onScroll = () => btn.classList.toggle('visible', window.scrollY > 480);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* -------------------------------------------------------------------------
   FAQ accordion — only one item open at a time
   ------------------------------------------------------------------------- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        items.forEach(other => {
          if (other !== item) other.open = false;
        });
      }
    });
  });
}

/* -------------------------------------------------------------------------
   FAQ search — filters the accordion items live as the user types,
   matching against both the question and the answer text.
   ------------------------------------------------------------------------- */
function initFaqSearch() {
  const input = document.getElementById('faq-search-input');
  const items = document.querySelectorAll('.faq-item');
  const emptyMessage = document.getElementById('faq-search-empty');
  if (!input || !items.length) return;

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    let visibleCount = 0;

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const matches = query === '' || text.includes(query);
      item.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
  });
}

/* -------------------------------------------------------------------------
   Forms — client-side validation + friendly inline feedback
   (No backend is wired up yet; this simulates submission so the UI
   is fully demonstrable. Replace with a real endpoint when ready.)
   ------------------------------------------------------------------------- */
function initForms() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(form);
    });
  });
}

function handleFormSubmit(form) {
  const feedback = form.querySelector('.form-message');
  const requiredFields = Array.from(form.querySelectorAll('[required]'));
  const invalid = requiredFields.filter(field => !field.checkValidity());

  if (invalid.length) {
    invalid[0].focus();
    if (feedback) {
      feedback.textContent = 'Please fill in all required fields correctly before submitting.';
      feedback.className = 'form-message error';
    }
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalLabel = submitBtn ? submitBtn.textContent : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
  }

  // Simulated async submission (swap for a real fetch() call to your backend)
  setTimeout(() => {
    if (feedback) {
      feedback.textContent = 'Thanks! Your submission has been received.';
      feedback.className = 'form-message success';
    }
    form.reset();
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  }, 700);
}

/* -------------------------------------------------------------------------
   Gallery lightbox
   ------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const galleryImages = document.querySelectorAll('#photo-gallery .image-grid img, #gallery-preview .image-grid img');
  if (!galleryImages.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close image viewer">&times;</button>
    <img src="" alt="">
  `;
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  let lastTrigger = null;

  function open(img) {
    lastTrigger = img;
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lightbox.classList.add('open');
    closeBtn.focus();
  }
  function close() {
    lightbox.classList.remove('open');
    if (lastTrigger) lastTrigger.focus();
  }

  galleryImages.forEach(img => {
    img.style.cursor = 'zoom-in';
    // Images aren't natively focusable/operable — give them button semantics
    // so keyboard and screen-reader users can open the lightbox too.
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    if (!img.hasAttribute('aria-label')) {
      img.setAttribute('aria-label', `View larger image: ${img.alt || 'gallery photo'}`);
    }
    img.addEventListener('click', () => open(img));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(img);
      }
    });
  });

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) close();
  });
}

/* -------------------------------------------------------------------------
   Footer year — keeps copyright current automatically
   ------------------------------------------------------------------------- */
function initFooterYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll('footer p').forEach(p => {
    if (p.textContent.includes('All rights reserved')) {
      p.innerHTML = p.innerHTML.replace(/\d{4}/, String(year));
    }
  });
}
