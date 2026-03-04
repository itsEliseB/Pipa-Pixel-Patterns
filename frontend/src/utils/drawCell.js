const EMPTY_COLOR = "#f8f8f8";

export const getColor = cell => cell?.color ?? cell ?? null;

export function drawCrossStitchCell(ctx, x, y, cell, cellSize) {
  ctx.fillStyle = EMPTY_COLOR;
  ctx.fillRect(x, y, cellSize, cellSize);

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
    case "stitch_full":       line(tl, br); line(tr, bl);        break;
    case "stitch_half_tl_br": line(tl, br);                      break;
    case "stitch_half_bl_tr": line(bl, tr);                      break;
    case "stitch_q_tl":       line(tl, [cx, cy]);                break;
    case "stitch_q_tr":       line(tr, [cx, cy]);                break;
    case "stitch_q_bl":       line(bl, [cx, cy]);                break;
    case "stitch_q_br":       line(br, [cx, cy]);                break;
    case "stitch_3q_tl":      line(tl, br); line(tr, [cx, cy]); break;
    case "stitch_3q_tr":      line(bl, tr); line(tl, [cx, cy]); break;
    case "stitch_3q_bl":      line(bl, tr); line(br, [cx, cy]); break;
    case "stitch_3q_br":      line(tl, br); line(bl, [cx, cy]); break;
  }
}
