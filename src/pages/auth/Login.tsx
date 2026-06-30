import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirebaseAuth, getGoogleProvider } from "../../lib/firebase";
import { useAppStore } from "../../store";

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setAccessToken } = useAppStore();

  const [consent, setConsent] = useState(false);

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
      
      const { getAdditionalUserInfo } = await import('firebase/auth');
      const additionalUserInfo = getAdditionalUserInfo(result);
      
      if (additionalUserInfo?.isNewUser) {
        navigate("/onboarding/baseline");
      } else {
        navigate("/app");
      }
    } catch (error: any) {
      console.error(error);
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        alert("Failed to log in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-6">
      <div className="max-w-md w-full bg-white border border-rule rounded-none p-8 shadow-sm text-center">
        <h1 className="text-3xl mb-8">Welcome back</h1>
        
        <div className="mb-8 text-left bg-ink/5 p-4 border border-rule">
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 accent-amber"
            />
            <span className="text-xs text-ink/70 font-sans leading-relaxed">
              I consent to the processing of my calendar data for the purpose of risk calculation and autonomous event scheduling, in accordance with the Digital Personal Data Protection Act (DPDP).
            </span>
          </label>
        </div>

        <div className="space-y-4">
          <Button onClick={handleLogin} disabled={loading || !consent} className="w-full h-12">
            {loading ? "Logging in..." : "Log in with Google"}
          </Button>
          
          <div className="pt-4 text-sm text-ink/60">
            Don't have an account?{" "}
            <Link to="/auth/signup" className="text-amber hover:underline underline-offset-4">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
