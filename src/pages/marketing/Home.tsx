import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Gauge } from "../../components/ui/Gauge";

export function Home() {
  const [days, setDays] = useState(5);
  const [category, setCategory] = useState("Internship");

  // Simple static calculation for the hero calculator
  const baseRisk = days < 3 ? 85 : days < 7 ? 60 : 30;
  const rupeeLoss = category === "Internship" ? 50000 : category === "Scholarship" ? 100000 : category === "Exam" ? 0 : 5000;

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl md:text-[56px] leading-[1.1] mb-6">
              See what you're about to miss — and what it'll cost you.
            </h1>
            <p className="text-lg md:text-xl text-ink/80 mb-8 max-w-lg">
              Oracle calculates the real risk of missing your deadlines based on your history, and shows you exactly what slipping will cost in rupees.
            </p>
            <Link to="/auth/signup" className="inline-flex items-center justify-center font-sans font-bold uppercase tracking-widest text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber disabled:pointer-events-none disabled:opacity-50 h-14 px-8 border-2 bg-amber border-amber text-paper hover:bg-transparent hover:text-amber transition-all">
              Connect your calendar
            </Link>
          </div>

          {/* Interactive Calculator */}
          <div className="bg-[#1A1A1A] rounded-none p-8 border-t-2 border-amber">
            <h2 className="font-display text-2xl mb-6">What's at risk this semester?</h2>
            
            <div className="space-y-6 mb-10">
              <div>
                <label className="block font-sans text-xs uppercase tracking-widest font-bold text-ink/50 mb-2">If I miss my...</label>
                <select 
                  className="w-full bg-transparent border-b border-rule py-2 font-mono text-ink focus:outline-none focus:border-amber transition-colors"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Internship">Internship Deadline</option>
                  <option value="Scholarship">Scholarship App</option>
                  <option value="Exam">Final Exam</option>
                  <option value="Assignment">Major Assignment</option>
                </select>
              </div>

              <div>
                <label className="block font-sans text-xs uppercase tracking-widest font-bold text-ink/50 mb-2">And it's due in...</label>
                <div className="flex items-baseline gap-2">
                  <Input 
                    type="number" 
                    value={days} 
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-20 font-mono text-xl"
                  />
                  <span className="font-mono text-ink/70">days</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-rule">
              <div className="flex items-center justify-between mb-4">
                <span className="font-sans text-xs uppercase tracking-widest font-bold text-ink/50">Estimated Risk</span>
                <span className="font-mono text-2xl text-amber">{baseRisk}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs uppercase tracking-widest font-bold text-ink/50">Opportunity Cost</span>
                <span className="font-mono text-3xl font-medium text-brick">
                  {rupeeLoss > 0 ? `₹${rupeeLoss.toLocaleString('en-IN')}` : "Grades/Reputation"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explainer */}
      <section className="py-24 bg-ink text-paper px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl mb-6 text-paper">Reminders don't work. Math does.</h2>
          <p className="text-xl text-paper/70 mb-16">
            Reminders just tell you a deadline is coming. Oracle tells you if you're actually going to hit it.
          </p>

          <div className="grid md:grid-cols-3 gap-12 text-left">
            <div>
              <div className="font-mono text-amber text-lg mb-4">01. Connect</div>
              <h3 className="text-xl mb-3 text-paper">Calendar Sync</h3>
              <p className="text-paper/70 text-sm">We pull your upcoming deadlines and see how much free time you actually have to work on them.</p>
            </div>
            <div>
              <div className="font-mono text-amber text-lg mb-4">02. Calculate</div>
              <h3 className="text-xl mb-3 text-paper">Transparent Score</h3>
              <p className="text-paper/70 text-sm">No black-box AI. A clear mathematical formula comparing the work needed vs your track record.</p>
            </div>
            <div>
              <div className="font-mono text-amber text-lg mb-4">03. Recover</div>
              <h3 className="text-xl mb-3 text-paper">Action Plan</h3>
              <p className="text-paper/70 text-sm">See the rupee cost of failing, run what-if simulations, and get a concrete recovery plan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center">
        <h2 className="text-4xl mb-8">Stop guessing. See your real score.</h2>
        <Link to="/auth/signup" className="inline-flex items-center justify-center font-sans font-bold uppercase tracking-widest text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber disabled:pointer-events-none disabled:opacity-50 h-14 px-8 border-2 bg-amber border-amber text-paper hover:bg-transparent hover:text-amber transition-all">
          Start for free
        </Link>
      </section>
    </div>
  );
}
