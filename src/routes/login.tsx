import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import { Background3D } from "@/components/dashboard/Background3D";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

function LoginComponent() {
  const { user, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    document.title = "Login — Webzingo Client Portal";
    if (user && !loading) {
      navigate({ to: "/" });
    }
  }, [user, loading, navigate]);

  const handleSignIn = async () => {
    setErrorMsg(null);
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      navigate({ to: "/" });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred during authentication.");
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative" style={{ background: "var(--bg-void)" }}>
        <Background3D />
        <div className="noise-overlay" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--accent-violet) var(--accent-violet) transparent transparent" }} />
          <span className="font-syne text-sm font-medium" style={{ color: "var(--text-primary)" }}>Loading portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 overflow-hidden" style={{ background: "var(--bg-void)" }}>
      <Background3D />
      <div className="noise-overlay" />

      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full filter blur-[120px] pointer-events-none opacity-20" style={{ background: "var(--accent-violet)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full filter blur-[120px] pointer-events-none opacity-10" style={{ background: "var(--accent-blue)" }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="glass rounded-3xl p-8 md:p-10 shadow-2xl conic-border">
          {/* Logo Section */}
          <div className="flex flex-col items-center text-center mb-8">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-syne font-bold text-2xl text-white mb-4" 
              style={{ 
                background: "linear-gradient(135deg, #7c3aed, #3b5bdb)", 
                boxShadow: "0 0 30px var(--glow-violet)" 
              }}
            >
              W
            </motion.div>
            <h1 className="font-syne font-bold text-2xl md:text-3xl tracking-tight text-white mb-2">
              Webzi<span style={{ color: "var(--accent-violet)" }}>n</span>go
            </h1>
            <p className="font-dm text-sm text-[var(--text-muted)] max-w-[280px]">
              Access your project status, updates, and digital assets.
            </p>
          </div>

          <div className="mx-auto w-full h-px mb-8" style={{ background: "linear-gradient(90deg, transparent, var(--border-bright), transparent)" }} />

          {/* Action Area */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2.5 p-3 rounded-lg border text-xs"
                  style={{ 
                    background: "rgba(244, 63, 94, 0.08)", 
                    borderColor: "rgba(244, 63, 94, 0.2)",
                    color: "var(--accent-rose)"
                  }}
                >
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold font-syne">Authentication failed</div>
                    <div className="opacity-90 mt-0.5">{errorMsg}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="w-full relative px-6 py-3.5 rounded-xl font-syne font-semibold text-sm text-white flex items-center justify-center gap-3 transition-all cursor-pointer group hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
              style={{ 
                background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                border: "1px solid var(--border-glass)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
              }}
            >
              {/* Custom Google Icon SVG */}
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>{isSigningIn ? "Signing in..." : "Continue with Google"}</span>
            </button>
          </div>

          <div className="mt-8 text-center text-[10px]" style={{ color: "var(--text-muted)" }}>
            Authorized client dashboard access only.<br />
            Powered by Webzingo Engine.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
