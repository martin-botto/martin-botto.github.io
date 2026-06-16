/* ============================================================
   Martin Botto. Portfolio behavior.
   - Sticky header shadow on scroll
   - Mobile nav toggle
   - Active section highlight in nav
   - Case study expand and collapse
============================================================ */

(() => {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Header shadow on scroll ---------- */
  const header = $('#header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav ---------- */
  const navToggle = $('#nav-toggle');
  const mobileNav = $('#mobile-nav');

  const closeMobileNav = () => {
    if (!navToggle || !mobileNav) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    header?.classList.remove('is-open');
    mobileNav.hidden = true;
  };

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      if (open) {
        closeMobileNav();
      } else {
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Close menu');
        header?.classList.add('is-open');
        mobileNav.hidden = false;
      }
    });

    mobileNav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') closeMobileNav();
    });
  }

  /* ---------- Active section highlight ---------- */
  const sections = $$('main section[id]');
  const navLinks = $$('.nav__list a');

  if (sections.length && navLinks.length) {
    const setActive = (id) => {
      navLinks.forEach((a) => {
        a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
  }

  /* ---------- Case studies expand and collapse (multiple) ---------- */
  const getCase = (id) => (id ? document.getElementById(id) : null);

  const setTriggerState = (id, expanded) => {
    $$(`[data-case-trigger="${id}"]`).forEach((btn) => {
      if (btn.hasAttribute('aria-expanded')) {
        btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      }
    });
  };

  const closeCase = (id, scrollToWork = true) => {
    const el = getCase(id);
    if (!el || !el.classList.contains('case')) return;
    el.hidden = true;
    setTriggerState(id, false);
    if (scrollToWork) $('#work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openCase = (id) => {
    const el = getCase(id);
    if (!el || !el.classList.contains('case')) return;
    /* Only one case study open at a time */
    $$('.case').forEach((c) => {
      if (c.id !== id && !c.hidden) closeCase(c.id, false);
    });
    el.hidden = false;
    setTriggerState(id, true);
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  $$('[data-case-trigger]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-case-trigger');
      const el = getCase(id);
      if (el && !el.hidden) closeCase(id);
      else openCase(id);
    });
  });

  $$('[data-case-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const host = btn.closest('.case');
      if (host) closeCase(host.id);
    });
  });

  /* Open a case study if the page loads with its id in the URL */
  if (window.location.hash) openCase(window.location.hash.slice(1));
})();
