'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

export default function HeroBanner() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(titleRef.current, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.8 })
      .fromTo(lineRef.current, { autoAlpha: 0, scaleX: 0 }, { autoAlpha: 1, scaleX: 1, duration: 0.6 }, '-=0.3')
      .fromTo(subtitleRef.current, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.2')
      .fromTo(descRef.current, { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.2')
      .fromTo(btnRef.current, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.1');
  }, []);

  return (
    <div
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0d0d1a 100%)',
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 border border-primary/30 rounded-full" />
        <div className="absolute bottom-20 right-10 w-48 h-48 border border-primary/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-primary/10 rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-100 mb-6 tracking-widest"
          style={{ letterSpacing: '0.15em' }}
        >
          人民万岁
        </h1>

        <div ref={lineRef} className="gold-line mx-auto mb-6" style={{ width: '64px' }}></div>

        <p ref={subtitleRef} className="text-lg sm:text-xl text-gray-300 mb-4 tracking-wider">
          共享世界
        </p>

        <p ref={descRef} className="text-sm sm:text-base text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
          让每一种创造都属于人民
        </p>

        <div ref={btnRef}>
          <Link href="/explore" className="btn-primary text-lg px-8 py-3">
            开始探索
          </Link>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-800 to-transparent" />
    </div>
  );
}
