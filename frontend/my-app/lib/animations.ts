/**
 * Reusable Framer Motion animation variants and utilities
 * For tasteful, smooth, and consistent animations across the app
 */

import { Variants } from "framer-motion";

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: [0.6, 0.05, 0.01, 0.9] }
};

// Fade in from bottom
export const fadeInUp: Variants = {
  initial: { 
    opacity: 0, 
    y: 30 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.05, 0.01, 0.9]
    }
  }
};

// Fade in from top
export const fadeInDown: Variants = {
  initial: { 
    opacity: 0, 
    y: -30 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.6, 0.05, 0.01, 0.9]
    }
  }
};

// Fade in from left
export const fadeInLeft: Variants = {
  initial: { 
    opacity: 0, 
    x: -30 
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.6, 0.05, 0.01, 0.9]
    }
  }
};

// Fade in from right
export const fadeInRight: Variants = {
  initial: { 
    opacity: 0, 
    x: 30 
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.6, 0.05, 0.01, 0.9]
    }
  }
};

// Simple fade in
export const fadeIn: Variants = {
  initial: { 
    opacity: 0 
  },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Scale fade in (for cards and modals)
export const scaleFadeIn: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.9 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.6, 0.05, 0.01, 0.9]
    }
  }
};

// Staggered children container
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Fast stagger for grids
export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

// Stagger item (to be used with staggerContainer)
export const staggerItem: Variants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.6, 0.05, 0.01, 0.9]
    }
  }
};

// Hover scale effect (for cards and interactive elements)
export const hoverScale = {
  whileHover: { 
    scale: 1.03,
    transition: { duration: 0.2, ease: "easeOut" as const }
  },
  whileTap: { scale: 0.98 }
};

// Subtle hover scale
export const hoverScaleSubtle = {
  whileHover: { 
    scale: 1.01,
    transition: { duration: 0.2, ease: "easeOut" as const }
  },
  whileTap: { scale: 0.99 }
};

// Hover lift effect
export const hoverLift = {
  whileHover: { 
    y: -4,
    transition: { duration: 0.2, ease: "easeOut" as const }
  }
};

// Button hover effects
export const buttonHover = {
  whileHover: { 
    scale: 1.05,
    transition: { duration: 0.2, ease: "easeOut" as const }
  },
  whileTap: { scale: 0.95 }
};

// Pulse animation for loading states
export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

// Bounce animation for attention
export const bounce = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 2,
      ease: "easeInOut" as const
    }
  }
};

// Rotate animation
export const rotate = {
  animate: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear" as const
    }
  }
};

// Shimmer effect for loading
export const shimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear" as const
    }
  }
};

// Slide in from bottom (for modals/dialogs)
export const slideInFromBottom: Variants = {
  initial: { 
    opacity: 0, 
    y: "100%" 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.6, 0.05, 0.01, 0.9]
    }
  },
  exit: {
    opacity: 0,
    y: "100%",
    transition: {
      duration: 0.3,
      ease: "easeIn" as const
    }
  }
};

// Float animation for decorative elements
export const float = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

// Glow effect
export const glow = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(245, 158, 11, 0.5)",
      "0 0 40px rgba(245, 158, 11, 0.8)",
      "0 0 20px rgba(245, 158, 11, 0.5)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Typing effect for text
export const typingContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.03
    }
  }
};

export const typingLetter: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.1 }
  }
};

// Progress bar fill animation
export const progressFill: Variants = {
  initial: { width: 0 },
  animate: { 
    width: "100%",
    transition: {
      duration: 1,
      ease: "easeOut"
    }
  }
};

// Counter animation utility
export const counterAnimation = (target: number, duration: number = 1) => ({
  initial: { value: 0 },
  animate: { 
    value: target,
    transition: {
      duration,
      ease: "easeOut"
    }
  }
});

// Scroll reveal animation (use with viewport prop)
export const scrollReveal: Variants = {
  initial: { 
    opacity: 0, 
    y: 50 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.05, 0.01, 0.9]
    }
  }
};

// Nav item animation
export const navItem: Variants = {
  initial: { 
    opacity: 0,
    y: -10
  },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Card entrance animation
export const cardEntrance: Variants = {
  initial: { 
    opacity: 0,
    y: 30,
    scale: 0.95
  },
  animate: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.6, 0.05, 0.01, 0.9]
    }
  }
};

// Chart animation
export const chartAnimation: Variants = {
  initial: { 
    opacity: 0,
    scale: 0.8
  },
  animate: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.6, 0.05, 0.01, 0.9]
    }
  }
};
