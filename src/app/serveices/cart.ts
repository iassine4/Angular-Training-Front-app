import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Training } from '../models/training.model';
import { isPlatformBrowser } from '@angular/common';


/**
 * Service = logique métier (Business)
 * -> gère l'état du panier + règles métier (ex: add/remove/total)
 */

@Injectable({
  // providedIn: 'root' => Angular enregistre ce service dans l'injector global
  // => une instance unique (singleton) partagée dans toute l'app
  providedIn: 'root',
})
export class CartService {

  private readonly STORAGE_KEY = 'cart_trainings';
  private readonly isBrowser: boolean;

  // état privé du panier (liste des formations ajoutées)
  private trainingsInCart: Training[] = [];

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadFromStorage();
  }

  getAll(): Training[] {
    return this.trainingsInCart;
  }

  private normalizeQuantity(qty: number | undefined | null): number {
  const n = Number(qty);
  if (Number.isNaN(n)) return 1;
  return Math.max(1, Math.floor(n));
  }

  removeTraining(Id: number) {
    this.trainingsInCart = this.trainingsInCart.filter(training => training.id !== Id);
    this.saveToStorage();
  }
  
  addTraining(training: Training) {
    const existing = this.trainingsInCart.find(t => t.id === training.id);

  if (existing) {
    existing.quantity = this.normalizeQuantity(existing.quantity + 1);
  } else {
    this.trainingsInCart.push({
      ...training,
      quantity: this.normalizeQuantity(training.quantity ?? 1),
    });
  }
    this.saveToStorage();

  }

  total(): number {
    let sum = 0;
    for (const training of this.trainingsInCart) {
      sum += training.price * (training.quantity ?? 1);
    }
    return sum;
  }

  private saveToStorage(): void {
    if (!this.isBrowser) return;

    const data = JSON.stringify(this.trainingsInCart);
    localStorage.setItem(this.STORAGE_KEY, data);
  }

  private loadFromStorage(): void {
    if (!this.isBrowser) return;

    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return;

    try {
      this.trainingsInCart = JSON.parse(raw) as Training[];
    } catch {
      // si les données sont corrompues, on repart propre
      this.trainingsInCart = [];
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}
