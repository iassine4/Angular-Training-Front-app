import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ivlength = 12; // 12 bytes = 128 bits, taille standard pour un IV

  private keyPromise: Promise<CryptoKey> | null = null;
  
  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private async getKey(): Promise<CryptoKey> {
    if (!this.isBrowser) {
      throw new Error('CryptoService: WebCrypto indisponible côté serveur (SSR).');
    } 
    if (this.keyPromise) {
      return this.keyPromise;
    }
    this.keyPromise = (async () => {
      const rawKey = this.fromBase64(environment.cryptoKeyBase64);

      if (rawKey.length !== 32) {
        throw new Error(`CryptoService: La clé doit faire exactement 32 bytes (256 bits). Clé actuelle: ${rawKey.length} bytes.`);
      }

      return await crypto.subtle.importKey(
        'raw',
        rawKey,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
      );
    })();   
    return this.keyPromise;
  }

  public async encryptString(plainText: string): Promise<string> {
    const key = await this.getKey();
    const iv = crypto.getRandomValues(new Uint8Array(this.ivlength));
    const data = new TextEncoder().encode(plainText);

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    const ivB64 = this.toBase64(iv);
    const cipherB64 = this.toBase64(new Uint8Array(encrypted));

    // Format simple : iv.cipher (base64)
    return `${ivB64}:${cipherB64}`;
  }

  public async decryptString(payload: string): Promise<string> {
    const key = await this.getKey();

    const parts = payload.split(':');
    if (parts.length !== 2) {
      throw new Error('CryptoService: payload invalide.');
    }

    const iv = this.fromBase64(parts[0]);
    const cipherBytes = this.fromBase64(parts[1]);

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      cipherBytes
    );
    return new TextDecoder().decode(decryptedBuffer);
  }

  public async encryptObject<T>(value: T): Promise<string> {
    return this.encryptString(JSON.stringify(value));
  }

  public async decryptObject<T>(payload: string): Promise<T> {
    const json = await this.decryptString(payload);
    return JSON.parse(json) as T;
  }

  private toBase64(bytes: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private fromBase64(base64: string): Uint8Array<ArrayBuffer> {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length); // => buffer = ArrayBuffer
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    // Ici, on retourne un Uint8Array qui est une vue sur un ArrayBuffer.
    return bytes as Uint8Array<ArrayBuffer>;
  }
}