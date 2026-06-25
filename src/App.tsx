/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MarketingLayout } from "./components/layout/MarketingLayout";
import { AppLayout } from "./components/layout/AppLayout";
import { Home } from "./pages/marketing/Home";
import { Signup } from "./pages/auth/Signup";
import { Baseline } from "./pages/onboarding/Baseline";
import { Dashboard } from "./pages/app/Dashboard";
import { CommitmentDetail } from "./pages/app/CommitmentDetail";

// Placeholder components for routing
const Placeholder = ({ title }: { title: string }) => (
  <div className="py-20 text-center"><h1 className="text-3xl">{title}</h1></div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Marketing Routes */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<Placeholder title="How It Works" />} />
          <Route path="/pricing" element={<Placeholder title="Pricing" />} />
          <Route path="/about" element={<Placeholder title="About / Trust" />} />
          <Route path="/privacy" element={<Placeholder title="Privacy Policy" />} />
          <Route path="/terms" element={<Placeholder title="Terms of Service" />} />
          <Route path="/auth/login" element={<Placeholder title="Log in" />} />
          <Route path="/auth/signup" element={<Signup />} />
        </Route>

        <Route path="/onboarding/baseline" element={<Baseline />} />

        {/* App Routes */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="commitment/:id" element={<CommitmentDetail />} />
          <Route path="loss-overview" element={<Placeholder title="Opportunity Loss Overview" />} />
          <Route path="settings" element={<Placeholder title="Settings" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

