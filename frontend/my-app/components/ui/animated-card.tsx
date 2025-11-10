"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { cardEntrance, hoverScale } from "@/lib/animations";

type AnimatedCardProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children?: React.ReactNode;
  hover?: boolean;
};

export function AnimatedCard({ 
  className, 
  hover = true,
  children,
  ...props 
}: AnimatedCardProps) {
  return (
    <motion.div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      variants={cardEntrance}
      initial="initial"
      animate="animate"
      whileHover={hover ? hoverScale.whileHover : undefined}
      whileTap={hover ? hoverScale.whileTap : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}
