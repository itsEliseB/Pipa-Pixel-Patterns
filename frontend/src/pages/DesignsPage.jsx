import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function DesignsPage() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    api
      .get("/designs")
      .then((res) => setDesigns(res.data))
      .finally(() => setLoading(false));
  }, []);

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
        <p>Loading...</p>
      ) : designs.length === 0 ? (
        <p>No designs yet. Create your first one!</p>
      ) : (
        <ul className="designs-list">
          {designs.map((design) => (
            <li key={design.id} className="design-card">
              <h3 className="design-card-title">{design.title}</h3>
              {design.description && <p className="design-card-description">{design.description}</p>}
              <small className="design-card-date">
                Created: {new Date(design.created_at).toLocaleDateString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
