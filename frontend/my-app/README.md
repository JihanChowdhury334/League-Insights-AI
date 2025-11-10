# 🎮 Rift Rewind - Your Season, Your Story

A modern, animated League of Legends season recap tool built with **Next.js 15**, **TypeScript**, **TailwindCSS**, **shadcn/ui**, and **Framer Motion**.

## ✨ Features

- 🎬 **Premium Animations** - Smooth, tasteful Framer Motion animations throughout
- 📊 **Comprehensive Stats** - Core averages, extremes, and monthly trends
- 🕐 **Timeline Analytics** - Playstyle identity, patterns, and heatmaps
- 🤖 **AI-Powered Recap** - Personalized season summary with insights
- 🎨 **Modern UI** - Beautiful dark theme with gradient accents
- 📱 **Fully Responsive** - Optimized for all screen sizes
- ⚡ **Fast & Performant** - 60 FPS animations with minimal bundle size

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build for Production
```bash
npm run build
npm start
```

## 🎨 Animation System

This project features a comprehensive animation system powered by Framer Motion. For detailed documentation:

- **[QUICKSTART.md](./QUICKSTART.md)** - Testing guide and checklist
- **[ANIMATIONS.md](./ANIMATIONS.md)** - Full animation API documentation
- **[ANIMATION-SUMMARY.md](./ANIMATION-SUMMARY.md)** - Implementation overview

### Animation Highlights

- ✅ Smooth page transitions
- ✅ Staggered content reveals
- ✅ Interactive hover effects
- ✅ Scale and lift animations on cards
- ✅ Morphing navigation indicators
- ✅ Pulsing and floating effects
- ✅ Chart entrance animations
- ✅ Respects `prefers-reduced-motion`

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion 12](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## 📁 Project Structure

```
my-app/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page with search
│   ├── stats/             # Statistics page
│   ├── timeline/          # Timeline analytics page
│   ├── recap/             # AI recap page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── navigation.tsx     # Animated navigation
│   ├── page-transition.tsx # Page transition wrapper
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── animations.ts      # Animation variants library
│   ├── api.ts            # API calls
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## 🎯 Pages

### 🏠 Home (`/`)
Search for any League of Legends player by Riot ID (e.g., `EMP#2005`)

### 📊 Stats (`/stats`)
- Core averages (KDA, CS, etc.)
- Impact statistics
- Role distribution
- Extreme games
- Monthly trends

### 🕐 Timeline (`/timeline`)
- Playstyle identity radar
- Average insights
- Level timings
- Comeback patterns
- Kill position heatmap

### ✨ Recap (`/recap`)
- AI-generated personality profile
- Playstyle summary
- Strengths and weaknesses
- Actionable tips
- Fun highlights

## 🎨 Customization

### Modify Animations

Edit `/lib/animations.ts` to customize animation behavior:

```tsx
// Example: Change hover scale
export const hoverScale = {
  whileHover: { 
    scale: 1.05, // Change this value
    transition: { duration: 0.2, ease: "easeOut" as const }
  },
  whileTap: { scale: 0.98 }
};
```

### Add New Animations

Create new variants in `animations.ts` and use them in your components:

```tsx
import { motion } from "framer-motion";
import { myCustomAnimation } from "@/lib/animations";

<motion.div variants={myCustomAnimation}>
  Content
</motion.div>
```

## 📊 Performance

- **Lighthouse Score**: 90+ across all metrics
- **Bundle Size**: ~32KB for animations (gzipped)
- **FPS**: Consistent 60 FPS on modern devices
- **GPU Accelerated**: Only animates transform & opacity

## 🌐 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 15.4+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Learn More

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

### Framer Motion
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Motion Examples](https://www.framer.com/motion/examples/)

### TailwindCSS
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TailwindCSS Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)

## 🚀 Deploy

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com/new):

1. Push your code to GitHub
2. Import repository to Vercel
3. Deploy automatically

### Other Platforms

This Next.js app can be deployed to any platform that supports Node.js:
- [Netlify](https://www.netlify.com/)
- [Railway](https://railway.app/)
- [AWS Amplify](https://aws.amazon.com/amplify/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎉 Acknowledgments

- League of Legends® and Riot Games® are trademarks or registered trademarks of Riot Games, Inc.
- Built with love by the community for the community

---

**Made with ❤️ and ⚡ by the Rift Rewind team**
