export function renderNav(activePage = '') {
  const links = [
    { href: '/features.html', label: 'Features' },
    { href: '/pricing.html', label: 'Pricing' },
    { href: '/blog/', label: 'Blog' },
    { href: '/about.html', label: 'About' },
    { href: '/contact.html', label: 'Contact' },
  ];

  const navLinks = links
    .map(l => `<a href="${l.href}"${activePage === l.label.toLowerCase() ? ' class="active"' : ''}>${l.label}</a>`)
    .join('');

  const mobileLinks = links
    .map(l => `<a href="${l.href}">${l.label}</a>`)
    .join('');

  const nav = document.createElement('nav');
  nav.innerHTML = `
    <a href="/" class="nav-logo">kdrift<span>.dev</span> <span class="badge">beta</span></a>
    <div class="nav-links">${navLinks}</div>
    <div class="nav-right">
      <a href="https://github.com/kdrift-dev" class="nav-pill">GitHub</a>
      <a href="https://arxiv.org/abs/2511.18924" class="nav-pill" target="_blank" rel="noopener">Paper</a>
      <a href="/contact.html" class="nav-solid">Talk to us</a>
      <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav-mobile">Menu</button>
    </div>
  `;

  const mobile = document.createElement('div');
  mobile.className = 'nav-mobile';
  mobile.id = 'nav-mobile';
  mobile.innerHTML = `
    ${mobileLinks}
    <a href="https://github.com/kdrift-dev">GitHub</a>
    <a href="/contact.html">Talk to us</a>
  `;

  document.body.prepend(mobile);
  document.body.prepend(nav);

  const toggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('nav-mobile');

  toggle?.addEventListener('click', () => {
    const isOpen = mobileNav?.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  mobileNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

export function renderBanner(text = '') {
  if (!text) {
    text = 'KDRIFT is in early access — evaluation on in-tree cases, out-of-tree support in development. <a href="/contact.html">Join the beta &rarr;</a>';
  }
  const banner = document.createElement('div');
  banner.className = 'banner';
  banner.innerHTML = `<span class="banner-text">${text}</span>`;
  document.body.querySelector('nav')?.after(banner);
}
