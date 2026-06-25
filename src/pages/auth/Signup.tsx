import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";

export function Signup() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-6">
      <div className="max-w-md w-full bg-[#1A1A1A] border-t-2 border-amber rounded-none p-8 shadow-sm text-center">
        <h1 className="text-3xl mb-4">Connect your calendar</h1>
        <p className="text-ink/70 mb-8 font-sans">
          Oracle needs read-only access to your Google Calendar to calculate your free time and upcoming deadlines.
        </p>
        
        <div className="space-y-4">
          <Button onClick={() => navigate("/onboarding/baseline")} className="w-full">
            Continue with Google
          </Button>
          <Button variant="ghost" onClick={() => navigate("/app")} className="w-full">
            Skip for now
          </Button>
        </div>

        <p className="mt-8 text-xs text-ink/50 font-sans">
          By connecting, you agree to our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
