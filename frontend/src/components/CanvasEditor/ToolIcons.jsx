// Shared SVG wrapper — all icons use a 20×20 viewBox, stroke-based, inherit color.
const Icon = ({ children }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

// ── Stitch tools ──────────────────────────────────────────────────────────────
// Lines run from corner/edge to corner/edge (2px inset so rounded caps stay in bounds).

export const StitchFull = () => (
  <Icon>
    <line x1="2" y1="2" x2="18" y2="18" />
    <line x1="18" y1="2" x2="2" y2="18" />
  </Icon>
);

export const StitchHalfTlBr = () => (       // ╲ diagonal
  <Icon>
    <line x1="2" y1="2" x2="18" y2="18" />
  </Icon>
);

export const StitchHalfBlTr = () => (       // ╱ diagonal
  <Icon>
    <line x1="2" y1="18" x2="18" y2="2" />
  </Icon>
);

export const StitchQTl = () => (            // ¼ top-left corner → centre
  <Icon>
    <line x1="2" y1="2" x2="10" y2="10" />
  </Icon>
);

export const StitchQTr = () => (            // ¼ top-right corner → centre
  <Icon>
    <line x1="18" y1="2" x2="10" y2="10" />
  </Icon>
);

export const StitchQBl = () => (            // ¼ bottom-left corner → centre
  <Icon>
    <line x1="2" y1="18" x2="10" y2="10" />
  </Icon>
);

export const StitchQBr = () => (            // ¼ bottom-right corner → centre
  <Icon>
    <line x1="18" y1="18" x2="10" y2="10" />
  </Icon>
);

export const Stitch3qTl = () => (           // ¾ TL: ╲ half + TR quarter
  <Icon>
    <line x1="2" y1="2" x2="18" y2="18" />
    <line x1="18" y1="2" x2="10" y2="10" />
  </Icon>
);

export const Stitch3qTr = () => (           // ¾ TR: ╱ half + TL quarter
  <Icon>
    <line x1="18" y1="2" x2="2" y2="18" />
    <line x1="2" y1="2" x2="10" y2="10" />
  </Icon>
);

export const Stitch3qBl = () => (           // ¾ BL: ╱ half + BR quarter
  <Icon>
    <line x1="18" y1="2" x2="2" y2="18" />
    <line x1="18" y1="18" x2="10" y2="10" />
  </Icon>
);

export const Stitch3qBr = () => (           // ¾ BR: ╲ half + BL quarter
  <Icon>
    <line x1="2" y1="2" x2="18" y2="18" />
    <line x1="2" y1="18" x2="10" y2="10" />
  </Icon>
);

// ── Drawing tools ─────────────────────────────────────────────────────────────

export const Pencil = () => (
  // Pentagon outline (body + tip) + small separator line near the lead
  <Icon>
    <path d="M3 15 L13 5 L16 2 L18 4 L8 16 L3 16 Z" />
    <line x1="12" y1="5" x2="16" y2="9" />
  </Icon>
);

export const Eraser = () => (
  // Rounded rectangle + vertical line dividing eraser from body
  <Icon>
    <rect x="2" y="7" width="16" height="9" rx="2" />
    <line x1="8" y1="7" x2="8" y2="16" />
  </Icon>
);

export const Fill = () => (
  // Bucket (trapezoid + arc handle) + filled paint drip
  <Icon>
    <path d="M5 7 L7 17 L13 17 L15 7 Z" />
    <line x1="5" y1="7" x2="15" y2="7" />
    <path d="M8 4 Q10 2 12 4" />
    <circle cx="17" cy="15" r="2" fill="currentColor" stroke="none" />
  </Icon>
);

export const Eyedropper = () => (
  // Diagonal barrel + short cap line at top + pointed tip at bottom-left
  <Icon>
    <line x1="4" y1="13" x2="13" y2="4" />
    <line x1="13" y1="4" x2="17" y2="8" />
    <line x1="4" y1="13" x2="2" y2="17" />
    <line x1="2" y1="17" x2="6" y2="15" />
  </Icon>
);

// ── Navigation ────────────────────────────────────────────────────────────────

export const Pan = () => (
  // Four-directional move arrows
  <Icon>
    <line x1="10" y1="2" x2="10" y2="18" />
    <line x1="2" y1="10" x2="18" y2="10" />
    <polyline points="7,5 10,2 13,5" />
    <polyline points="7,15 10,18 13,15" />
    <polyline points="5,7 2,10 5,13" />
    <polyline points="15,7 18,10 15,13" />
  </Icon>
);

// ── Lookup map ────────────────────────────────────────────────────────────────
// Usage in Toolbar:  const Icon = TOOL_ICONS[tool.id];  return <Icon />;

export const TOOL_ICONS = {
  stitch_full:       StitchFull,
  stitch_half_tl_br: StitchHalfTlBr,
  stitch_half_bl_tr: StitchHalfBlTr,
  stitch_q_tl:       StitchQTl,
  stitch_q_tr:       StitchQTr,
  stitch_q_bl:       StitchQBl,
  stitch_q_br:       StitchQBr,
  stitch_3q_tl:      Stitch3qTl,
  stitch_3q_tr:      Stitch3qTr,
  stitch_3q_bl:      Stitch3qBl,
  stitch_3q_br:      Stitch3qBr,
  pencil:            Pencil,
  eraser:            Eraser,
  fill:              Fill,
  eyedropper:        Eyedropper,
  pan:               Pan,
};
