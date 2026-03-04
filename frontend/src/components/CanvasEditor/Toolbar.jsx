import {ALL_TOOLS, TOOLS_BY_TYPE, isStitchTool} from "../../data/tools"
import {TOOL_ICONS} from "./ToolIcons"

export default function Toolbar({ activeTool, onToolChange, currentColor, onColorChange, patternType }) {
  const isPixelArt = patternType === "pixel_art";
  const visibleTools = TOOLS_BY_TYPE[patternType].map(id => ALL_TOOLS.find(tool => tool.id === id))

  return (
    <div className="toolbar">
      {visibleTools.map((tool) => (
        <button
          key={tool.id}
          title={tool.label}
          onClick={() => onToolChange(tool.id)}
          className={`tool-btn${activeTool === tool.id ? " active" : ""}`}
        >
           {(() => { const Icon = TOOL_ICONS[tool.id]; return <Icon />; })()}  
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
