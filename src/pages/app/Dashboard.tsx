import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAppStore } from "../../store";
import { Button } from "../../components/ui/Button";
import { getFreeBusy } from "../../lib/calendar";

export function Dashboard() {
  const { commitments, addCommitment, accessToken, successRate } = useAppStore();
  const sortedCommitments = [...commitments].sort((a, b) => b.riskScore - a.riskScore);
  const totalRiskAmount = sortedCommitments.reduce((acc, curr) => acc + curr.opportunityLoss, 0);
  
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Assignment");
  const [newDays, setNewDays] = useState(7);
  const [newHours, setNewHours] = useState(10);
  const [newLoss, setNewLoss] = useState(0);

  const getRiskColor = (score: number) => {
    if (score > 90) return "bg-brick";
    if (score > 70) return "bg-burnt";
    if (score > 40) return "bg-amber";
    return "bg-sage";
  };

  const handleAddSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    
    setIsSubmitting(true);
    let freeHours = Math.max(2, newHours - 5 - 1);
    if (accessToken) {
      const hours = await getFreeBusy(accessToken, newDays);
      if (hours !== null) freeHours = Math.round(hours);
    }
    
    const userRate = successRate * 10;
    const hourRatio = freeHours > 0 ? newHours / freeHours : 2;
    
    let calculatedRisk = 50;
    if (hourRatio > 1.2) calculatedRisk += 30;
    else if (hourRatio < 0.8) calculatedRisk -= 20;
    
    calculatedRisk += (100 - userRate) * 0.4;
    if (newDays < 4) calculatedRisk += 20;
    
    const currentRisk = Math.min(100, Math.max(0, Math.round(calculatedRisk)));

    addCommitment({
      id: Math.random().toString(36).substring(7),
      title: newTitle,
      daysRemaining: newDays,
      riskScore: currentRisk,
      opportunityLoss: newLoss,
      category: newCategory,
      estHoursNeeded: newHours
    });
    
    setNewTitle("");
    setNewDays(7);
    setNewHours(10);
    setNewLoss(0);
    setIsAdding(false);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-10 flex items-end justify-between">
        <div>
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
        </div>
        <div className="pb-4">
          <Button onClick={() => setIsAdding(!isAdding)}>{isAdding ? "Cancel" : "Add Task"}</Button>
        </div>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddSubmit}
            className="mb-8 bg-white border border-rule shadow-sm p-6 space-y-4 overflow-hidden"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full border border-rule px-3 py-2" required placeholder="Data Structures Final" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full border border-rule px-3 py-2">
                  <option>Exam</option>
                  <option>Assignment</option>
                  <option>Placement</option>
                  <option>Scholarship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Days Remaining</label>
                <input type="number" value={newDays} onChange={e => setNewDays(Number(e.target.value))} className="w-full border border-rule px-3 py-2" min="1" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Est. Hours Needed</label>
                <input type="number" value={newHours} onChange={e => setNewHours(Number(e.target.value))} className="w-full border border-rule px-3 py-2" min="1" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Opportunity Cost (₹)</label>
                <input type="number" value={newLoss} onChange={e => setNewLoss(Number(e.target.value))} className="w-full border border-rule px-3 py-2" min="0" />
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Calculating Risk..." : "Create Commitment"}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      {sortedCommitments.length === 0 ? (
        <div className="text-center py-20 bg-white border border-rule shadow-sm">
          <p className="text-ink/70 mb-4">No active commitments.</p>
          <Button onClick={() => setIsAdding(true)}>Add your first task</Button>
        </div>
      ) : (
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
      )}
    </div>
  );
}
