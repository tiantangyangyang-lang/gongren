export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-600 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="gold-line mb-4"></div>
        <p className="text-sm text-gray-500 mb-1">全世界无产阶级万岁</p>
        <p className="text-xs text-gray-600">
          鞍钢 · 共享世界 — 集体所有制创作平台
        </p>
        <p className="text-xs text-gray-700 mt-2">
          &copy; {new Date().getFullYear()} 鞍钢 Angang
        </p>
      </div>
    </footer>
  );
}
