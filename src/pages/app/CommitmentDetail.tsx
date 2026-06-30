import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { Gauge } from "../../components/ui/Gauge";
import { Button } from "../../components/ui/Button";
import { useAppStore } from "../../store";
import { getFreeBusy } from "../../lib/calendar";

export function CommitmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { successRate, commitments, accessToken, deleteCommitment, updateCommitment } = useAppStore();
  
  const commitment = commitments.find(c => c.id === id);
  
  const [addedHours, setAddedHours] = useState(0);
  const [showPlan, setShowPlan] = useState(false);
  const [planText, setPlanText] = useState("");
  const [hasAiError, setHasAiError] = useState(false);
  const [proposedEvent, setProposedEvent] = useState<any>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);

  // Dynamic ledger values based on commitment to avoid identical hardcoded values
  const seed = commitment ? parseInt(commitment.id, 10) || 1 : 1;
  const estHoursNeeded = commitment?.estHoursNeeded || (10 + (seed * 5)); // Use provided or generate
  
  const [freeCalendarHours, setFreeCalendarHours] = useState<number>(Math.max(2, estHoursNeeded - 5 - (seed * 2)));

  useEffect(() => {
    if (accessToken && commitment?.daysRemaining) {
      getFreeBusy(accessToken, commitment.daysRemaining).then(hours => {
        if (hours !== null) setFreeCalendarHours(Math.round(hours));
      });
    }
  }, [accessToken, commitment?.daysRemaining]);

  if (!commitment) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-display mb-4 text-ink">Commitment Not Found</h1>
        <p className="text-ink/70 mb-8">The commitment you are looking for does not exist.</p>
        <Button asChild>
          <Link to="/app">Back to Radar</Link>
        </Button>
      </div>
    );
  }

  const userRate = successRate * 10; // 0-10 to 0-100%
  
  // Calculate risk properly
  const totalFreeHours = freeCalendarHours + (addedHours * commitment.daysRemaining);
  const hourRatio = totalFreeHours > 0 ? estHoursNeeded / totalFreeHours : 2;
  const deficit = Math.max(0, estHoursNeeded - totalFreeHours);
  
  // f(days_remaining, estimated_task_hours / available_free_calendar_hours, user_historical_on_time_rate)
  let calculatedRisk = 50; 
  if (hourRatio > 1.2) calculatedRisk += 30;
  else if (hourRatio < 0.8) calculatedRisk -= 20;
  
  calculatedRisk += (100 - userRate) * 0.4; // lower history = higher risk
  if (commitment.daysRemaining < 4) calculatedRisk += 20;
  
  const currentRisk = Math.min(100, Math.max(0, Math.round(calculatedRisk)));

  useEffect(() => {
    if (commitment?.id && commitment.riskScore !== currentRisk) {
      updateCommitment(commitment.id, { riskScore: currentRisk });
    }
  }, [currentRisk, commitment?.id, commitment?.riskScore, updateCommitment]);

  const handleGeneratePlan = async () => {
    setShowPlan(true);
    setLoadingPlan(true);
    setHasAiError(false);
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({
          commitment,
          addedHours,
          deficit,
          currentRisk
        })
      });
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Try again later.");
        }
        throw new Error("Failed to generate plan");
      }
      
      const data = await response.json();
      setPlanText(data.plan);
      if (data.proposedEvent) {
        setProposedEvent(data.proposedEvent);
      }
    } catch (e: any) {
      setHasAiError(true);
      setPlanText(e.message === "Rate limit exceeded. Try again later." 
        ? "Rate limit exceeded. Please try again in a few minutes."
        : "Block out time on your calendar daily and remove distractions."
      );
    } finally {
      setLoadingPlan(false);
    }
  };

  const handleConfirmEvent = async () => {
    if (!proposedEvent) return;
    setCreatingEvent(true);
    try {
      const response = await fetch("/api/create-event", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify(proposedEvent)
      });
      if (response.ok) {
        setProposedEvent(null);
        alert("Event created successfully!");
      } else {
        throw new Error("Failed to create event");
      }
    } catch (e) {
      alert("Error creating event");
    } finally {
      setCreatingEvent(false);
    }
  };

  const handleDelete = () => {
    if (id && window.confirm("Are you sure you want to delete this commitment?")) {
      deleteCommitment(id);
      navigate("/app");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link to="/app" className="inline-flex items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Radar
        </Link>
        <Button variant="ghost" className="text-brick hover:bg-brick/5 h-8 px-3 text-xs" onClick={handleDelete}>
          <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
        </Button>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-2 py-1 rounded-none bg-paper border border-rule text-xs uppercase tracking-widest font-bold text-ink/70">
            {commitment.category}
          </span>
          <span className="font-mono text-sm text-ink/60">{commitment.daysRemaining} days left</span>
        </div>
        <h1 className="text-4xl md:text-5xl">{commitment.title}</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left Col: Gauge & Ledger */}
        <div className="space-y-12">
          <div className="flex flex-col items-center">
            <Gauge value={currentRisk} className="mb-6 scale-125" />
            <div className="text-center">
              <div className="font-display text-6xl text-ink leading-none">{currentRisk}%</div>
              <div className="text-sm font-sans font-medium uppercase tracking-wider text-ink/50 mt-2">Current Risk</div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, rotateX: 60 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="bg-white border border-rule shadow-sm rounded-none p-6 preserve-3d"
            style={{ perspective: 1000 }}
          >
            <h2 className="text-xl mb-6">Why this score</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-rule">
                <span className="font-sans text-ink/70 text-sm">Days Remaining</span>
                <span className="font-mono text-ink">{commitment.daysRemaining}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-rule">
                <span className="font-sans text-ink/70 text-sm">Est. Hours Needed</span>
                <span className="font-mono text-ink">{estHoursNeeded.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-rule">
                <span className="font-sans text-ink/70 text-sm">Free Calendar Hours</span>
                <span className="font-mono text-ink">{freeCalendarHours.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-rule">
                <span className="font-sans text-ink/70 text-sm">Your On-Time Rate</span>
                <span className="font-mono text-amber">{userRate}%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Col: Simulator & Recovery */}
        <div className="space-y-8">
          <div className="bg-white border border-rule shadow-sm rounded-none p-6">
            <h2 className="text-xl mb-2">What if...</h2>
            <p className="text-sm text-ink/70 mb-8">See how changes to your effort affect the risk score.</p>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="study-hours" className="font-sans font-medium text-sm text-ink">Add daily study hours</label>
                <span className="font-mono text-ink bg-transparent px-2 py-1 border border-rule rounded-none text-sm">+{addedHours}h/day</span>
              </div>
              <input 
                id="study-hours"
                type="range" 
                min="0" 
                max="6" 
                step="0.5"
                value={addedHours}
                onChange={(e) => setAddedHours(Number(e.target.value))}
                className="w-full accent-amber"
              />
              {currentRisk === 100 && addedHours === 6 && (
                <p className="text-xs text-brick mt-3">Even at max effort, this deadline is high-risk. Consider focusing elsewhere or renegotiating the deadline.</p>
              )}
            </div>

            {!showPlan ? (
              <Button onClick={handleGeneratePlan} className="w-full">
                Generate recovery plan
              </Button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-white border border-amber/20 shadow-sm rounded-none p-5 mt-6"
              >
                <h3 className="text-lg font-medium text-ink mb-2">Recovery Plan</h3>
                {loadingPlan ? (
                  <p className="text-sm text-ink/80 leading-relaxed mb-4">Analyzing options...</p>
                ) : (
                  <>
                    <p className="text-sm text-ink/80 leading-relaxed mb-4">
                      Based on your calendar, you have a {deficit.toFixed(1)} hour deficit. To hit this deadline, you must commit to +{Math.max(2, addedHours)} hours per day. 
                    </p>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${hasAiError ? 'bg-brick' : 'bg-amber'} mt-1.5 shrink-0`} />
                        <div>
                          {hasAiError && <span className="block text-xs font-bold text-brick mb-1 uppercase tracking-wider">AI Plan Unavailable</span>}
                          <p className={`text-sm ${hasAiError ? 'text-ink/60 italic' : 'text-ink'}`}>{planText}</p>
                        </div>
                      </div>
                    </div>
                    {proposedEvent && (
                      <div className="mt-4 p-4 border border-amber/30 bg-amber/5">
                        <h4 className="text-sm font-medium mb-1 text-ink">Proposed Calendar Event:</h4>
                        <p className="text-xs text-ink/70 mb-3">
                          {proposedEvent.title} <br/>
                          {new Date(proposedEvent.startTime).toLocaleString()} - {new Date(proposedEvent.endTime).toLocaleTimeString()}
                        </p>
                        <Button onClick={handleConfirmEvent} disabled={creatingEvent} className="w-full text-xs h-8">
                          {creatingEvent ? "Adding..." : "Add to Google Calendar"}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </div>
          
          {commitment.opportunityLoss > 0 && (
            <div className="bg-white border border-brick/20 shadow-sm rounded-none p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-brick/10 flex items-center justify-center shrink-0">
                <span className="text-brick font-bold">₹</span>
              </div>
              <div>
                <h3 className="font-medium text-ink mb-1">Opportunity Cost</h3>
                <p className="text-sm text-ink/70">Missing this deadline will cost you an estimated <strong className="font-mono text-brick font-medium">₹{commitment.opportunityLoss.toLocaleString("en-IN")}</strong> in potential stipends.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
