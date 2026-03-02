import { pixelArtPalette, PALETTE_MAP } from "../../data/palettes";

function SwatchGrid({ colors, currentColor, onSelect, isBeads }) {
  return (
    <div className="color-palette">
      {colors.map((entry) => {
        const hex = typeof entry === "string" ? entry : entry.hex;
        const label = typeof entry === "string" ? hex : `${entry.code} – ${entry.name}`;
        const key = typeof entry === "string" ? entry : entry.code;
        const selected = hex.toLowerCase() === currentColor?.toLowerCase();
        return (
          <div key={key} className="color">
            <div
              className={`color-color${selected ? " selected" : ""}${isBeads ? " bead" : ""}`}
              title={label}
              onClick={() => onSelect(hex)}
              style={{ background: hex }}
            />
            <span className="color-label">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function ColorPalette({ patternType, currentColor, onColorChange }) {
  const isPixelArt = patternType === "pixel_art";
  const isBeads = patternType === "iron_bead_hama" || patternType === "iron_bead_perler";
  const palette = PALETTE_MAP[patternType] || [];

  return (
    <div className="palette-panel">
      <div className="palette-header">Colors</div>

      <div className="palette-scroll">
        {isPixelArt && (
          <>
            <div className="palette-section-label">Custom</div>
            <div className="palette-custom-color-wrap">
              <input
                type="color"
                value={currentColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="palette-custom-color"
              />
            </div>
            <div className="palette-section-label bordered">Basic palette</div>
            <SwatchGrid
              colors={pixelArtPalette}
              currentColor={currentColor}
              onSelect={onColorChange}
              isBeads={false}
            />
          </>
        )}

        {!isPixelArt && (
          <SwatchGrid
            colors={palette}
            currentColor={currentColor}
            onSelect={onColorChange}
            isBeads={isBeads}
          />
        )}
      </div>
    </div>
  );
}
