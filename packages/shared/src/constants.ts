/** Available work categories */
export const CATEGORIES = [
  { value: 'fashion', label: '服装设计', icon: '🎨' },
  { value: 'film', label: '影视创作', icon: '🎬' },
  { value: 'music', label: '音乐创作', icon: '🎵' },
  { value: 'writing', label: '文字创作', icon: '✏️' },
  { value: 'illustration', label: '插画艺术', icon: '🖼️' },
  { value: 'digital', label: '数字作品', icon: '💻' },
  { value: 'craft', label: '手工艺品', icon: '🔧' },
  { value: 'other', label: '其他创作', icon: '📦' },
] as const;

/** Default revenue period in months */
export const DEFAULT_REVENUE_MONTHS = 12;

/** JWT token expiry in seconds (7 days) */
export const JWT_EXPIRY = 7 * 24 * 60 * 60;

/** Max file upload size (50MB) */
export const MAX_UPLOAD_SIZE = 50 * 1024 * 1024;
