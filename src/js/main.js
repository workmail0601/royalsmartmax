/* ============================================================
   ROYAL SMART MAX LTD — Main JavaScript
   Navigation, Scroll Effects, Reveal Animations, Forms
   ============================================================ */

(function () {
  'use strict';

  /* --- NAV SCROLL EFFECT --- */
  const siteNav = document.getElementById('siteNav');
  if (siteNav) {
    const onScroll = () => {
      siteNav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- MOBILE MENU TOGGLE --- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen.toString());
      mobileMenu.setAttribute('aria-hidden', (!isOpen).toString());
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });
  }

  /* --- ACTIVE NAV LINK --- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    const page = link.dataset.page;
    if (
      (page === 'home' && (currentPage === '' || currentPage === 'index.html')) ||
      currentPage.startsWith(page)
    ) {
      link.classList.add('active');
    }
  });

  /* --- SCROLL REVEAL (IntersectionObserver) --- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* --- CONTACT FORM VALIDATION & SUBMISSION --- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Clear previous errors
      contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));

      // Validate required fields
      contactForm.querySelectorAll('[required]').forEach(field => {
        const group = field.closest('.form-group');
        if (!field.value.trim()) {
          group.classList.add('has-error');
          valid = false;
        }
      });

      // Email format validation
      const emailField = contactForm.querySelector('input[type="email"]');
      if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
          emailField.closest('.form-group').classList.add('has-error');
          const errEl = emailField.closest('.form-group').querySelector('.form-error');
          if (errEl) errEl.textContent = 'Please enter a valid email address.';
          valid = false;
        }
      }

      if (!valid) return;

      // Simulate successful submission
      const submitBtn = contactForm.querySelector('[type="submit"]');
      const successEl = document.getElementById('formSuccess');

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      setTimeout(() => {
        if (successEl) successEl.classList.add('visible');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 800);
    });
  }

  /* --- NEWSLETTER FORM --- */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      const btn = form.querySelector('button, [type="submit"]');
      if (!input || !input.value.trim()) return;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value.trim())) {
        input.style.borderColor = '#e74c3c';
        input.focus();
        return;
      }

      input.style.borderColor = '';
      btn.textContent = 'Subscribed!';
      btn.disabled = true;
      input.value = '';

      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.disabled = false;
      }, 3000);
    });
  });

  /* --- SMOOTH ANCHOR SCROLL (offset for fixed nav) --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();