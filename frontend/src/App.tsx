import "./App.css";
import Navbar from "./components/Navbar";
import FileManager from "./pages/FileManager";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { config } from "./config/wagmi";
import { ProtectedRoute } from "./components/ProtectedRoutes";
import "@rainbow-me/rainbowkit/styles.css";
// import React from 'react';
import { ThemeProvider } from "./context/ThemeContext";
import Settings from "./pages/Settings";
import Recent from "./pages/Recent";
import Shared from "./pages/Shared";
import "./styles/theme.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider>
        <ThemeProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-background">
              <Navbar />
              <main className="flex-1 container mx-auto px-4">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/files"
                    element={
                      <ProtectedRoute>
                        <FileManager />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/recent"
                    element={
                      <ProtectedRoute>
                        <Recent />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/shared"
                    element={
                      <ProtectedRoute>
                        <Shared />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <h1 className="text-2xl text-center py-12 text-gray-900">
                        Page Not Found
                      </h1>
                    }
                  />
                </Routes>
              </main>
              <Footer />
              <ToastContainer />
            </div>
          </Router>
        </ThemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
