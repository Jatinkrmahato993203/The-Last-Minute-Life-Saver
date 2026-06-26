import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { sampleCommitments } from "../../data/mock";

export function Dashboard() {
  const sortedCommitments = [...sampleCommitments].sort((a, b) => b.riskScore - a.riskScore);
  const totalRiskAmount = sortedCommitments.reduce((acc, curr) => acc + curr.opportunityLoss, 0);

  const getRiskColor = (score: number) => {
    if (score > 90) return "bg-brick";
    if (score > 70) return "bg-burnt";
    if (score > 40) return "bg-amber";
    return "bg-sage";
  };

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl mb-4">Your risk radar.</h1>
        <div className="flex items-center gap-4 bg-white border border-rule px-6 py-4 rounded-none shadow-sm">
          <div className="flex-1">
            <span className="block text-sm font-sans font-medium text-ink/70">Total Opportunity Risk</span>
            <span className="block text-2xl font-mono text-ink mt-1">₹{totalRiskAmount.toLocaleString("en-IN")}</span>
          </div>
          <div className="w-px h-10 bg-rule"></div>
          <div className="flex-1 text-right">
            <span className="block text-sm font-sans font-medium text-ink/70">Active Commitments</span>
            <span className="block text-2xl font-mono text-ink mt-1">{sortedCommitments.length}</span>
          </div>
        </div>
      </header>

      <div className="space-y-4">
        {sortedCommitments.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, rotateX: 80, y: 20 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1, type: "spring", bounce: 0 }}
            style={{ perspective: 1000 }}
          >
            <Link
              to={`/app/commitment/${item.id}`}
              className="group block relative bg-white border border-rule shadow-sm rounded-none overflow-hidden hover:bg-black/5 transition-all hover:-translate-y-0.5"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${getRiskColor(item.riskScore)} transition-colors group-hover:brightness-110`} />
              
              <div className="p-6 pl-8 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-none bg-paper border border-rule text-[10px] uppercase tracking-widest font-bold text-ink/70">
                      {item.category}
                    </span>
                    <span className="font-mono text-xs text-ink/60">{item.daysRemaining} days left</span>
                  </div>
                  <h3 className="text-xl truncate">{item.title}</h3>
                </div>
                
                <div className="text-right shrink-0 flex items-center gap-6">
                  {item.opportunityLoss > 0 && (
                    <div className="hidden sm:block">
                      <span className="block text-[10px] uppercase font-semibold text-ink/50 tracking-wider">At Risk</span>
                      <span className="block font-mono text-sm">₹{item.opportunityLoss.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="text-right">
                    <span className="block text-[10px] uppercase font-semibold text-ink/50 tracking-wider">Risk Score</span>
                    <span className={`block font-mono text-2xl ${item.riskScore > 70 ? (item.riskScore > 90 ? "text-brick" : "text-burnt") : "text-ink"}`}>
                      {item.riskScore}%
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
