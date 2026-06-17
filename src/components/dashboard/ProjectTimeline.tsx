import React from "react";
import { motion } from "framer-motion";
import { ClipboardList, Pencil, Code, Eye, CheckCircle } from "lucide-react";

interface ProjectTimelineProps {
  /**
   * Current project status. Expected values: "requirements", "design", "development", "review", "delivered"
   */
  status: string;
}

const steps: Array<{ key: string; label: string; Icon: React.ElementType }> = [
  { key: "requirements", label: "Requirements", Icon: ClipboardList },
  { key: "design", label: "Design", Icon: Pencil },
  { key: "development", label: "Development", Icon: Code },
  { key: "review", label: "Review", Icon: Eye },
  { key: "delivered", label: "Delivered", Icon: CheckCircle },
];

/**
 * Determine the visual state for each step based on the current status.
 */
const getStepState = (stepIdx: number, currentIdx: number) => {
  if (stepIdx < currentIdx) return "done";
  if (stepIdx === currentIdx) return "current";
  return "upcoming";
};

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ status }) => {
  const currentIdx = steps.findIndex((s) => s.key === status.toLowerCase());
  const isValidIdx = currentIdx >= 0;

  const containerVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const stepVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex items-center justify-between overflow-x-auto py-4"
    >
      {steps.map((step, i) => {
        const state = isValidIdx ? getStepState(i, currentIdx) : "upcoming";
        const { Icon } = step;
        const isDone = state === "done" || state === "current";
        const bgColor = isDone ? "#7C3AED" : "transparent"; // Purple for done/current
        const borderColor = isDone ? "#7C3AED" : "#6B7280"; // Gray for upcoming
        const ringColor = state === "current" ? "#0CCFCF" : "transparent"; // Teal ring for active
        const textColor = state === "upcoming" ? "var(--text-muted)" : "var(--text-primary)";

        return (
          <React.Fragment key={step.key}>
            <motion.div variants={stepVariants} className="flex flex-col items-center gap-2 min-w-[80px]">
              <div className="relative">
                {/* Glowing ring for current step */}
                {state === "current" && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ background: "rgba(12,207,207,0.3)", opacity: 0.4 }}
                  />
                )}
                <div
                  className="relative w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: bgColor,
                    border: `2px solid ${borderColor}`,
                    boxShadow: isDone ? "0 0 12px var(--glow-violet)" : "none",
                  }}
                >
                  <Icon size={16} className={state === "upcoming" ? "text-gray-400" : "text-white"} />
                </div>
                {/* Teal outline for current step */}
                {state === "current" && (
                  <div
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: ringColor, pointerEvents: "none" }}
                  />
                )}
              </div>
              <div className="text-xs font-medium" style={{ color: textColor }}>
                {step.label}
              </div>
            </motion.div>
            {/* Connector line except after last step */}
            {i < steps.length - 1 && (
              <div
                className="flex-1 h-px mx-2"
                style={{
                  background:
                    isDone && (i < currentIdx || (state === "current" && i === currentIdx - 1))
                      ? "#7C3AED"
                      : "var(--text-muted)",
                  boxShadow:
                    isDone && (i < currentIdx || (state === "current" && i === currentIdx - 1))
                      ? "0 0 8px var(--glow-violet)"
                      : "none",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </motion.div>
  );
};

export default ProjectTimeline;
