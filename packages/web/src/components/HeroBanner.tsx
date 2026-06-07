'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo(titleRef.current, { autoAlpha: 0, y: 80, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.2 })
        .fromTo(lineRef.current, { autoAlpha: 0, scaleX: 0 }, { autoAlpha: 1, scaleX: 1, duration: 0.8 }, '-=0.5')
        .fromTo(subtitleRef.current, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.8 }, '-=0.4')
        .fromTo(btnRef.current, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8 }, '-=0.3');

      // Floating particles
      if (particlesRef.current) {
        const particles = particlesRef.current.children;
        gsap.utils.toArray(particles).forEach((p: any, i) => {
          gsap.to(p, {
            y: gsap.utils.random(-40, 40),
            x: gsap.utils.random(-20, 20),
            rotation: gsap.utils.random(-15, 15),
            duration: gsap.utils.random(3, 7),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.3,
          });
        });
      }

      // Parallax on scroll
      gsap.to(titleRef.current, {
        scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: true },
        y: -60, opacity: 0.5,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #6d0008 0%, #9b0010 20%, #c1121f 40%, #e63946 60%, #c1121f 80%, #6d0008 100%)' }}
    >
      {/* Animated radial glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[80px] animate-drift" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-white/5 rounded-full blur-[60px] animate-drift" style={{ animationDelay: '-10s' }} />
      </div>

      {/* Floating particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: gsap.utils.random(3, 12) + 'px',
              height: gsap.utils.random(3, 12) + 'px',
              background: i % 3 === 0 ? '#ffd700' : i % 3 === 1 ? '#fff' : '#ff6b6b',
              opacity: gsap.utils.random(0.2, 0.6),
              left: gsap.utils.random(5, 95) + '%',
              top: gsap.utils.random(5, 95) + '%',
              boxShadow: i % 5 === 0 ? '0 0 10px currentColor' : 'none',
            }}
          />
        ))}
      </div>

      {/* Decorative sun rays */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 bg-gold origin-bottom"
            style={{
              height: '60vh',
              transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
              opacity: 0.3 + (i % 3) * 0.2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-4">
          <span className="inline-block px-4 py-1 bg-gold/20 border border-gold/40 text-gold text-sm tracking-[0.3em] rounded-full uppercase">
            鞍 钢 · 共 享 世 界
          </span>
        </div>
        <h1
          ref={titleRef}
          className="text-7xl sm:text-8xl md:text-9xl font-black text-white mb-8"
          style={{ letterSpacing: '0.15em', textShadow: '0 0 80px rgba(255,215,0,0.4), 0 0 160px rgba(230,57,70,0.3)' }}
        >
          人民万岁
        </h1>
        <div ref={lineRef} className="gold-line mb-8" style={{ width: '120px', height: '3px' }}></div>
        <p ref={subtitleRef} className="text-2xl sm:text-3xl text-gold mb-4 tracking-[0.4em] font-light">
          全 世 界 无 产 阶 级 万 岁
        </p>
        <div ref={btnRef} className="mt-12">
          <Link href="/explore" className="btn-gold text-xl px-12 py-4">
            开始探索
          </Link>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none" className="w-full h-auto">
          <path d="M0 50 C240 100, 480 0, 720 50 C960 100, 1200 0, 1440 50 L1440 100 L0 100 Z" fill="#3d0000" />
        </svg>
      </div>
    </div>
  );
}
