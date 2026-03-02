const TOOLS = [
  { id: "pencil", label: "Pencil", icon: "✏️" },
  { id: "eraser", label: "Eraser", icon: "🧹" },
  { id: "fill", label: "Fill", icon: "🪣" },
  { id: "eyedropper", label: "Eyedropper", icon: "💉" },
];

export default function Toolbar({ activeTool, onToolChange, currentColor, onColorChange, patternType }) {
  const isPixelArt = patternType === "pixel_art";

  return (
    <div className="toolbar">
      {TOOLS.map((tool) => (
        <button
          key={tool.id}
          title={tool.label}
          onClick={() => onToolChange(tool.id)}
          className={`tool-btn${activeTool === tool.id ? " active" : ""}`}
        >
          {tool.icon}
        </button>
      ))}

      <div className="toolbar-divider" />

      {/* Current color swatch */}
      <div
        title="Current color"
        className="color-swatch"
        style={{ background: currentColor }}
      />

      {/* Free color picker — only for pixel art */}
      {isPixelArt && (
        <input
          type="color"
          value={currentColor}
          onChange={(e) => onColorChange(e.target.value)}
          title="Custom color"
          className="color-picker-input"
        />
      )}
    </div>
  );
}
