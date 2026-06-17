import React from "react";
import { motion } from "framer-motion";

export const Background3D: React.FC = () => {
  const orbs = [
    {
      size: 300,
      bg: "radial-gradient(circle at 30% 30%, rgba(128,0,255,0.4), rgba(0,255,255,0.2))",
      left: "20%",
      top: "30%",
    },
    {
      size: 250,
      bg: "radial-gradient(circle at 70% 70%, rgba(0,255,255,0.4), rgba(128,0,255,0.2))",
      left: "70%",
      top: "60%",
    },
  ];

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: orb.bg,
            filter: "blur(80px)",
            left: orb.left,
            top: orb.top,
          }}
          animate={{
            x: [0, 10, -10, 0],
            y: [0, -15, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};