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
      navigate("/app");
    } catch (error) {
      console.error(error);
      alert("Failed to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-6">
      <div className="max-w-md w-full bg-white border border-rule rounded-none p-8 shadow-sm text-center">
        <h1 className="text-3xl mb-8">Welcome back</h1>
        
        <div className="space-y-4">
          <Button onClick={handleLogin} disabled={loading} className="w-full h-12">
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
