import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Background3D } from "@/components/dashboard/Background3D";
import { Sidebar, MobileTabBar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Overview } from "@/components/dashboard/Overview";
import { Messages } from "@/components/dashboard/Messages";
import { Documents } from "@/components/dashboard/Documents";
import { SettingsView } from "@/components/dashboard/SettingsView";
import type { Section } from "@/components/dashboard/types";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [active, setActive] = useState<Section>("overview");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Webzingo — Client Portal";
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative" style={{ background: "var(--bg-void)" }}>
        <Background3D />
        <div className="noise-overlay" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--accent-violet) var(--accent-violet) transparent transparent" }} />
          <span className="font-syne text-sm font-medium" style={{ color: "var(--text-primary)" }}>Verifying session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen relative" style={{ background: "var(--bg-void)" }}>
      <Background3D />
      <div className="noise-overlay" />
      <Sidebar active={active} onChange={setActive} />
      <MobileTabBar active={active} onChange={setActive} />

      <div className="relative z-10 md:pl-[220px] pb-20 md:pb-0">
        <Header active={active} />
        <main className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {active === "overview" && <Overview />}
              {active === "project" && <Overview />}
              {active === "messages" && <Messages />}
              {active === "documents" && <Documents />}
              {active === "settings" && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
