import { useRef, useEffect, useCallback } from "react";

const GRID_COLOR = "#cccccc";
const EMPTY_COLOR = "#f8f8f8";

function floodFill(pixels, width, height, startIdx, targetColor, fillColor) {
  if (targetColor === fillColor) return pixels;
  const next = [...pixels];
  const queue = [startIdx];
  const visited = new Set();
  while (queue.length > 0) {
    const idx = queue.shift();
    if (visited.has(idx)) continue;
    if (next[idx] !== targetColor) continue;
    visited.add(idx);
    next[idx] = fillColor;
    const row = Math.floor(idx / width);
    const col = idx % width;
    if (col > 0) queue.push(idx - 1);
    if (col < width - 1) queue.push(idx + 1);
    if (row > 0) queue.push(idx - width);
    if (row < height - 1) queue.push(idx + width);
  }
  return next;
}

function drawCell(ctx, col, row, color, cellSize, patternType) {
  const x = col * cellSize;
  const y = row * cellSize;

  if (patternType === "iron_bead_hama" || patternType === "iron_bead_perler") {
    // Pegboard background
    ctx.fillStyle = "#e0e0e0";
    ctx.fillRect(x, y, cellSize, cellSize);
    if (color) {
      ctx.beginPath();
      ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.42, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      // Hole in center
      ctx.beginPath();
      ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fill();
    } else {
      // Empty peg
      ctx.beginPath();
      ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = "#c8c8c8";
      ctx.fill();
    }
  } else if (patternType === "cross_stitch") {
    ctx.fillStyle = color || EMPTY_COLOR;
    ctx.fillRect(x, y, cellSize, cellSize);
    if (color) {
      // Draw X
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
    // Pixel art
    ctx.fillStyle = color || EMPTY_COLOR;
    ctx.fillRect(x, y, cellSize, cellSize);
  }
}

function drawCrossStitchCell(ctx, x, y, cell, cellSize) {

    ctx.fillStyle = EMPTY_COLOR;
    ctx.fillRect(x, y, cellSize, cellSize)

    if (!cell) return;

    const { type, color } = cell;

    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1.5, cellSize * 0.12);
    ctx.lineCap = "round";

      const pad = cellSize * 0.12;
  const cx = x + cellSize / 2;
  const cy = y + cellSize / 2;
  const tl = [x + pad,            y + pad           ];
  const tr = [x + cellSize - pad, y + pad           ];
  const bl = [x + pad,            y + cellSize - pad];
  const br = [x + cellSize - pad, y + cellSize - pad];

  const line = (a, b) => {
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
  };

  switch (type) {
    case "stitch_full":       line(tl, br); line(tr, bl); break;
    case "stitch_half_tl_br": line(tl, br); break;
    case "stitch_half_bl_tr": line(bl, tr); break;
    case "stitch_q_tl":       line(tl, [cx, cy]); break;
    case "stitch_q_tr":       line(tr, [cx, cy]); break;
    case "stitch_q_bl":       line(bl, [cx, cy]); break;
    case "stitch_q_br":       line(br, [cx, cy]); break;
    case "stitch_3q_tl":      line(tl, br); line(tr, [cx, cy]); break;
    case "stitch_3q_tr":      line(bl, tr); line(tl, [cx, cy]); break;
    case "stitch_3q_bl":      line(bl, tr); line(br, [cx, cy]); break;
    case "stitch_3q_br":      line(tl, br); line(bl, [cx, cy]); break;
  }
}

export default function PixelCanvas({
  pixels,
  width,
  height,
  patternType,
  activeTool,
  currentColor,
  onPixelsChange,
  onEyedropper,
}) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  const getCellSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 16;
    return Math.floor(canvas.width / width);
  }, [width]);

  const getCell = useCallback(
    (e) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      const cellSize = getCellSize();
      const col = Math.floor(x / cellSize);
      const row = Math.floor(y / cellSize);
      if (col < 0 || col >= width || row < 0 || row >= height) return null;
      return { col, row, idx: row * width + col };
    },
    [width, height, getCellSize]
  );

  const applyTool = useCallback(
    (e) => {
      const cell = getCell(e);
      if (!cell) return;
      const { idx } = cell;

      if (activeTool === "eyedropper") {
        const color = pixels[idx] || null;
        onEyedropper(color);
        return;
      }

      if (activeTool === "fill") {
        const targetColor = pixels[idx] || null;
        const next = floodFill(pixels, width, height, idx, targetColor, currentColor);
        onPixelsChange(next);
        return;
      }

      const next = [...pixels];
      if (activeTool === "pencil") {
        next[idx] = currentColor;
      } else if (activeTool === "eraser") {
        next[idx] = null;
      }
      onPixelsChange(next);
    },
    [activeTool, currentColor, pixels, width, height, getCell, onPixelsChange, onEyedropper]
  );

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cellSize = getCellSize();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        drawCell(ctx, col, row, pixels[row * width + col] || null, cellSize, patternType);
      }
    }

    // Grid lines (skip for iron bead — pegboard gaps are implicit)
    if (patternType !== "iron_bead_hama" && patternType !== "iron_bead_perler") {
      ctx.strokeStyle = GRID_COLOR;
      ctx.lineWidth = 0.5;
      for (let col = 0; col <= width; col++) {
        ctx.beginPath();
        ctx.moveTo(col * cellSize, 0);
        ctx.lineTo(col * cellSize, height * cellSize);
        ctx.stroke();
      }
      for (let row = 0; row <= height; row++) {
        ctx.beginPath();
        ctx.moveTo(0, row * cellSize);
        ctx.lineTo(width * cellSize, row * cellSize);
        ctx.stroke();
      }
    }
  }, [pixels, width, height, patternType, getCellSize]);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    applyTool(e);
  };
  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    if (activeTool === "pencil" || activeTool === "eraser") applyTool(e);
  };
  const handleMouseUp = () => { isDrawing.current = false; };
  const handleMouseLeave = () => { isDrawing.current = false; };

  const canvasPx = Math.min(600, width * 20);

  return (
    <canvas
      ref={canvasRef}
      width={canvasPx}
      height={Math.round(canvasPx * (height / width))}
      className="pixel-canvas"
      data-tool={activeTool}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    />
  );
}
