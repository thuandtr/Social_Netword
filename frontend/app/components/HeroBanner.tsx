'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

/* ── Slide data ─────────────────────────────────────────── */
const slides = [
  {
    title: 'Connect With Friends',
    subtitle:
      'Share moments, build relationships, and stay connected with the people who matter most.',
    cta: { text: 'Get Started', href: '/signup' },
    secondaryCta: { text: 'Log In', href: '/login' },
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
        <circle cx="22" cy="24" r="8" stroke="currentColor" strokeWidth="2" />
        <circle cx="42" cy="24" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="M8 52c0-8 6-14 14-14h4M38 38h4c8 0 14 6 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M26 44c0-5 3-8 6-8s6 3 6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Share Your Story',
    subtitle:
      'Express yourself through posts, articles, and updates. Your voice matters here.',
    cta: { text: 'Start Sharing', href: '/signup' },
    secondaryCta: { text: 'Browse Feed', href: '/newfeed' },
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
        <rect x="12" y="8" width="40" height="48" rx="4" stroke="currentColor" strokeWidth="2" />
        <path d="M20 20h24M20 28h24M20 36h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="46" cy="46" r="10" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
        <path d="M43 46l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Discover Trending Content',
    subtitle:
      'Explore the latest news, articles, and conversations happening in your world.',
    cta: { text: 'Explore Now', href: '/newfeed' },
    secondaryCta: { text: 'Read Articles', href: '/#articles' },
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
        <circle cx="28" cy="28" r="16" stroke="currentColor" strokeWidth="2" />
        <path d="M40 40l14 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M22 28h12M28 22v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
]

const AUTO_SLIDE_DELAY = 7000

/* ── Animated grid background ──────────────────────────── */
function TechGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Dot-grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.07]">
        <defs>
          <pattern id="hero-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      {/* Horizontal scan-line */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-[scanY_6s_ease-in-out_infinite]" />

      {/* Floating hexagon rings */}
      <svg className="absolute -top-10 -right-10 w-72 h-72 text-white/[0.04] animate-[spinSlow_40s_linear_infinite]" viewBox="0 0 200 200">
        <polygon points="100,10 178,55 178,145 100,190 22,145 22,55" fill="none" stroke="currentColor" strokeWidth="1" />
        <polygon points="100,30 160,62 160,138 100,170 40,138 40,62" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      <svg className="absolute -bottom-16 -left-16 w-80 h-80 text-white/[0.03] animate-[spinSlow_50s_linear_infinite_reverse]" viewBox="0 0 200 200">
        <polygon points="100,10 178,55 178,145 100,190 22,145 22,55" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-cyan-500/10 blur-[80px] animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-blue-400/10 blur-[100px] animate-[pulse_10s_ease-in-out_infinite_2s]" />

      {/* Circuit-style lines */}
      <svg className="absolute bottom-0 left-0 w-full h-32 opacity-[0.06]" preserveAspectRatio="none" viewBox="0 0 1200 120">
        <path d="M0 80 L200 80 L220 40 L400 40 L420 80 L600 80 L620 20 L800 20 L820 80 L1000 80 L1020 50 L1200 50" fill="none" stroke="white" strokeWidth="1" />
        <path d="M0 100 L300 100 L320 60 L500 60 L520 100 L700 100 L720 40 L900 40 L920 100 L1200 100" fill="none" stroke="white" strokeWidth="0.5" />
      </svg>
    </div>
  )
}

/* ── Main Component ────────────────────────────────────── */
export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [progress, setProgress] = useState(0)
  const startTimeRef = useRef<number>(Date.now())
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isPausedRef = useRef(false)

  const clearAll = useCallback(() => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
  }, [])

  const startAutoSlide = useCallback(() => {
    clearAll()
    startTimeRef.current = Date.now()
    setProgress(0)

    progressRef.current = setInterval(() => {
      if (isPausedRef.current) return
      const elapsed = Date.now() - startTimeRef.current
      setProgress(Math.min((elapsed / AUTO_SLIDE_DELAY) * 100, 100))
    }, 50)

    autoSlideRef.current = setInterval(() => {
      if (isPausedRef.current) return
      setCurrentIndex((prev) => (prev + 1) % slides.length)
      startTimeRef.current = Date.now()
    }, AUTO_SLIDE_DELAY)
  }, [clearAll])

  useEffect(() => {
    startAutoSlide()
    return clearAll
  }, [startAutoSlide, clearAll])

  const goTo = useCallback(
    (idx: number) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setCurrentIndex(idx)
      startAutoSlide()
      setTimeout(() => setIsTransitioning(false), 700)
    },
    [isTransitioning, startAutoSlide],
  )

  const prev = useCallback(() => {
    if (isTransitioning) return
    goTo((currentIndex - 1 + slides.length) % slides.length)
  }, [currentIndex, goTo, isTransitioning])

  const next = useCallback(() => {
    if (isTransitioning) return
    goTo((currentIndex + 1) % slides.length)
  }, [currentIndex, goTo, isTransitioning])

  const pause = () => { isPausedRef.current = true }
  const resume = () => { isPausedRef.current = false; startTimeRef.current = Date.now() }

  return (
    <>
      {/* Keyframes for tech animations */}
      <style jsx global>{`
        @keyframes scanY {
          0%   { top: -2px; }
          50%  { top: 100%; }
          100% { top: -2px; }
        }
        @keyframes spinSlow {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-[0_8px_40px_rgba(0,100,255,0.25)] max-h-[550px] flex"
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        <div className="relative overflow-hidden w-full">
          {/* Slide track */}
          <div
            className="flex h-full will-change-transform"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: isTransitioning
                ? 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                : 'none',
            }}
          >
            {slides.map((slide, i) => (
              <div
                key={i}
                className="flex-none w-full min-h-[420px] md:min-h-[520px] relative flex items-center justify-center bg-[#0a1628]"
              >
                {/* Gradient layer per slide */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f3c] via-[#0a2a5e] to-[#0c1a3a]" />
                {/* Accent glow strip at top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

                {/* Tech background */}
                <TechGrid />

                {/* Content */}
                <div className="relative z-10 text-center max-w-3xl px-8 py-14">
                  {/* Icon container with glow ring */}
                  <div className="mx-auto mb-6 w-24 h-24 rounded-2xl border border-cyan-400/30 bg-white/[0.05] backdrop-blur-sm flex items-center justify-center text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                    {slide.icon}
                  </div>

                  {/* Slide counter chip */}
                  <span className="inline-block mb-4 px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-[0.2em] uppercase bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                    0{i + 1} / 0{slides.length}
                  </span>

                  <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight drop-shadow-[0_0_20px_rgba(96,165,250,0.3)]">
                    {slide.title}
                  </h1>
                  <p className="text-base md:text-lg text-blue-100/80 mb-10 max-w-xl mx-auto leading-relaxed">
                    {slide.subtitle}
                  </p>

                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                      href={slide.cta.href}
                      className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold px-8 py-3 rounded-full shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_4px_30px_rgba(59,130,246,0.6)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {slide.cta.text}
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                    <Link
                      href={slide.secondaryCta.href}
                      className="inline-flex items-center gap-2 border border-blue-400/40 text-blue-200 font-semibold px-8 py-3 rounded-full hover:bg-blue-400/10 hover:border-blue-400/60 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-sm"
                    >
                      {slide.secondaryCta.text}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Nav: Previous */}
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/20 bg-white/[0.07] backdrop-blur-md flex items-center justify-center text-white/70 z-10 transition-all duration-300 hover:bg-white/15 hover:border-cyan-400/40 hover:text-cyan-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Nav: Next */}
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/20 bg-white/[0.07] backdrop-blur-md flex items-center justify-center text-white/70 z-10 transition-all duration-300 hover:bg-white/15 hover:border-cyan-400/40 hover:text-cyan-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2.5 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-500 focus:outline-none ${
                  i === currentIndex
                    ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 shadow-[0_0_8px_rgba(34,211,238,0.4)]"
              style={{
                width: `${progress}%`,
                transition: 'width 0.1s ease-out',
                willChange: 'width',
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
