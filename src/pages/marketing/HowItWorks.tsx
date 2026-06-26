import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";

export function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-display mb-6 text-ink">The Oracle Formula</h1>
        <p className="text-xl text-ink/80 max-w-2xl leading-relaxed">
          Oracle is not a black-box AI that guesses your chances of success. It is a deterministic mathematical formula that compares the hours you need against the hours you actually have.
        </p>
      </div>

      <div className="space-y-12 mb-20">
        <section className="bg-white p-8 border border-rule shadow-sm">
          <h2 className="text-2xl font-display mb-4 text-ink">1. Finding Your Deficit</h2>
          <p className="text-ink/80 mb-6">First, we calculate the absolute gap between the work required and your available calendar free time.</p>
          <div className="bg-ink/5 p-6 border border-rule font-mono text-sm mb-6 text-ink">
            <span className="text-amber">Deficit</span> = <span className="text-ink/60">Estimated Task Hours</span> - <span className="text-ink/60">Available Free Calendar Hours</span>
          </div>
          <p className="text-ink/70 text-sm">
            If you need 20 hours to finish an essay, but your calendar only has 10 hours of free time before the deadline, you have a 10-hour deficit.
          </p>
        </section>

        <section className="bg-white p-8 border border-rule shadow-sm">
          <h2 className="text-2xl font-display mb-4 text-ink">2. The Hour Ratio</h2>
          <p className="text-ink/80 mb-6">We measure how tight your schedule is by comparing required hours to available hours.</p>
          <div className="bg-ink/5 p-6 border border-rule font-mono text-sm mb-6 text-ink">
            <span className="text-amber">Hour Ratio</span> = <span className="text-ink/60">Estimated Task Hours</span> / <span className="text-ink/60">Available Free Calendar Hours</span>
          </div>
          <p className="text-ink/70 text-sm">
            A ratio &gt; 1.0 means you literally do not have enough time. A ratio &lt; 0.8 means you have a safe buffer.
          </p>
        </section>

        <section className="bg-white p-8 border border-rule shadow-sm">
          <h2 className="text-2xl font-display mb-4 text-ink">3. The Risk Calculation</h2>
          <p className="text-ink/80 mb-6">We combine your Hour Ratio, your historical success rate, and the urgency of the deadline.</p>
          <div className="bg-ink text-paper p-6 font-mono text-sm leading-loose">
            <div className="mb-2">let Risk = 50</div>
            
            <div className="text-paper/50">/* Schedule tightness penalty/bonus */</div>
            <div>if (HourRatio &gt; 1.2) Risk += 30</div>
            <div className="mb-2">else if (HourRatio &lt; 0.8) Risk -= 20</div>
            
            <div className="text-paper/50">/* Historical track record */</div>
            <div className="mb-2">Risk += (100 - YourOnTimeRate) * 0.4</div>
            
            <div className="text-paper/50">/* Urgency penalty */</div>
            <div>if (DaysRemaining &lt; 4) Risk += 20</div>
          </div>
        </section>
      </div>

      <div className="text-center">
        <h2 className="text-3xl mb-8 text-ink">Ready to see your real score?</h2>
        <Button asChild className="h-14">
          <Link to="/auth/signup">Connect your calendar</Link>
        </Button>
      </div>
    </div>
  );
}
