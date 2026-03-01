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
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>My Designs</h1>
        <div>
          <Link to="/designs/new" style={{ marginRight: 16 }}>
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
        <ul style={{ listStyle: "none", padding: 0 }}>
          {designs.map((design) => (
            <li
              key={design.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <h3 style={{ margin: "0 0 8px" }}>{design.title}</h3>
              {design.description && <p style={{ margin: "0 0 8px" }}>{design.description}</p>}
              <small style={{ color: "#666" }}>
                Created: {new Date(design.created_at).toLocaleDateString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
