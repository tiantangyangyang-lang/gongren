export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-dark-700 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="red-line mb-4"></div>
        <p className="text-sm text-gray-400 mb-2 tracking-wider">全世界无产阶级万岁</p>
        <p className="text-xs text-gray-500">鞍钢 · 共享世界 — 集体所有制创作平台</p>
        <p className="text-xs text-gray-600 mt-3">&copy; {new Date().getFullYear()} 鞍钢 Angang</p>
      </div>
    </footer>
  );
}
