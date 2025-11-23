import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PersonalInfo from "./pages/ProfileCreation";
import { AddressInfo, EducationalInfo, Certifications, Experience } from "./pages/ProfileCreation";
import Documents from "./pages/Documents";
import Applications from "./pages/Applications";
import NotFound from "./pages/NotFound";
import { PrivateRoute } from "./components/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster position="top-right" richColors toastOptions={{ duration: 3000, className: "mb-2" }} />

      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Login />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/personal"
            element={
              <PrivateRoute>
                <PersonalInfo />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/AddressInfo"
            element={
              <PrivateRoute>
                <AddressInfo />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/EducationalInfo"
            element={
              <PrivateRoute>
                <EducationalInfo />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/Certifications"
            element={
              <PrivateRoute>
                <Certifications />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/Experience"
            element={
              <PrivateRoute>
                <Experience />
              </PrivateRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <PrivateRoute>
                <Applications />
              </PrivateRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <PrivateRoute>
                <Documents />
              </PrivateRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
