import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { sampleCommitments } from "../../data/mock";

export function LossOverview() {
  const totalLoss = sampleCommitments.reduce((acc, curr) => acc + curr.opportunityLoss, 0);

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/app" className="inline-flex items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Radar
      </Link>
      
      <header className="mb-12">
        <h1 className="text-4xl mb-4 text-ink">Total Value at Risk</h1>
        <p className="text-ink/70">A breakdown of what you stand to lose across all your commitments.</p>
      </header>
      
      <div className="bg-brick/5 border border-brick/20 p-8 mb-12">
        <div className="font-mono text-5xl text-brick font-medium text-center">
          ₹{totalLoss.toLocaleString("en-IN")}
        </div>
        <div className="text-center text-sm uppercase tracking-widest font-bold text-brick/70 mt-4">
          Total Opportunity Cost
        </div>
      </div>
      
      <div className="space-y-4">
        {sampleCommitments.filter(c => c.opportunityLoss > 0).map(item => (
          <div key={item.id} className="bg-white border border-rule p-6 flex items-center justify-between shadow-sm">
            <div>
              <h3 className="text-lg font-medium text-ink mb-1">{item.title}</h3>
              <span className="px-2 py-0.5 rounded-none bg-paper border border-rule text-[10px] uppercase tracking-widest font-bold text-ink/70">
                {item.category}
              </span>
            </div>
            <div className="text-right">
              <span className="block font-mono text-xl text-ink">₹{item.opportunityLoss.toLocaleString("en-IN")}</span>
              <span className="block text-xs text-ink/50 uppercase tracking-widest font-bold mt-1">At Risk</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
