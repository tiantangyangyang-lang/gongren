/** User role */
export type UserRole = 'creator' | 'member' | 'admin';

/** Work status */
export type WorkStatus = 'published' | 'draft' | 'hidden';

/** File type for work attachments */
export type FileType = 'image' | 'video' | 'audio' | 'document' | 'other';

/** Revenue status */
export type RevenueStatus = 'active' | 'expired';

export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  created_at: string;
}

export interface UserWithWorks extends User {
  works: Work[];
}

export interface Work {
  id: number;
  title: string;
  description: string | null;
  category: string;
  tags: string[] | null;
  creator_id: number;
  status: WorkStatus;
  view_count: number;
  created_at: string;
  updated_at: string;
  files?: WorkFile[];
  creator?: User;
}

export interface WorkFile {
  id: number;
  work_id: number;
  file_url: string;
  file_type: FileType;
  sort_order: number;
  created_at: string;
}

export interface RevenueRecord {
  id: number;
  work_id: number;
  creator_id: number;
  amount: number;
  period_start: string;
  period_end: string;
  status: RevenueStatus;
  created_at: string;
  work?: Work;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreateWorkRequest {
  title: string;
  description?: string;
  category: string;
  tags?: string[];
  files?: { file_url: string; file_type: FileType; sort_order?: number }[];
}

export interface UpdateWorkRequest {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  status?: WorkStatus;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  code: string;
}
