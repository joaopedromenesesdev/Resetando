// ========================================
// Resetando — Brand Logo & Identity
// Minimalist Personal Evolution Mark
// The 3 Pillars (Mente, Corpo, Alma) converging into an ascending evolution apex
// ========================================

export function renderLogoSvg(size = 32, className = ''): string {
  return `
    <svg
      class="resetando-logo ${className}"
      width="${size}"
      height="${size}"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Logo Resetando"
    >
      <defs>
        <linearGradient id="resGradPrimary-${size}" x1="8" y1="40" x2="24" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#9E7D1E" />
          <stop offset="50%" stop-color="#D4AF37" />
          <stop offset="100%" stop-color="#F0D878" />
        </linearGradient>
        <linearGradient id="resGradAscent-${size}" x1="24" y1="34" x2="24" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#F0D878" />
        </linearGradient>
      </defs>

      <!-- Outer Triad Frame (Equilateral Evolution Delta) -->
      <path
        d="M24 6L7 39H41L24 6Z"
        stroke="url(#resGradPrimary-${size})"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Evolution Vector: Ascending Inner Arrow (Personal Growth) -->
      <path
        d="M15 32L24 19L33 32"
        stroke="url(#resGradAscent-${size})"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Core Transcendence Spark (Enlightenment / Rebirth) -->
      <circle cx="24" cy="13" r="2.2" fill="#F0D878" />

      <!-- Base Grounding Accent -->
      <line x1="19" y1="39" x2="29" y2="39" stroke="#F0D878" stroke-width="2.5" stroke-linecap="round" />
    </svg>
  `;
}

export function renderBrandHeader(): string {
  return `
    <header class="app-top-bar">
      <div class="brand-lockup">
        <span class="brand-icon-wrap">${renderLogoSvg(26)}</span>
        <span class="brand-wordmark">RESET<span class="gold-accent">ANDO</span></span>
      </div>
    </header>
  `;
}
