import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";

export function Login() {
  return (
    <div className="flex-1 flex items-center justify-center py-20 px-6">
      <div className="max-w-md w-full bg-white border border-rule rounded-none p-8 shadow-sm text-center">
        <h1 className="text-3xl mb-8">Welcome back</h1>
        
        <div className="space-y-4">
          <Button asChild className="w-full h-12">
            <Link to="/app">Log in with Google</Link>
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
