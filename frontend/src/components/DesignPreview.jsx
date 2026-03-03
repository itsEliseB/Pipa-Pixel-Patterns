import { useRef, useEffect } from "react";

const EMPTY_COLOR = "#f8f8f8";
const PREVIEW_WIDTH = 120;

function drawCell(ctx, col, row, color, cellSize, patternType) {
  const x = col * cellSize;
  const y = row * cellSize;

  if (patternType === "iron_bead_hama" || patternType === "iron_bead_perler") {
    ctx.fillStyle = "#e0e0e0";
    ctx.fillRect(x, y, cellSize, cellSize);
    if (color) {
      ctx.beginPath();
      ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.42, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = "#c8c8c8";
      ctx.fill();
    }
  } else if (patternType === "cross_stitch") {
    ctx.fillStyle = color || EMPTY_COLOR;
    ctx.fillRect(x, y, cellSize, cellSize);
    if (color) {
      const pad = cellSize * 0.15;
      ctx.strokeStyle = "rgba(0,0,0,0.45)";
      ctx.lineWidth = Math.max(1, cellSize * 0.1);
      ctx.beginPath();
      ctx.moveTo(x + pad, y + pad);
      ctx.lineTo(x + cellSize - pad, y + cellSize - pad);
      ctx.moveTo(x + cellSize - pad, y + pad);
      ctx.lineTo(x + pad, y + cellSize - pad);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = color || EMPTY_COLOR;
    ctx.fillRect(x, y, cellSize, cellSize);
  }
}

export default function DesignPreview({ pixels, width, height, patternType }) {
  const canvasRef = useRef(null);
  const canvasHeight = Math.round(PREVIEW_WIDTH * (height / width));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cellSize = PREVIEW_WIDTH / width;

    ctx.clearRect(0, 0, PREVIEW_WIDTH, canvasHeight);

    if (!pixels) {
      ctx.fillStyle = EMPTY_COLOR;
      ctx.fillRect(0, 0, PREVIEW_WIDTH, canvasHeight);
      return;
    }

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        drawCell(ctx, col, row, pixels[row * width + col] || null, cellSize, patternType);
      }
    }
  }, [pixels, width, height, patternType, canvasHeight]);

  return (
    <canvas
      ref={canvasRef}
      width={PREVIEW_WIDTH}
      height={canvasHeight}
      className="design-preview-canvas"
    />
  );
}
