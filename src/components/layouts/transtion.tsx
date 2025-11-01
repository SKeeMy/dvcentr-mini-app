"use client";

import { motion } from "framer-motion";

export default function Transition({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="transition-layout"
      initial={{ y: 20, opacity: 0, filter: "blur(10px)"}}
      animate={{ y: 0, opacity: 1, filter: "blur(0)"}}
      transition={{ ease: "easeInOut", duration: 0.75 }}
    >
      {children}
    </motion.div>
  );
}