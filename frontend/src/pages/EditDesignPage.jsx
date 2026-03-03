import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import CanvasEditor from "../components/CanvasEditor";
import { PATTERN_TYPE_LABELS } from "../data/palettes";

export default function EditDesignPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [design, setDesign] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const pixelsRef = useRef(null);

  useEffect(() => {
    api
      .get(`/designs/${id}`)
      .then((res) => {
        setDesign(res.data);
        setTitle(res.data.title);
      })
      .catch(() => setError("Design not found."))
      .finally(() => setLoading(false));
  }, [id]);

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
      const canvas_data = pixelsRef.current
        ? JSON.stringify(pixelsRef.current)
        : design.canvas_data;
      await api.put(`/designs/${id}`, {
        title: title.trim(),
        description: design.description || "",
        canvas_data,
      });
      navigate("/");
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="new-design-page"><p style={{ padding: 24 }}>Loading…</p></div>;
  if (!design) return <div className="new-design-page"><p style={{ padding: 24 }}>{error || "Design not found."}</p></div>;

  const initialPixels = design.canvas_data ? JSON.parse(design.canvas_data) : null;
  const patternLabel = PATTERN_TYPE_LABELS[design.pattern_type] || design.pattern_type;

  return (
    <div className="new-design-page">
      <div className="design-header">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="design-title-input"
          placeholder="Design title…"
        />

        <div className="design-meta-readonly">
          <span className="design-meta-label">{patternLabel}</span>
          <span className="design-meta-label">{design.width}×{design.height}</span>
        </div>

        <div className="header-actions">
          {error && <span className="error-text">{error}</span>}
          <button onClick={() => navigate("/")} className="btn-cancel">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-save">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <CanvasEditor
        patternType={design.pattern_type}
        width={design.width}
        height={design.height}
        onDataChange={handleDataChange}
        initialPixels={initialPixels}
      />
    </div>
  );
}
