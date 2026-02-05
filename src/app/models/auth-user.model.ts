export type UserRole = 'ADMIN' | 'USER';

export interface AuthUser {
  email: string;
  roles: UserRole[];
}
