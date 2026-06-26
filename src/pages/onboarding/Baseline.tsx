import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { useAppStore } from "../../store";

export function Baseline() {
  const navigate = useNavigate();
  const { successRate, setSuccessRate } = useAppStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-6">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-4xl md:text-5xl mb-12">
          Of your last 10 deadlines, how many did you hit on time?
        </h1>
        
        <div className="mb-16">
          <div className="text-9xl font-display text-ink mb-8">
            {successRate}
          </div>
          <input 
            type="range" 
            min="0" 
            max="10" 
            value={successRate}
            onChange={(e) => setSuccessRate(Number(e.target.value))}
            className="w-full max-w-sm accent-amber"
          />
        </div>

        <Button onClick={() => navigate("/app")} className="h-14 px-10 text-lg">
          See my first score
        </Button>
      </div>
    </div>
  );
}
