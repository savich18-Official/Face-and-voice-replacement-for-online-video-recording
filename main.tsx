@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&family=JetBrains+Mono:wght@400;700&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

@layer base {
  body {
    @apply bg-slate-950 text-slate-100 antialiased overflow-hidden;
  }
}

@layer components {
  .hud-panel {
    @apply bg-slate-900/40 backdrop-blur-md border border-slate-700/30 rounded-xl shadow-2xl;
  }

  .tactical-border {
    @apply relative;
  }

  /* Added corners for tactical feel */
  .tactical-corners::before {
    content: '';
    @apply absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-green-500 z-30 pointer-events-none;
  }

  .tactical-corners::after {
    content: '';
    @apply absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-green-500 z-30 pointer-events-none;
  }
}

.scanline {
  width: 100%;
  height: 100px;
  z-index: 40;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(34, 197, 94, 0.03) 50%, rgba(0, 0, 0, 0) 100%);
  position: absolute;
  top: -100px;
  pointer-events: none;
  animation: scanline 6s linear infinite;
}

@keyframes scanline {
  0% { transform: translateY(0vh); }
  100% { transform: translateY(110vh); }
}

.noise {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  opacity: 0.05;
  pointer-events: none;
  background-image: url('https://www.transparenttextures.com/patterns/carbon-fibre.png');
}
