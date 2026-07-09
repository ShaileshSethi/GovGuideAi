---
name: React Micro-interactions
description: Patterns for implementing advanced UI/UX features like typewriter placeholders, framer-motion animations, and canvas-confetti in React/Next.js.
---

# React UI Micro-interactions

When tasked with improving UI/UX or adding "delightful" micro-interactions in React/Next.js applications, use the following patterns:

## 1. Typewriter Effect (No External Libraries)
Use `useEffect` with standard timeouts to manipulate local state.
- **Pattern:** Maintain an array of strings, track the character index and current string index.
- **Tip:** Pause longer when a full string is typed out before deleting.
- **Cleanup:** Always return `() => clearTimeout(timeoutId)` in the effect.

## 2. Dynamic Confetti (`canvas-confetti`)
When celebrating user actions (like finishing a checklist):
- **Import:** Always use a dynamic import `import('canvas-confetti').then((confetti) => ...)` inside the event handler.
- **Why:** `canvas-confetti` relies on the `window` object. Dynamic imports prevent Next.js Server-Side Rendering (SSR) errors during build time.

## 3. Simple State Animations (`framer-motion`)
For simple state indicators (like audio waves when listening):
- **Pattern:** Use `<motion.div>` and pass arrays to the `animate` prop (e.g., `animate={{ height: ['4px', '20px', '4px'] }}`).
- **Repeat:** Use `transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}` to create looping, staggered animations without complex CSS keyframes.
