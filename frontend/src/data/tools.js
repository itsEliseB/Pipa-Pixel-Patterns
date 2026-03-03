// SVG icon content (inner HTML of a 20×20 viewBox SVG).
// The Toolbar renders these inside:
//   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor"
//        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
//        dangerouslySetInnerHTML={{ __html: tool.icon }} />

export const ALL_TOOLS = [
  // ── Stitch tools (cross-stitch only) ──────────────────────────────────────
  {
    id: "stitch_full", label: "Full Stitch", group: "stitch",
    // X: two full diagonals
    icon: '<line x1="2" y1="2" x2="18" y2="18"/><line x1="18" y1="2" x2="2" y2="18"/>',
  },
  {
    id: "stitch_half_tl_br", label: "Half Stitch \\", group: "stitch",
    // single \ diagonal
    icon: '<line x1="2" y1="2" x2="18" y2="18"/>',
  },
  {
    id: "stitch_half_bl_tr", label: "Half Stitch /", group: "stitch",
    // single / diagonal
    icon: '<line x1="2" y1="18" x2="18" y2="2"/>',
  },
  {
    id: "stitch_q_tl", label: "¼ Top-Left", group: "stitch",
    // top-left corner → centre
    icon: '<line x1="2" y1="2" x2="10" y2="10"/>',
  },
  {
    id: "stitch_q_tr", label: "¼ Top-Right", group: "stitch",
    // top-right corner → centre
    icon: '<line x1="18" y1="2" x2="10" y2="10"/>',
  },
  {
    id: "stitch_q_bl", label: "¼ Bottom-Left", group: "stitch",
    // bottom-left corner → centre
    icon: '<line x1="2" y1="18" x2="10" y2="10"/>',
  },
  {
    id: "stitch_q_br", label: "¼ Bottom-Right", group: "stitch",
    // bottom-right corner → centre
    icon: '<line x1="18" y1="18" x2="10" y2="10"/>',
  },
  {
    id: "stitch_3q_tl", label: "¾ Top-Left", group: "stitch",
    // \ half + top-right quarter
    icon: '<line x1="2" y1="2" x2="18" y2="18"/><line x1="18" y1="2" x2="10" y2="10"/>',
  },
  {
    id: "stitch_3q_tr", label: "¾ Top-Right", group: "stitch",
    // / half + top-left quarter
    icon: '<line x1="2" y1="18" x2="18" y2="2"/><line x1="2" y1="2" x2="10" y2="10"/>',
  },
  {
    id: "stitch_3q_bl", label: "¾ Bottom-Left", group: "stitch",
    // / half + bottom-right quarter
    icon: '<line x1="2" y1="18" x2="18" y2="2"/><line x1="18" y1="18" x2="10" y2="10"/>',
  },
  {
    id: "stitch_3q_br", label: "¾ Bottom-Right", group: "stitch",
    // \ half + bottom-left quarter
    icon: '<line x1="2" y1="2" x2="18" y2="18"/><line x1="2" y1="18" x2="10" y2="10"/>',
  },

  // ── Drawing tools ──────────────────────────────────────────────────────────
  {
    id: "pencil", label: "Pencil", group: "draw",
    // diagonal shaft + pointed tip (top-right) + flat eraser end (bottom-left)
    icon: [
      '<line x1="4" y1="16" x2="15" y2="5"/>',         // shaft centre line
      '<polyline points="15,5 17,3 16,6"/>',             // tip wedge
      '<line x1="3" y1="17" x2="5" y2="15"/>',          // eraser flat end
    ].join(""),
  },
  {
    id: "eraser", label: "Eraser", group: "draw",
    // rounded rectangle divided by a vertical-ish line (two-tone eraser)
    icon: [
      '<rect x="2" y="7" width="16" height="9" rx="2"/>',
      '<line x1="9" y1="7" x2="9" y2="16"/>',
    ].join(""),
  },
  {
    id: "fill", label: "Fill", group: "draw",
    // paint bucket: body + spout + small drip
    icon: [
      '<path d="M3 13 L8 4 L15 4 L15 14 Q15 17 12 17 L6 17 Q3 17 3 13 Z"/>',
      '<line x1="15" y1="6" x2="18" y2="4"/>',          // spout
      '<circle cx="18" cy="16" r="2"/>',                 // paint drip
    ].join(""),
  },
  {
    id: "eyedropper", label: "Eyedropper", group: "draw",
    // diagonal tube + angled tip at bottom-left + small line at top-right
    icon: [
      '<line x1="5" y1="15" x2="15" y2="5"/>',          // barrel
      '<line x1="15" y1="5" x2="17" y2="3"/>',           // cap end
      '<polyline points="5,15 3,18 6,17 5,15"/>',        // dropper tip
    ].join(""),
  },

  // ── Navigation ─────────────────────────────────────────────────────────────
  {
    id: "pan", label: "Pan", group: "nav",
    // four-directional move arrows
    icon: [
      '<line x1="10" y1="2" x2="10" y2="18"/>',
      '<line x1="2" y1="10" x2="18" y2="10"/>',
      '<polyline points="7,5 10,2 13,5"/>',              // arrow up
      '<polyline points="7,15 10,18 13,15"/>',           // arrow down
      '<polyline points="5,7 2,10 5,13"/>',              // arrow left
      '<polyline points="15,7 18,10 15,13"/>',           // arrow right
    ].join(""),
  },
];

export const TOOLS_BY_TYPE = {
  pixel_art:        ["pencil", "eraser", "fill", "eyedropper", "pan"],
  cross_stitch:     [
    "stitch_full",
    "stitch_half_tl_br", "stitch_half_bl_tr",
    "stitch_q_tl",       "stitch_q_tr",
    "stitch_q_bl",       "stitch_q_br",
    "stitch_3q_tl",      "stitch_3q_tr",
    "stitch_3q_bl",      "stitch_3q_br",
    "eraser", "fill", "eyedropper", "pan",
  ],
  iron_bead: ["pencil", "eraser", "fill", "eyedropper", "pan"],
};

export const DEFAULT_TOOL = {
  pixel_art:        "pencil",
  cross_stitch:     "stitch_full",
  iron_bead_hama:   "pencil",
  iron_bead_perler: "pencil",
};

export function isStitchTool(toolId) {
  return toolId?.startsWith("stitch_") ?? false;
}
