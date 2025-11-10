# Rift Rewind - Animation System Documentation

## Overview
This project uses **Framer Motion** to create a premium, fluid, and responsive user experience with tasteful animations across all pages and components.

## Animation Library
All reusable animation variants are located in `/lib/animations.ts`

### Core Animations

#### Fade Animations
- `fadeIn` - Simple fade in
- `fadeInUp` - Fade in from bottom
- `fadeInDown` - Fade in from top
- `fadeInLeft` - Fade in from left
- `fadeInRight` - Fade in from right

#### Scale Animations
- `scaleFadeIn` - Scale and fade in (perfect for cards/modals)
- `hoverScale` - Hover scale effect (1.03x)
- `hoverScaleSubtle` - Subtle hover scale (1.01x)
- `hoverLift` - Lift up on hover (-4px)

#### Stagger Animations
- `staggerContainer` - Container for staggered children (0.1s delay)
- `staggerContainerFast` - Fast stagger (0.05s delay)
- `staggerItem` - Item to be used with stagger containers

#### Button Animations
- `buttonHover` - Scale on hover (1.05x) and tap (0.95x)

#### Special Effects
- `pulse` - Pulsing animation (loading states)
- `bounce` - Bounce animation (attention grabbing)
- `rotate` - 360° rotation
- `float` - Floating animation (decorative elements)
- `glow` - Glowing effect
- `shimmer` - Shimmer loading effect

#### Page Transitions
- `pageTransition` - Smooth page transition config
- `slideInFromBottom` - Modal/dialog entrance

#### Chart & Data
- `chartAnimation` - Chart entrance animation
- `cardEntrance` - Card entrance with scale
- `scrollReveal` - Scroll-triggered reveal

## Implementation by Page

### 🏠 Home Page (`/app/page.tsx`)
**Animations:**
- Hero title: Staggered fade-in from top and bottom
- Search card: Slide up with delay
- Feature cards: Staggered entrance with hover scale
- Icons: Wiggle on hover
- Button: Scale on hover/tap

**User Experience:**
- Smooth entrance that draws attention to the search
- Interactive cards that respond to user interaction
- Professional yet playful feel

### 📊 Stats Page (`/app/stats/page.tsx`)
**Animations:**
- Header: Staggered fade-in
- Core stat cards: Fast stagger with hover lift
- Stat values: Scale-in with delay
- Icons: Rotate on hover
- Extreme game cards: Hover scale with shadow
- Charts: Fade and scale entrance

**User Experience:**
- Data feels alive and responsive
- Encourages exploration through hover effects
- Emphasizes important statistics

### 🕐 Timeline Page (`/app/timeline/page.tsx`)
**Animations:**
- Header: Staggered fade-in
- Radar chart: Scale-in animation
- Badges: Staggered grid entrance
- Pattern cards: Hover scale and lift
- Canvas: Smooth fade-in

**User Experience:**
- Complex data made approachable
- Interactive elements encourage exploration
- Smooth transitions between states

### ✨ Recap Page (`/app/recap/page.tsx`)
**Animations:**
- Title: Gradient fade-in
- Generate button: Pulse animation when idle
- Recap card: Scale reveal animation
- Content sections: Staggered entrance
- Action buttons: Hover scale
- Empty state: Floating Sparkles icon

**User Experience:**
- Anticipation building before generation
- Satisfying reveal animation
- Premium wrapped-style feel

### 🧭 Navigation (`/components/navigation.tsx`)
**Animations:**
- Nav bar: Slide down from top
- Logo: Rotate on hover
- Nav items: Staggered entrance
- Active indicator: Smooth morphing underline
- Icons: Bounce on active state
- Background: Animated hover states

**User Experience:**
- Sticky navigation with smooth appearance
- Clear active state indication
- Responsive hover feedback

## Component-Level Animations

### Cards
- Entrance: Scale and fade-in
- Hover: Subtle scale (1.03x) and lift
- Tap: Scale down slightly (0.98x)

### Buttons
- Hover: Scale up (1.05x)
- Tap: Scale down (0.95x)
- Loading: Spinner rotation + button pulse

### Badges
- Entrance: Fade and scale
- Hover: Slight lift

### Charts (Recharts)
- Entrance: Fade and scale with delay
- Interactive: Smooth transitions between data

## Animation Principles

### 1. **Tasteful & Subtle**
- Animations are noticeable but not distracting
- Duration: 200-600ms for most interactions
- Easing: Custom cubic-bezier [0.6, 0.05, 0.01, 0.9]

### 2. **Consistent**
- Same animation types used across similar components
- Unified timing and easing functions
- Predictable user experience

### 3. **Performant**
- Uses CSS transforms (GPU accelerated)
- AnimatePresence for exit animations
- Minimal re-renders with React

### 4. **Purposeful**
- Each animation serves a purpose (feedback, hierarchy, delight)
- Guides user attention to important elements
- Reinforces interaction patterns

## Accessibility

All animations respect user preferences:
```tsx
// Framer Motion automatically respects prefers-reduced-motion
// No additional configuration needed
```

## Performance Tips

1. **Use `will-change` sparingly**
   - Only apply to actively animating elements
   - Remove after animation completes

2. **Animate transform and opacity**
   - Avoid animating width, height, top, left
   - Use scale instead of size changes

3. **Use `layoutId` for shared element transitions**
   - Creates smooth morphing effects between states

4. **Stagger delays**
   - Keep below 0.1s to avoid feeling sluggish
   - Use faster delays (0.05s) for grids

## Future Enhancements

- [ ] Page transition animations with AnimatePresence
- [ ] Parallax scrolling effects on home page
- [ ] More sophisticated chart animations
- [ ] Confetti effect on recap generation
- [ ] Micro-interactions on form inputs
- [ ] Loading skeleton animations
- [ ] Toast notification animations
- [ ] Gesture-based interactions (swipe, drag)

## Browser Support

Framer Motion (v12) supports:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 15.4+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Code Examples

### Basic Fade In
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Staggered List
```tsx
<motion.ul variants={staggerContainer} initial="initial" animate="animate">
  {items.map(item => (
    <motion.li key={item.id} variants={staggerItem}>
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

### Hover Effect
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Animation Easing Reference](https://easings.net/)
- [Performance Tips](https://web.dev/animations/)
