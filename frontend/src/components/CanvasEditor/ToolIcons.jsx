import { Pencil, Eraser, Pipette, PaintBucket, Move } from "lucide-react";

// Shared SVG wrapper — matches Lucide's 24×24 viewBox and stroke style.
const Icon = ({ children }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
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

// Subtle cell border — gives context to the stitch shape inside.
// strokeOpacity matches Lucide's approach of using opacity for secondary elements.
const Cell = () => <rect x="2" y="2" width="20" height="20" rx="3" strokeOpacity="0.25" />;

// ── Stitch tools ──────────────────────────────────────────────────────────────
// 24×24 grid: stitch lines go from corner (4,4)/(20,4)/(4,20)/(20,20) to centre (12,12).

export const StitchFull = () => (
  <Icon>
    <Cell />
    <line x1="4" y1="4" x2="20" y2="20" />
    <line x1="20" y1="4" x2="4" y2="20" />
  </Icon>
);

export const StitchHalfTlBr = () => (       // ╲ diagonal
  <Icon>
    <Cell />
    <line x1="4" y1="4" x2="20" y2="20" />
  </Icon>
);

export const StitchHalfBlTr = () => (       // ╱ diagonal
  <Icon>
    <Cell />
    <line x1="4" y1="20" x2="20" y2="4" />
  </Icon>
);

export const StitchQTl = () => (            // ¼ top-left corner → centre
  <Icon>
    <Cell />
    <line x1="4" y1="4" x2="12" y2="12" />
  </Icon>
);

export const StitchQTr = () => (            // ¼ top-right corner → centre
  <Icon>
    <Cell />
    <line x1="20" y1="4" x2="12" y2="12" />
  </Icon>
);

export const StitchQBl = () => (            // ¼ bottom-left corner → centre
  <Icon>
    <Cell />
    <line x1="4" y1="20" x2="12" y2="12" />
  </Icon>
);

export const StitchQBr = () => (            // ¼ bottom-right corner → centre
  <Icon>
    <Cell />
    <line x1="20" y1="20" x2="12" y2="12" />
  </Icon>
);

export const Stitch3qTl = () => (           // ¾ TL: ╲ half + TR quarter
  <Icon>
    <Cell />
    <line x1="4" y1="4" x2="20" y2="20" />
    <line x1="20" y1="4" x2="12" y2="12" />
  </Icon>
);

export const Stitch3qTr = () => (           // ¾ TR: ╱ half + TL quarter
  <Icon>
    <Cell />
    <line x1="4" y1="20" x2="20" y2="4" />
    <line x1="4" y1="4" x2="12" y2="12" />
  </Icon>
);

export const Stitch3qBl = () => (           // ¾ BL: ╱ half + BR quarter
  <Icon>
    <Cell />
    <line x1="4" y1="20" x2="20" y2="4" />
    <line x1="20" y1="20" x2="12" y2="12" />
  </Icon>
);

export const Stitch3qBr = () => (           // ¾ BR: ╲ half + BL quarter
  <Icon>
    <Cell />
    <line x1="4" y1="4" x2="20" y2="20" />
    <line x1="4" y1="20" x2="12" y2="12" />
  </Icon>
);

// ── Drawing tools (Lucide) ────────────────────────────────────────────────────
// Pencil, Eraser, Fill, and Eyedropper come from lucide-react.

// ── Navigation (Lucide) ───────────────────────────────────────────────────────

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
  fill:              PaintBucket,
  eyedropper:        Pipette,
  pan:               Move,
};
