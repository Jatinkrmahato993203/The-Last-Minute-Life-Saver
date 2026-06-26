import { Link, Outlet } from "react-router-dom";
import { Button } from "../ui/Button";

export function MarketingLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-[#0F0F0F]/90 backdrop-blur border-b border-rule h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="font-display font-bold text-2xl tracking-tight text-ink">
            Oracle
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/how-it-works" className="font-sans font-bold text-[10px] uppercase tracking-widest text-ink hover:text-amber transition-colors">
              How It Works
            </Link>
            <Link to="/pricing" className="font-sans font-bold text-[10px] uppercase tracking-widest text-ink hover:text-amber transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/auth/login" className="hidden md:block font-sans font-bold text-[10px] uppercase tracking-widest text-ink hover:text-amber transition-colors">
              Log in
            </Link>
            <Button asChild>
              <Link to="/auth/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-rule py-12 bg-[#FFB800] text-black mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="font-display font-bold text-lg mb-4 text-black">Oracle</div>
            <p className="text-black/70 text-sm font-sans font-bold uppercase tracking-widest">See what you're about to miss — and what it'll cost you.</p>
          </div>
          <div>
            <div className="font-sans font-bold text-black mb-4 uppercase tracking-widest text-xs">Product</div>
            <ul className="space-y-2 text-sm text-black/70 font-bold uppercase tracking-widest text-[10px]">
              <li><Link to="/how-it-works" className="hover:text-black">How It Works</Link></li>
              <li><Link to="/pricing" className="hover:text-black">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-sans font-bold text-black mb-4 uppercase tracking-widest text-xs">Trust</div>
            <ul className="space-y-2 text-sm text-black/70 font-bold uppercase tracking-widest text-[10px]">
              <li><Link to="/about" className="hover:text-black">About / Trust</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-sans font-bold text-black mb-4 uppercase tracking-widest text-xs">Legal</div>
            <ul className="space-y-2 text-sm text-black/70 font-bold uppercase tracking-widest text-[10px]">
              <li><Link to="/privacy" className="hover:text-black">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-black">Terms</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
