import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Layout from "./components/Layout";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import Achievements from "./pages/Achievements";
import ContentCalendar from "./pages/ContentCalendar";
import ContentGenerator from "./pages/ContentGenerator";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MediaLibrary from "./pages/MediaLibrary";
import Profile from "./pages/Profile";
import ScholarshipTracker from "./pages/ScholarshipTracker";

export type Page =
  | "dashboard"
  | "profile"
  | "achievements"
  | "content-generator"
  | "content-calendar"
  | "scholarships"
  | "media";

const queryClient = new QueryClient();

function AppInner() {
  const { identity, isInitializing } = useInternetIdentity();
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 border-2 border-primary rounded-full border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!identity) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={setCurrentPage} />;
      case "profile":
        return <Profile />;
      case "achievements":
        return <Achievements />;
      case "content-generator":
        return <ContentGenerator />;
      case "content-calendar":
        return <ContentCalendar />;
      case "scholarships":
        return <ScholarshipTracker />;
      case "media":
        return <MediaLibrary />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
      <Toaster />
    </QueryClientProvider>
  );
}
