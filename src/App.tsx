/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MarketingLayout } from "./components/layout/MarketingLayout";
import { AppLayout } from "./components/layout/AppLayout";
import { Home } from "./pages/marketing/Home";
import { Signup } from "./pages/auth/Signup";
import { Baseline } from "./pages/onboarding/Baseline";
import { Dashboard } from "./pages/app/Dashboard";
import { CommitmentDetail } from "./pages/app/CommitmentDetail";
import { LossOverview } from "./pages/app/LossOverview";
import { Settings } from "./pages/app/Settings";
import { HowItWorks } from "./pages/marketing/HowItWorks";
import { Pricing } from "./pages/marketing/Pricing";
import { About } from "./pages/marketing/About";
import { Privacy } from "./pages/marketing/Privacy";
import { Terms } from "./pages/marketing/Terms";
import { Login } from "./pages/auth/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Marketing Routes */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
        </Route>

        <Route path="/onboarding/baseline" element={<Baseline />} />

        {/* App Routes */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="commitment/:id" element={<CommitmentDetail />} />
          <Route path="loss-overview" element={<LossOverview />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

