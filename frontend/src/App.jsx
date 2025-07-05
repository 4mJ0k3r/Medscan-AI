import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadPage from "./pages/UploadPage";
import Dashboard from "./pages/Dashboard";
import ReportDetails from "./pages/ReportDetails";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import TestingGuide from "./pages/TestingGuide";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Landing page (default route) */}
        <Route
          path="/"
          element={
            <Layout>
              <Landing />
            </Layout>
          }
        />

        {/* About page */}
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />

        {/* Services page */}
        <Route
          path="/services"
          element={
            <Layout>
              <Services />
            </Layout>
          }
        />

        {/* Contact page */}
        <Route
          path="/contact"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        />

        {/* Testing Guide page */}
        <Route
          path="/testing-guide"
          element={
            <Layout>
              <TestingGuide />
            </Layout>
          }
        />

        {/* Dashboard page - protected route */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        {/* Report details page - protected route */}
        <Route
          path="/report/:id"
          element={
            <Layout>
              <ReportDetails />
            </Layout>
          }
        />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Register page */}
        <Route path="/register" element={<Register />} />

        {/* Upload page */}
        <Route
          path="/upload"
          element={
            <Layout>
              <UploadPage />
            </Layout>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
