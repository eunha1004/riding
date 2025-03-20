import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import AuthContainer from "./components/auth/AuthContainer";
import AuthGuard from "./components/auth/AuthGuard";

// Lazy load the KakaoCallback component
const KakaoCallback = lazy(() => import("./components/auth/KakaoCallback"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-lg font-medium">Loading...</div>
        </div>
      }
    >
      <>
        <Routes>
          <Route
            path="/"
            element={
              <AuthGuard>
                <Home />
              </AuthGuard>
            }
          />
          <Route path="/auth/*" element={<AuthContainer />} />
          <Route path="/auth/kakao-callback" element={<KakaoCallback />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
