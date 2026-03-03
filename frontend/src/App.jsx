import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DesignsPage from "./pages/DesignsPage";
import NewDesignPage from "./pages/NewDesignPage";
import EditDesignPage from "./pages/EditDesignPage";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DesignsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/designs/new"
        element={
          <ProtectedRoute>
            <NewDesignPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/designs/:id/edit"
        element={
          <ProtectedRoute>
            <EditDesignPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
