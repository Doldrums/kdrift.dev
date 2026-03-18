import * as amplitude from '@amplitude/unified';

const API_KEY = 'd8c9e9b38574250b38e77552d315463c';

export function initAnalytics() {
  amplitude.initAll(API_KEY, {
    analytics: { autocapture: true },
    sessionReplay: { sampleRate: 1 },
  });

  trackPageView();
  initScrollDepth();
  initTimeOnPage();
  initClickTracking();
  initFormTracking();
}

function trackPageView() {
  amplitude.track('Page Viewed', {
    page: document.body.dataset.page || 'unknown',
    url: window.location.href,
    path: window.location.pathname,
    referrer: document.referrer || null,
    title: document.title,
  });
}

function initScrollDepth() {
  const milestones = [25, 50, 75, 100];
  const reached = new Set();
  const page = document.body.dataset.page || 'unknown';

  function getScrollPercent() {
    const el = document.documentElement;
    const scrolled = el.scrollTop || document.body.scrollTop;
    const total = el.scrollHeight - el.clientHeight;
    return total > 0 ? Math.round((scrolled / total) * 100) : 0;
  }

  window.addEventListener('scroll', () => {
    const pct = getScrollPercent();
    milestones.forEach(m => {
      if (pct >= m && !reached.has(m)) {
        reached.add(m);
        amplitude.track('Scroll Depth Reached', { page, depth_percent: m });
      }
    });
  }, { passive: true });
}

function initTimeOnPage() {
  const start = Date.now();
  let tracked = false;

  function trackTime() {
    if (tracked) return;
    tracked = true;
    amplitude.track('Time on Page', {
      page: document.body.dataset.page || 'unknown',
      seconds: Math.round((Date.now() - start) / 1000),
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') trackTime();
  });
  window.addEventListener('pagehide', trackTime);
}

function initClickTracking() {
  const page = document.body.dataset.page || 'unknown';

  document.addEventListener('click', (e) => {
    const el = e.target.closest('a, button');
    if (!el) return;

    const href = el.getAttribute('href') || '';
    const label = el.textContent.trim().replace(/\s+/g, ' ').slice(0, 100);

    // outbound links
    if (href.startsWith('http')) {
      amplitude.track('Outbound Link Clicked', {
        page,
        href,
        label,
        destination: href.includes('github.com') ? 'github'
          : href.includes('arxiv.org') ? 'paper'
          : 'other',
      });
      return;
    }

    // CTA buttons
    if (el.matches('.btn-solid, .btn-green, .btn-outline, .nav-solid, .cf-submit')) {
      amplitude.track('CTA Clicked', {
        page,
        label,
        href: href || null,
        variant: ['btn-solid', 'btn-green', 'btn-outline', 'nav-solid', 'cf-submit']
          .find(c => el.classList.contains(c)) || 'button',
      });
      return;
    }

    // nav links
    if (el.closest('nav') || el.closest('.nav-mobile')) {
      amplitude.track('Nav Clicked', { page, label, href });
      return;
    }

    // blog post cards
    const card = el.closest('a.blog-post');
    if (card) {
      amplitude.track('Blog Post Clicked', {
        page,
        title: card.querySelector('.bp-title')?.textContent.trim() || label,
        href: card.getAttribute('href') || href,
      });
    }
  }, true);
}

function initFormTracking() {
  document.addEventListener('submit', (e) => {
    const form = e.target;
    const page = document.body.dataset.page || 'unknown';

    if (form.closest('.bp-subscribe')) {
      amplitude.track('Newsletter Subscribe Attempted', { page });
    } else if (form.classList.contains('cf-right') || form.closest('.contact-wrap')) {
      const interest = form.querySelector('[name="interest"]')?.value || null;
      amplitude.track('Contact Form Submitted', { page, interest });
    }
  });
}
