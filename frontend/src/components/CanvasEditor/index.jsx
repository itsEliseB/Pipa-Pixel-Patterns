import { useState, useRef, useMemo, useCallback } from "react";
import { PALETTE_MAP } from "../../data/palettes";
import { DEFAULT_TOOL } from "../../data/tools";
import { getColor } from "../../utils/drawCell";
import PixelCanvas from "./PixelCanvas";
import Toolbar from "./Toolbar";
import ColorPalette from "./ColorPalette";

function makeEmptyPixels(width, height) {
  return Array(width * height).fill(null);
}

function getDefaultColor(patternType) {
  const palette = PALETTE_MAP[patternType] ?? PALETTE_MAP["iron_bead_hama"];
  if (!palette || palette.length === 0) return "#000000";
  const first = palette[0];
  return typeof first === "string" ? first : first.hex;
}

export default function CanvasEditor({ patternType, width, height, onDataChange, initialPixels }) {
  const [pixels, setPixels] = useState(() => initialPixels || makeEmptyPixels(width, height));
  const [activeTool, setActiveTool] = useState(DEFAULT_TOOL[patternType]);
  const [currentColor, setCurrentColor] = useState(() => getDefaultColor(patternType));
  const scrollContainerRef = useRef(null);

  const usedColors = useMemo(() => {
    const seen = new Set();
    pixels.forEach(cell => {
      const color = getColor(cell);
      if (color) seen.add(color);
    });
    return [...seen];
  }, [pixels]);

  const handlePixelsChange = useCallback(
    (next) => {
      setPixels(next);
      onDataChange(next);
    },
    [onDataChange]
  );

  const handleEyedropper = useCallback((color, stitchType) => {
    if (color) setCurrentColor(color);
    setActiveTool(stitchType ?? DEFAULT_TOOL[patternType]);
  }, [patternType]);

  const handleColorChange = useCallback((color) => {
    setCurrentColor(color);
  }, []);

  return (
    <div className="canvas-editor">
      <Toolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        currentColor={currentColor}
        onColorChange={handleColorChange}
        patternType={patternType}
        usedColors={usedColors}
      />

      <div className="canvas-area" ref={scrollContainerRef}>
        <div className="canvas-area-inner">
          <PixelCanvas
            pixels={pixels}
            width={width}
            height={height}
            patternType={patternType}
            activeTool={activeTool}
            currentColor={currentColor}
            onPixelsChange={handlePixelsChange}
            onEyedropper={handleEyedropper}
            scrollContainerRef={scrollContainerRef}
          />
        </div>
      </div>

      <ColorPalette
        patternType={patternType}
        currentColor={currentColor}
        onColorChange={handleColorChange}
      />
    </div>
  );
}
