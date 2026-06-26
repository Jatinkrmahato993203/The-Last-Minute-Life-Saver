import { Button } from "../../components/ui/Button";
import { Link } from "react-router-dom";

export function Pricing() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl md:text-5xl font-display mb-6 text-ink">Simple Pricing</h1>
      <p className="text-xl text-ink/80 max-w-2xl mx-auto mb-16">
        Oracle is completely free while in beta. Protect your opportunities without any cost.
      </p>
      
      <div className="max-w-md mx-auto bg-white border border-rule shadow-sm p-8 text-left">
        <h2 className="text-2xl font-display mb-2 text-ink">Beta Plan</h2>
        <div className="font-mono text-4xl text-amber mb-6">₹0 <span className="text-sm text-ink/50 uppercase tracking-widest font-sans font-bold">/ forever</span></div>
        <ul className="space-y-4 mb-8">
          <li className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-amber shrink-0" />
            <span className="text-ink/80 text-sm">Unlimited commitments</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-amber shrink-0" />
            <span className="text-ink/80 text-sm">Calendar sync</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-amber shrink-0" />
            <span className="text-ink/80 text-sm">Risk calculation engine</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-amber shrink-0" />
            <span className="text-ink/80 text-sm">AI Recovery plans</span>
          </li>
        </ul>
        <Button asChild className="w-full">
          <Link to="/auth/signup">Get Started</Link>
        </Button>
      </div>
    </div>
  );
}
