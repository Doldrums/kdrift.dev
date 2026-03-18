import './styles/global.css';
import { renderNav, renderBanner } from './components/nav.js';
import { renderFooter } from './components/footer.js';
import { initAnalytics } from './analytics.js';

// inject shared layout
const page = document.body.dataset.page || '';
const showBanner = document.body.dataset.banner !== 'false';

renderNav(page);
if (showBanner) renderBanner();
renderFooter();
initAnalytics();

// animate metric numbers on scroll
function animateCounters() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counters = document.querySelectorAll('[data-count]');

  if (reducedMotion) {
    counters.forEach(el => {
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      el.textContent = prefix + el.dataset.count + suffix;
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.animated) return;
      el.dataset.animated = '1';

      const target = el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const isFloat = target.includes('.');
      const end = parseFloat(target);
      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = isFloat ? (end * eased).toFixed(1) : Math.round(end * eased);
        el.textContent = prefix + current + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
}

animateCounters();
