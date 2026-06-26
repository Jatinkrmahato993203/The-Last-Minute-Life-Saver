import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAppStore } from "../../store";
import { Button } from "../../components/ui/Button";

export function Settings() {
  const navigate = useNavigate();
  const { successRate, setSuccessRate, accessToken, setAccessToken } = useAppStore();

  const handleDisconnect = () => {
    setAccessToken(null);
    navigate("/auth/login");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/app" className="inline-flex items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Radar
      </Link>
      
      <header className="mb-12">
        <h1 className="text-4xl text-ink">Settings</h1>
      </header>
      
      <div className="space-y-8">
        <section className="bg-white border border-rule p-8 shadow-sm">
          <h2 className="text-xl font-display text-ink mb-2">Historical Baseline</h2>
          <p className="text-sm text-ink/70 mb-6">Update your base track record. This influences all your risk calculations.</p>
          
          <div className="mb-6">
            <div className="flex justify-between items-end mb-4">
              <span className="text-sm font-medium text-ink">Success Rate (Last 10 Deadlines)</span>
              <span className="font-mono text-2xl text-amber">{successRate} / 10</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="10" 
              value={successRate}
              onChange={(e) => setSuccessRate(Number(e.target.value))}
              className="w-full accent-amber"
            />
          </div>
        </section>

        <section className="bg-white border border-rule p-8 shadow-sm">
          <h2 className="text-xl font-display text-ink mb-2">Connected Accounts</h2>
          <p className="text-sm text-ink/70 mb-6">Manage your calendar integrations.</p>
          
          <div className="flex items-center justify-between border-t border-rule pt-6">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${accessToken ? 'bg-sage' : 'bg-brick'}`} />
              <span className="font-medium text-ink">Google Calendar</span>
            </div>
            {accessToken ? (
              <Button onClick={handleDisconnect} variant="ghost" className="text-brick hover:text-brick hover:bg-brick/5">Disconnect</Button>
            ) : (
              <span className="text-ink/50 text-sm">Disconnected</span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
