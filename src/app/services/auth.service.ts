import { Injectable } from '@angular/core';

export type  UserRole = 'ADMIN' | 'USER';

export interface AuthUser {

  email: string;
  roles: UserRole[];

}

interface UserRecord extends AuthUser {
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  // Base "mock" données utilisateurs
  private readonly users: UserRecord[] = [
    { email: 'elbab@gmail.com', password: '1234', roles: ['ADMIN', 'USER'] },
    { email: 'hugo@gmail.com', password: '1234', roles: ['USER'] },
  ];

  private readonly storageKey = 'auth_user';

  public get currentUser(): AuthUser | null {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) as AuthUser : null;
  }

  public get isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
  public login(email: string, password: string): boolean {
    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return false;
    
    const authUser: AuthUser = {email: user.email, roles: user.roles};
    localStorage.setItem(this.storageKey, JSON.stringify(authUser));
    return true;
  }

  public logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  public hasRole(role: UserRole): boolean {
    const user = this.currentUser;
    if (!user) return false;
    return user.roles.includes(role);
  }
}
