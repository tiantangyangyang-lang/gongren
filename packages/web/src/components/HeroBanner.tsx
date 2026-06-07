'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

export default function HeroBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(titleRef.current, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 1 })
        .fromTo(lineRef.current, { autoAlpha: 0, scaleX: 0 }, { autoAlpha: 1, scaleX: 1, duration: 0.7 }, '-=0.4')
        .fromTo(subtitleRef.current, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.3')
        .fromTo(descRef.current, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.3')
        .fromTo(btnRef.current, { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.2');
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #1a0000 0%, #2d0000 25%, #0d0d0d 50%, #1a0a0a 75%, #0a0000 100%)',
      }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-[10%] w-80 h-80 border border-primary/30 rounded-full" />
        <div className="absolute bottom-20 right-[15%] w-64 h-64 border border-primary/20 rounded-full" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] border border-primary/10 rounded-full" />
        <div className="absolute bottom-10 left-[20%] w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-20 right-[10%] w-56 h-56 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <h1
          ref={titleRef}
          className="text-6xl sm:text-7xl md:text-8xl font-black text-white mb-8 tracking-widest"
          style={{ letterSpacing: '0.2em', textShadow: '0 0 40px rgba(230,57,70,0.3)' }}
        >
          人民万岁
        </h1>
        <div ref={lineRef} className="red-line mb-8" style={{ width: '80px', height: '2px' }}></div>
        <p ref={subtitleRef} className="text-xl sm:text-2xl text-gray-200 mb-6 tracking-widest font-light">
          共 享 世 界
        </p>
        <p ref={descRef} className="text-sm sm:text-base text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed">
          每一种创造都属于人民
        </p>
        <div ref={btnRef}>
          <Link
            href="/explore"
            className="inline-block px-10 py-4 bg-primary text-white font-bold text-lg rounded
                       hover:bg-primary-dark transition-all duration-300
                       shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40
                       hover:-translate-y-0.5 active:translate-y-0"
          >
            开始探索
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-dark-800 to-transparent" />
    </div>
  );
}
