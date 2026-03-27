import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Login() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 60% 20%, oklch(0.50 0.22 265 / 0.15) 0%, transparent 60%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-4"
      >
        <div
          className="rounded-2xl border border-border p-8 shadow-card"
          style={{ backgroundColor: "oklch(0.14 0.025 240)" }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-glow">
              <Trophy size={32} className="text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-foreground mb-2">
            Athlete Promo Manager
          </h1>
          <p className="text-center text-muted-foreground mb-8 text-sm leading-relaxed">
            AI-powered social media management to showcase your athletic talent
            and unlock college scholarship opportunities.
          </p>

          <Button
            data-ocid="login.primary_button"
            className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => login()}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Connecting..." : "Sign In to Get Started"}
          </Button>

          <p className="text-center text-muted-foreground text-xs mt-4">
            Secure login via Internet Identity
          </p>
        </div>

        <p className="text-center text-muted-foreground text-xs mt-6">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
