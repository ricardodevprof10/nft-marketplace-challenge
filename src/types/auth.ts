export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  avatarUrl?: string
}
export interface AuthSession { user: User; token: string }
export interface LoginInput { email: string; password: string }
export interface RegisterInput extends LoginInput { name: string }
export interface UpdateProfileInput { name: string; email: string; avatarUrl?: string }
export interface ChangePasswordInput { currentPassword: string; newPassword: string }
