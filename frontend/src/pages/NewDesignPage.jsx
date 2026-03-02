import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import CanvasEditor from "../components/CanvasEditor";
import { CANVAS_SIZES, PATTERN_TYPE_LABELS } from "../data/palettes";

const PATTERN_TYPES = Object.keys(PATTERN_TYPE_LABELS);

export default function NewDesignPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [patternType, setPatternType] = useState("pixel_art");
  const [sizeIdx, setSizeIdx] = useState(1); // default to second option (32×32)
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const pixelsRef = useRef(null);

  const sizes = CANVAS_SIZES[patternType];
  const { width, height } = sizes[Math.min(sizeIdx, sizes.length - 1)];

  const handlePatternChange = (type) => {
    setPatternType(type);
    setSizeIdx(0);
    pixelsRef.current = null;
  };

  const handleSizeChange = (idx) => {
    setSizeIdx(idx);
    pixelsRef.current = null;
  };

  const handleDataChange = useCallback((pixels) => {
    pixelsRef.current = pixels;
  }, []);

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const safeIdx = Math.min(sizeIdx, sizes.length - 1);
      const { width: w, height: h } = sizes[safeIdx];
      await api.post("/designs", {
        title: title.trim(),
        description: "",
        pattern_type: patternType,
        width: w,
        height: h,
        canvas_data: JSON.stringify(pixelsRef.current || Array(w * h).fill(null)),
      });
      navigate("/");
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Key forces CanvasEditor remount when type or size changes (resets pixels)
  const editorKey = `${patternType}-${width}-${height}`;

  return (
    <div className="new-design-page">
      {/* Header bar */}
      <div className="design-header">
        <input
          type="text"
          placeholder="Design title…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="design-title-input"
        />

        <div className="pattern-type-group">
          {PATTERN_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => handlePatternChange(type)}
              className={`pattern-btn${patternType === type ? " active" : ""}`}
            >
              {PATTERN_TYPE_LABELS[type]}
            </button>
          ))}
        </div>

        <div className="size-group">
          <span className="size-label">Size:</span>
          <select
            value={Math.min(sizeIdx, sizes.length - 1)}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
            className="size-select"
          >
            {sizes.map((s, i) => (
              <option key={s.label} value={i}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="header-actions">
          {error && <span className="error-text">{error}</span>}
          <button
            onClick={() => navigate("/")}
            className="btn-cancel"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-save"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Editor */}
      <CanvasEditor
        key={editorKey}
        patternType={patternType}
        width={width}
        height={height}
        onDataChange={handleDataChange}
      />
    </div>
  );
}
