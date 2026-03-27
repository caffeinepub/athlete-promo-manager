import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Calendar,
  GraduationCap,
  Image,
  LayoutDashboard,
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
  { id: "dashboard", icon: <LayoutDashboard size={22} />, label: "Dashboard" },
  { id: "profile", icon: <User size={22} />, label: "Profile" },
  { id: "achievements", icon: <Trophy size={22} />, label: "Achievements" },
  {
    id: "content-generator",
    icon: <Wand2 size={22} />,
    label: "Content Generator",
  },
  {
    id: "content-calendar",
    icon: <Calendar size={22} />,
    label: "Content Calendar",
  },
  {
    id: "scholarships",
    icon: <GraduationCap size={22} />,
    label: "Scholarship Tracker",
  },
  { id: "media", icon: <Image size={22} />, label: "Media Library" },
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
  const { clear } = useInternetIdentity();

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-screen bg-background">
        <nav
          className="flex flex-col items-center py-4 gap-2 border-r border-border"
          style={{
            width: 64,
            minWidth: 64,
            backgroundColor: "oklch(0.12 0.02 252)",
          }}
        >
          <div className="mb-4 flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
            <Trophy size={18} className="text-primary-foreground" />
          </div>

          <div className="flex-1 flex flex-col gap-1 w-full px-2">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      data-ocid={`nav.${item.id}.link`}
                      onClick={() => onNavigate(item.id)}
                      className={`flex items-center justify-center w-full h-10 rounded-lg transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-glow"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      {item.icon}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                data-ocid="nav.logout.button"
                onClick={() => clear()}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-all"
              >
                <LogOut size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        </nav>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </TooltipProvider>
  );
}
