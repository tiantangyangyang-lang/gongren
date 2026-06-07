export default function Footer() {
  return (
    <footer className="relative bg-red-950 border-t border-gold/20 py-12 mt-auto overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-red-900/50 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 text-center">
        <div className="gold-line mb-4"></div>
        <p className="text-gold text-lg font-bold mb-2 tracking-[0.3em]">全世界无产阶级万岁</p>
        <p className="text-red-200/60 text-sm">鞍钢 · 共享世界 — 集体所有制创作平台</p>
        <p className="text-red-300/40 text-xs mt-3">&copy; {new Date().getFullYear()} 鞍钢 Angang</p>
      </div>
    </footer>
  );
}
