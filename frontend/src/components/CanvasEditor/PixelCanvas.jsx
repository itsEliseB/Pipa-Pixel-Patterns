import { useRef, useEffect, useCallback } from "react";
import { isStitchTool } from "../../data/tools";
import { getColor, drawCrossStitchCell } from "../../utils/drawCell";

const GRID_COLOR = "#cccccc";
const EMPTY_COLOR = "#f8f8f8";

function floodFill(pixels, width, height, startIdx, targetColor, fillColor) {
  if (getColor(targetColor) === getColor(fillColor)) return pixels;
  const next = [...pixels];
  const queue = [startIdx];
  const visited = new Set();
  while (queue.length > 0) {
    const idx = queue.shift();
    if (visited.has(idx)) continue;
    if (getColor(next[idx]) !== targetColor) continue;
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

  if (patternType === "iron_bead") {
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
    drawCrossStitchCell(ctx, x, y, color, cellSize);
  } else {
    // Pixel art
    ctx.fillStyle = color || EMPTY_COLOR;
    ctx.fillRect(x, y, cellSize, cellSize);
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
  scrollContainerRef,
}) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const isPanning = useRef(false);
  const lastPan = useRef({ x: 0, y: 0 });

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
    [width, height, getCellSize],
  );

  const applyTool = useCallback(
    (e) => {
      const cell = getCell(e);
      if (!cell) return;
      const { idx } = cell;
      const next = [...pixels];

      if (isStitchTool(activeTool)) {
        next[idx] = {type : activeTool, color: currentColor};
        onPixelsChange(next); return;
      }

      if (activeTool === "eyedropper") {
        const cell = pixels[idx];
        const color = cell?.color ?? cell ?? null;
        const stitchType = cell?.type ?? null
        onEyedropper(color, stitchType);
        return;
      }

      if (activeTool === "fill") {
          const targetColor = getColor(pixels[idx]);
          const fillValue = patternType === "cross_stitch" ? { type: "stitch_full", color: currentColor } : currentColor;                                         
          onPixelsChange(floodFill(pixels, width, height, idx, targetColor, fillValue))  
        return;
      }

      if (activeTool === "pencil") {
        next[idx] = currentColor;
      } else if (activeTool === "eraser") {
        next[idx] = null;
      }
      onPixelsChange(next);
    },
    [activeTool, currentColor, pixels, width, height, patternType, getCell, onPixelsChange, onEyedropper],
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
        drawCell(ctx, col, row, pixels[row * width + col] ?? null, cellSize, patternType);
      }
    }

    // Grid lines (skip for iron bead — pegboard gaps are implicit)
    if (patternType !== "iron_bead") {
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
    if (activeTool === "pan") {
      isPanning.current = true;
      lastPan.current = { x: e.clientX, y: e.clientY };
      return;
    }
    isDrawing.current = true;
    applyTool(e);
  };
  const handleMouseMove = (e) => {
    if (activeTool === "pan" && isPanning.current) {
      const container = scrollContainerRef?.current;
      if (container) {
        container.scrollLeft -= e.clientX - lastPan.current.x;
        container.scrollTop  -= e.clientY - lastPan.current.y;
      }
      lastPan.current = { x: e.clientX, y: e.clientY };
      return;
    }
    if (!isDrawing.current) return;
    if (activeTool === "pencil" || activeTool === "eraser" || isStitchTool(activeTool)) applyTool(e);
  };
  const handleMouseUp = () => { isDrawing.current = false; isPanning.current = false; };
  const handleMouseLeave = () => { isDrawing.current = false; isPanning.current = false; };

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
