import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Image,
  LayoutDashboard,
  LogIn,
  LogOut,
  Trophy,
  User,
  Wand2,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface NavItem {
  id: Page;
  icon: ReactNode;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { id: "profile", icon: <User size={18} />, label: "Profile" },
  { id: "achievements", icon: <Trophy size={18} />, label: "Achievements" },
  {
    id: "content-generator",
    icon: <Wand2 size={18} />,
    label: "Content Generator",
  },
  {
    id: "scholarships",
    icon: <GraduationCap size={18} />,
    label: "Scholarship",
  },
  { id: "media", icon: <Image size={18} />, label: "Media Library" },
];

interface LayoutProps {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Layout({
  children,
  currentPage,
  onNavigate,
}: LayoutProps) {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-3)}`
    : null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <nav
        className="flex flex-col py-0 border-r border-border flex-shrink-0"
        style={{
          width: 220,
          minWidth: 220,
          backgroundColor: "oklch(var(--sidebar))",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 py-4 border-b border-border"
          style={{ backgroundColor: "oklch(0.07 0.028 258)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "oklch(0.76 0.17 72)" }}
          >
            <Trophy size={16} style={{ color: "oklch(0.10 0.02 258)" }} />
          </div>
          <div className="min-w-0">
            <div
              className="text-xs font-black uppercase tracking-widest leading-none"
              style={{ color: "oklch(0.76 0.17 72)" }}
            >
              Athlete
            </div>
            <div
              className="text-xs font-black uppercase tracking-widest leading-none mt-0.5"
              style={{ color: "oklch(0.94 0.010 240)" }}
            >
              Promo Manager
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 flex flex-col gap-0.5 px-2 py-3">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-ocid={`nav.${item.id}.link`}
                onClick={() => onNavigate(item.id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all w-full"
                style={{
                  backgroundColor: isActive
                    ? "oklch(0.76 0.17 72 / 0.18)"
                    : "transparent",
                  color: isActive
                    ? "oklch(0.76 0.17 72)"
                    : "oklch(0.65 0.020 248)",
                  borderLeft: isActive
                    ? "2px solid oklch(0.76 0.17 72)"
                    : "2px solid transparent",
                }}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="text-sm font-semibold tracking-wide">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Auth footer */}
        <div className="px-3 py-3 border-t border-border space-y-2">
          {isAuthenticated ? (
            <>
              <div
                className="px-3 py-2 rounded-lg text-xs truncate"
                style={{
                  backgroundColor: "oklch(0.18 0.040 254)",
                  color: "oklch(0.65 0.020 248)",
                }}
              >
                {shortPrincipal}
              </div>
              <button
                type="button"
                data-ocid="nav.logout.button"
                onClick={() => clear()}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-80"
                style={{
                  color: "oklch(0.65 0.22 25)",
                  backgroundColor: "oklch(0.65 0.22 25 / 0.1)",
                }}
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Button
              data-ocid="nav.login.button"
              className="w-full font-bold text-sm"
              style={{
                backgroundColor: "oklch(0.76 0.17 72)",
                color: "oklch(0.10 0.02 258)",
              }}
              onClick={() => login()}
              disabled={isLoggingIn}
            >
              <LogIn size={15} className="mr-2" />
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          )}
          <p
            className="text-center text-xs px-1"
            style={{ color: "oklch(0.40 0.018 248)" }}
          >
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "oklch(0.76 0.17 72)" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </nav>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
