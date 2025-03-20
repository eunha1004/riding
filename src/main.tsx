import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { getSavedLocations } from "./lib/locationStore";
import { AuthProvider } from "./components/auth/AuthContext";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

// Initialize locations in localStorage
try {
  getSavedLocations(); // This will set default locations if none exist
} catch (error) {
  console.error("Error initializing locations:", error);
}

// Remove Ant Design related localStorage item
try {
  localStorage.removeItem("useAntDesign");
} catch (error) {
  console.error("Error removing useAntDesign from localStorage:", error);
}

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
