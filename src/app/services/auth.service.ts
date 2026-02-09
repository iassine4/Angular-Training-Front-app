import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environments';
import { CryptoService } from './crypto.service';

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
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cryptoService = inject(CryptoService);
  
  // Base "mock" données utilisateurs
  private readonly users: UserRecord[] = [
    { email: 'elbab@gmail.com', password: '1234', roles: ['ADMIN', 'USER'] },
    { email: 'hugo@gmail.com', password: '1234', roles: ['USER'] },
  ];

  private readonly storageKey = 'auth_user';
  private cacheedUser: AuthUser | null = null;

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  public get isAuthenticatedSync(): boolean {
    return this.cacheedUser !== null;
  }

  public async getCurrentUser(): Promise<AuthUser | null> {
    if (this.cacheedUser) return this.cacheedUser;
    if (!this.isBrowser) return null;

    const encrypted = localStorage.getItem(this.storageKey);
    if (!encrypted) return null;

    try {
      const user = await this.cryptoService.decryptObject<AuthUser>(encrypted);

      // mini validation "shape"
      if (!user?.email || !Array.isArray(user.roles)) throw new Error('invalid user payload');

      this.cacheedUser = user;
      return user;
    } catch (error) {
      console.error('AuthService: Erreur lors du décryptage du user:', error);
      // si le contenu est illisible, on nettoie le localStorage pour éviter les erreurs à répétition
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  public async isAuthenticated(): Promise<boolean> {
    return (await this.getCurrentUser()) !== null;
  }

  public async login(email: string, password: string): Promise<boolean> {
    const user = this.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return false;
    if (!this.isBrowser) return false;
    const authUser: AuthUser = {email: user.email, roles: user.roles};
    const encrypted = await this.cryptoService.encryptObject(authUser);

    localStorage.setItem(this.storageKey, encrypted);
    this.cacheedUser = authUser;
   
    return true;
  }

    public logout(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.storageKey);
    this.cacheedUser = null;
  }
}
