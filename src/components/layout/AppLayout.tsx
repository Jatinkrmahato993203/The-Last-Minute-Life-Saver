import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { Radar, SlidersHorizontal, Settings } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAppStore } from "../../store";

const NAV_ITEMS = [
  { label: "Radar", icon: Radar, to: "/app" },
  { label: "Overview", icon: SlidersHorizontal, to: "/app/loss-overview" },
  { label: "Settings", icon: Settings, to: "/app/settings" },
];

export function AppLayout() {
  const location = useLocation();
  const accessToken = useAppStore((state) => state.accessToken);

  if (!accessToken) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-paper">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-paper border-r border-rule p-6 min-h-screen sticky top-0">
        <Link to="/" className="font-display font-bold text-2xl tracking-tight text-ink mb-12">
          Oracle
        </Link>
        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.to || 
                             (item.to !== "/app" && location.pathname.startsWith(item.to)) ||
                             (item.to === "/app" && location.pathname.startsWith("/app/commitment"));
            return (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md font-sans text-sm font-medium transition-colors",
                  isActive
                    ? "bg-ink/10 text-amber border-l-4 border-amber rounded-none pl-3"
                    : "text-ink/70 hover:text-ink hover:bg-ink/5"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 md:p-12">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-paper border-t border-rule pb-[env(safe-area-inset-bottom)] z-50">
        <div className="flex justify-around items-center h-16">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.to || 
                             (item.to !== "/app" && location.pathname.startsWith(item.to)) ||
                             (item.to === "/app" && location.pathname.startsWith("/app/commitment"));
            return (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1",
                  isActive ? "text-amber" : "text-ink/70 hover:text-ink"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-sans font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
