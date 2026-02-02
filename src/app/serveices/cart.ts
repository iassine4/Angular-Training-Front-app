import { Injectable } from '@angular/core';
import { Training } from '../models/training.model';


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

  // état privé du panier (liste des formations ajoutées)
  private trainingsInCart: Training[] = [];

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
  }

  total(): number {
    let sum = 0;
    for (const training of this.trainingsInCart) {
      sum += training.price * (training.quantity ?? 1);
    }
    return sum;
  }

  constructor() {}
  
}
