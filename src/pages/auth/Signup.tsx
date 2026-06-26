import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import firebaseConfig from '../../../firebase-applet-config.json';
import { useAppStore } from "../../store";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar.readonly');

export function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setAccessToken } = useAppStore();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
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
      <div className="max-w-md w-full bg-[#1A1A1A] border-t-2 border-amber rounded-none p-8 shadow-sm text-center">
        <h1 className="text-3xl mb-4">Connect your calendar</h1>
        <p className="text-ink/70 mb-8 font-sans">
          Oracle needs read-only access to your Google Calendar to calculate your free time and upcoming deadlines.
        </p>
        
        <div className="space-y-4">
          <Button onClick={handleLogin} disabled={loading} className="w-full">
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
