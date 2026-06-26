import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirebaseAuth, getGoogleProvider } from "../../lib/firebase";
import { useAppStore } from "../../store";

export function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const { setAccessToken } = useAppStore();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      const googleProvider = getGoogleProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setAccessToken(credential.accessToken);
      }
      navigate("/onboarding/baseline");
    } catch (error) {
      console.error(error);
      alert("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-6">
      <div className="max-w-md w-full bg-white border border-rule rounded-none p-8 shadow-sm text-center">
        <h1 className="text-3xl mb-4">Connect your calendar</h1>
        <p className="text-ink/70 mb-6 font-sans">
          Oracle needs read-only access to your Google Calendar to calculate your free time and upcoming deadlines.
        </p>
        
        <div className="mb-8 text-left bg-ink/5 p-4 border border-rule">
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 accent-amber"
            />
            <span className="text-xs text-ink/70 font-sans leading-relaxed">
              I consent to the processing of my calendar data for the purpose of risk calculation, in accordance with the Digital Personal Data Protection Act (DPDP).
            </span>
          </label>
        </div>
        
        <div className="space-y-4">
          <Button onClick={handleLogin} disabled={loading || !consent} className="w-full">
            {loading ? "Connecting..." : "Continue with Google"}
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
