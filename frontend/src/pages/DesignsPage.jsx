import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import DesignPreview from "../components/DesignPreview";
import { PATTERN_TYPE_LABELS } from "../data/palettes";

export default function DesignsPage() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const renameInputRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/designs")
      .then((res) => setDesigns(res.data))
      .finally(() => setLoading(false));
  }, []);

  // Focus rename input when it appears
  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  const startRename = (design) => {
    setRenamingId(design.id);
    setRenameValue(design.title);
    setDeletingId(null);
  };

  const cancelRename = () => {
    setRenamingId(null);
    setRenameValue("");
  };

  const confirmRename = async (id) => {
    const trimmed = renameValue.trim();
    if (!trimmed) return;
    try {
      const res = await api.patch(`/designs/${id}`, { title: trimmed });
      setDesigns((prev) => prev.map((d) => (d.id === id ? res.data : d)));
    } catch {
      // silently revert on error
    }
    cancelRename();
  };

  const handleRenameKeyDown = (e, id) => {
    if (e.key === "Enter") confirmRename(id);
    if (e.key === "Escape") cancelRename();
  };

  const startDelete = (id) => {
    setDeletingId(id);
    setRenamingId(null);
  };

  const cancelDelete = () => setDeletingId(null);

  const confirmDelete = async (id) => {
    try {
      await api.delete(`/designs/${id}`);
      setDesigns((prev) => prev.filter((d) => d.id !== id));
    } catch {
      // silently ignore
    }
    setDeletingId(null);
  };

  return (
    <div className="designs-page">
      <div className="designs-header">
        <h1>My Designs</h1>
        <div>
          <Link to="/designs/new" className="new-design-link">
            + New Design
          </Link>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : designs.length === 0 ? (
        <p>No designs yet. Create your first one!</p>
      ) : (
        <ul className="designs-list">
          {designs.map((design) => {
            const pixels = design.canvas_data ? JSON.parse(design.canvas_data) : null;
            const patternLabel = PATTERN_TYPE_LABELS[design.pattern_type] || design.pattern_type;
            const isRenaming = renamingId === design.id;
            const isDeleting = deletingId === design.id;

            return (
              <li key={design.id} className="design-card">
                <div className="design-card-preview">
                  <DesignPreview
                    pixels={pixels}
                    width={design.width}
                    height={design.height}
                    patternType={design.pattern_type}
                  />
                </div>

                <div className="design-card-body">
                  <div className="design-card-title-row">
                    {isRenaming ? (
                      <>
                        <input
                          ref={renameInputRef}
                          className="rename-input"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => handleRenameKeyDown(e, design.id)}
                        />
                        <button
                          className="rename-confirm"
                          onClick={() => confirmRename(design.id)}
                          title="Confirm"
                        >
                          ✓
                        </button>
                        <button
                          className="rename-cancel"
                          onClick={cancelRename}
                          title="Cancel"
                        >
                          ✗
                        </button>
                      </>
                    ) : (
                      <>
                        <h3 className="design-card-title">{design.title}</h3>
                        <button
                          className="rename-trigger"
                          onClick={() => startRename(design)}
                          title="Rename"
                        >
                          ✏️
                        </button>
                      </>
                    )}
                  </div>

                  <p className="design-card-meta">
                    {design.width}×{design.height} · {patternLabel}
                  </p>
                  <small className="design-card-date">
                    Created: {new Date(design.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </small>
                </div>

                <div className="design-card-actions">
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/designs/${design.id}/edit`)}
                  >
                    Edit
                  </button>

                  {isDeleting ? (
                    <div className="delete-confirm">
                      <span>Delete?</span>
                      <button className="btn-delete-yes" onClick={() => confirmDelete(design.id)}>Yes</button>
                      <button className="btn-delete-no" onClick={cancelDelete}>No</button>
                    </div>
                  ) : (
                    <button className="btn-delete" onClick={() => startDelete(design.id)}>
                      Delete
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
