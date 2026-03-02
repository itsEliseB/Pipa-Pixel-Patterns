import { useState, useCallback } from "react";
import { CANVAS_SIZES, PALETTE_MAP } from "../../data/palettes";
import PixelCanvas from "./PixelCanvas";
import Toolbar from "./Toolbar";
import ColorPalette from "./ColorPalette";

function makeEmptyPixels(width, height) {
  return Array(width * height).fill(null);
}

function getDefaultColor(patternType) {
  const palette = PALETTE_MAP[patternType];
  if (!palette || palette.length === 0) return "#000000";
  const first = palette[0];
  return typeof first === "string" ? first : first.hex;
}

export default function CanvasEditor({ patternType, width, height, onDataChange }) {
  const [pixels, setPixels] = useState(() => makeEmptyPixels(width, height));
  const [activeTool, setActiveTool] = useState("pencil");
  const [currentColor, setCurrentColor] = useState(() => getDefaultColor(patternType));

  // When parent changes patternType/size, reset (parent triggers re-mount via key)
  const handlePixelsChange = useCallback(
    (next) => {
      setPixels(next);
      onDataChange(next);
    },
    [onDataChange]
  );

  const handleEyedropper = useCallback((color) => {
    if (color) setCurrentColor(color);
    setActiveTool("pencil");
  }, []);

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
      />

      <div className="canvas-area">
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
