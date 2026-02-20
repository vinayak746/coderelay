import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import TeamCalendar from "./pages/TeamCalendar";
import LeaveHistory from "./pages/LeaveHistory";
import "./App.css";

function ManagerOnly({ children }) {
  const { isManager } = useAuth();
  return isManager ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<EmployeeDashboard />} />
                    <Route
                      path="/manager"
                      element={
                        <ManagerOnly>
                          <ManagerDashboard />
                        </ManagerOnly>
                      }
                    />
                    <Route path="/calendar" element={<TeamCalendar />} />
                    <Route path="/history" element={<LeaveHistory />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
