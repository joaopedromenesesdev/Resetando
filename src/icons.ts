// ========================================
// Resetando — Icon System
// Lucide-style SVG icons, inline, consistent
// ========================================

const ICON_DEFAULTS = 'width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

export const icons = {
  // Pillar icons
  brain: `<svg ${ICON_DEFAULTS}><path d="M12 2a6 6 0 0 0-6 6c0 1.6.6 3 1.7 4.1L12 16l4.3-3.9A6 6 0 0 0 18 8a6 6 0 0 0-6-6z"/><path d="M9 22v-4"/><path d="M15 22v-4"/><path d="M12 16v6"/><path d="M9 2.5c-.3.8-.5 1.6-.5 2.5"/><path d="M15 2.5c.3.8.5 1.6.5 2.5"/></svg>`,

  mind: `<svg ${ICON_DEFAULTS}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,

  bookOpen: `<svg ${ICON_DEFAULTS}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,

  dumbbell: `<svg ${ICON_DEFAULTS}><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>`,

  heart: `<svg ${ICON_DEFAULTS}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,

  // Navigation icons
  sun: `<svg ${ICON_DEFAULTS}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,

  calendar: `<svg ${ICON_DEFAULTS}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,

  listChecks: `<svg ${ICON_DEFAULTS}><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>`,

  user: `<svg ${ICON_DEFAULTS}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,

  // Action icons
  check: `<svg ${ICON_DEFAULTS}><polyline points="20 6 9 17 4 12"/></svg>`,

  chevronRight: `<svg ${ICON_DEFAULTS}><path d="m9 18 6-6-6-6"/></svg>`,

  edit: `<svg ${ICON_DEFAULTS}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`,

  plus: `<svg ${ICON_DEFAULTS}><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,

  trash: `<svg ${ICON_DEFAULTS}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,

  alertTriangle: `<svg ${ICON_DEFAULTS}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,

  download: `<svg ${ICON_DEFAULTS}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,

  upload: `<svg ${ICON_DEFAULTS}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>`,

  // Streak / fire
  flame: `<svg ${ICON_DEFAULTS}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,

  // Philosophy / concept
  target: `<svg ${ICON_DEFAULTS}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,

  scale: `<svg ${ICON_DEFAULTS}><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>`,

  sparkles: `<svg ${ICON_DEFAULTS}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,

  // Misc
  barChart: `<svg ${ICON_DEFAULTS}><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>`,

  arrowUp: `<svg ${ICON_DEFAULTS}><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>`,

  rotateCcw: `<svg ${ICON_DEFAULTS}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,

  triangle: `<svg ${ICON_DEFAULTS}><path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>`,

  trendingUp: `<svg ${ICON_DEFAULTS}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
};


// Helper to render icon with custom size
export function icon(name: keyof typeof icons, size: number = 20): string {
  return icons[name].replace('width="20"', `width="${size}"`).replace('height="20"', `height="${size}"`);
}

// Pillar icon mapping
export function pillarIcon(pillarId: string, size: number = 20): string {
  switch (pillarId) {
    case 'mente': return icon('bookOpen', size);
    case 'corpo': return icon('dumbbell', size);
    case 'alma': return icon('heart', size);
    default: return icon('target', size);
  }
}
