import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoutes";
import Header from "./components/Header";
import Footer from "./components/Header";
import Register from "./pages/Register";

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />

        {/* Dashboard - Protected Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
