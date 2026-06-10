import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Paperclip, Send } from "lucide-react";

type Msg = { from: "agency" | "client"; text: string; time: string };

const initial: Msg[] = [
  { from: "agency", text: "Hey! We've started working on your homepage design 🎨 You'll get a preview link by tomorrow evening.", time: "10:24 AM" },
  { from: "client", text: "Awesome! Can we also add a testimonials section?", time: "10:31 AM" },
  { from: "agency", text: "Absolutely, that's a great idea. We'll include it in the next revision. No extra charge since you still have 1 revision remaining.", time: "10:33 AM" },
  { from: "client", text: "Perfect, thank you!", time: "10:34 AM" },
  { from: "agency", text: "Working on it now — stay tuned! 🚀", time: "10:36 AM" },
];

export function Messages() {
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const send = () => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: "client", text: text.trim(), time: "Now" }]);
    setText("");
  };

  return (
    <div className="glass rounded-2xl flex flex-col h-[calc(100vh-160px)] min-h-[500px] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border-glass)" }}>
        <div className="flex items-center gap-3">
          <h3 className="font-syne font-semibold text-lg" style={{ color: "var(--text-primary)" }}>Messages</h3>
          <div className="flex items-center gap-1.5 text-xs font-dm" style={{ color: "#34d399" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "#34d399", boxShadow: "0 0 8px #34d399" }} />
            Online
          </div>
        </div>
        <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Typically replies in 2 hrs</div>
      </div>

      {/* Chat */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-6 py-5 space-y-4" style={{ background: "rgba(4, 4, 12, 0.4)" }}>
        <AnimatePresence initial={true}>
          {msgs.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 5) * 0.08, duration: 0.35 }}
              className={`flex items-end gap-2 ${m.from === "client" ? "justify-end" : "justify-start"}`}
            >
              {m.from === "agency" && (
                <div className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center font-syne font-bold text-xs text-white" style={{ background: "linear-gradient(135deg, #7c3aed, #3b5bdb)" }}>
                  W
                </div>
              )}
              <div className={`max-w-[75%] ${m.from === "client" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div
                  className="px-4 py-2.5 font-dm text-sm leading-relaxed"
                  style={
                    m.from === "agency"
                      ? { background: "rgba(124, 58, 237, 0.12)", border: "1px solid var(--border-glass)", color: "var(--text-primary)", borderRadius: "14px 14px 14px 4px" }
                      : { background: "rgba(59, 91, 219, 0.2)", border: "1px solid rgba(124,58,237,0.3)", color: "white", borderRadius: "14px 14px 4px 14px" }
                  }
                >
                  {m.text}
                </div>
                <span className="text-[10px] px-1" style={{ color: "var(--text-muted)" }}>{m.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-4 border-t" style={{ borderColor: "var(--border-glass)" }}>
        <div className="glass rounded-full px-3 py-2 flex items-center gap-2" style={{ backdropFilter: "blur(20px)" }}>
          <button className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:text-violet-300" style={{ color: "var(--text-muted)" }}>
            <Paperclip size={17} />
          </button>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type your message..."
            className="flex-1 bg-transparent outline-none font-dm text-sm py-2"
            style={{ color: "var(--text-primary)" }}
          />
          <motion.button
            onClick={send}
            whileHover={{ scale: text.trim() ? 1.05 : 1 }}
            whileTap={{ scale: 0.95 }}
            disabled={!text.trim()}
            className="px-4 h-10 rounded-full flex items-center gap-2 font-syne font-semibold text-sm transition-all"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              color: "white",
              opacity: text.trim() ? 1 : 0.4,
              boxShadow: text.trim() ? "0 0 24px var(--glow-violet)" : "none",
              cursor: text.trim() ? "pointer" : "not-allowed",
            }}
          >
            <Send size={15} />
            <span className="hidden sm:inline">Send</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}