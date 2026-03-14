export function renderFooter() {
  const footer = document.createElement('footer');
  footer.innerHTML = `
    <div class="foot-logo">kdrift.dev</div>
    <ul class="foot-links">
      <li><a href="https://github.com/kdrift">GitHub</a></li>
      <li><a href="#">Paper</a></li>
      <li><a href="#">DRIFTBENCH</a></li>
      <li><a href="#">Docs</a></li>
      <li><a href="/features.html">Features</a></li>
      <li><a href="/pricing.html">Pricing</a></li>
      <li><a href="/blog/">Blog</a></li>
      <li><a href="/about.html">About</a></li>
      <li><a href="/contact.html">Contact</a></li>
    </ul>
    <div class="foot-r">&copy; 2025 kdrift. All rights reserved.</div>
  `;
  document.body.appendChild(footer);
}
