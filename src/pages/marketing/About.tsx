import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";

export function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl md:text-5xl font-display mb-12 text-ink">About Oracle</h1>
      
      <div className="space-y-8 text-ink/80 leading-relaxed">
        <p className="text-lg">
          Oracle was built for a single purpose: to give you a mathematically honest view of your deadlines and what happens if you miss them.
        </p>
        
        <p>
          Students lose millions in scholarships, grants, and internships every year simply due to poor time management. We believe that seeing the exact rupee value of an opportunity at risk changes your behavior.
        </p>
        
        <p>
          We don't use manipulative notifications or black-box AI that guesses your chances. We look at your calendar, we look at the hours you need, and we calculate a deterministic score based on cold, hard reality.
        </p>
        
        <div className="pt-8">
          <Button asChild>
            <Link to="/auth/signup">Protect your opportunities</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
