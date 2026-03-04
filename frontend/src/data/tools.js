export const ALL_TOOLS = [
  // ── Stitch tools (cross-stitch only) ──────────────────────────────────────
  { id: "stitch_full",       label: "Full Stitch",     group: "stitch" },
  { id: "stitch_half_tl_br", label: "Half Stitch \\",  group: "stitch" },
  { id: "stitch_half_bl_tr", label: "Half Stitch /",   group: "stitch" },
  { id: "stitch_q_tl",       label: "¼ Top-Left",      group: "stitch" },
  { id: "stitch_q_tr",       label: "¼ Top-Right",     group: "stitch" },
  { id: "stitch_q_bl",       label: "¼ Bottom-Left",   group: "stitch" },
  { id: "stitch_q_br",       label: "¼ Bottom-Right",  group: "stitch" },
  { id: "stitch_3q_tl",      label: "¾ Top-Left",      group: "stitch" },
  { id: "stitch_3q_tr",      label: "¾ Top-Right",     group: "stitch" },
  { id: "stitch_3q_bl",      label: "¾ Bottom-Left",   group: "stitch" },
  { id: "stitch_3q_br",      label: "¾ Bottom-Right",  group: "stitch" },
  // ── Drawing tools ──────────────────────────────────────────────────────────
  { id: "pencil",            label: "Pencil",          group: "draw" },
  { id: "eraser",            label: "Eraser",          group: "draw" },
  { id: "fill",              label: "Fill",            group: "draw" },
  { id: "eyedropper",        label: "Eyedropper",      group: "draw" },
  // ── Navigation ─────────────────────────────────────────────────────────────
  { id: "pan",               label: "Pan",             group: "nav"  },
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
  iron_bead:   "pencil",
};

export function isStitchTool(toolId) {
  return toolId?.startsWith("stitch_") ?? false;
}
