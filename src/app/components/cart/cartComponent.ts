import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { SearchBarComponent } from '../search-bar/search-bar';
import { FormsModule } from '@angular/forms';
import { Training } from '../../models/training.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, SearchBarComponent, CommonModule],
  templateUrl: './cartComponent.html',
  styleUrls: ['./cartComponent.css'],
})
export class CartComponent implements OnInit, OnDestroy {

  // Terme saisi (barre de recherche)
  searchTerm = '';

  // Injection du service + router
  constructor(
    public cartService: CartService, 
    private readonly router: Router, 
    private readonly authService: AuthService
  ) {

    console.log('[Cart] constructor');//--
  }

  get isAuthenticated(): boolean {
  return this.authService.isAuthenticated;
}

  // Reçoit le texte émis par <app-search-bar>
  onSearchTermChange(term: string): void {
    this.searchTerm = term;
  }

  /**
   * Liste filtrée à afficher dans le panier.
   * Filtre sur name + description (comme demandé dans l'exo).
   */
  get filteredCartTrainings(): Training[] {
    const trainings = this.cartService.getAll();
    const term = this.searchTerm.toLowerCase();

    if (!term) return trainings;

    /**
     * filter : renvoie un nouveau tableau avec uniquement les éléments qui passent le test.
     * (t) => { ... } : callback appelée pour chaque Training du tableau.
     */
    return trainings.filter((t) => {
      const name = (t.name ?? '').toLowerCase();
      const description = (t.description ?? '').toLowerCase();
      return name.includes(term) || description.includes(term);
    });
  }

  removeTraining(Id: number) {

    console.log('[Cart] removeTraining', Id);//--
    this.cartService.removeTraining(Id);
  }

  ngOnInit(): void {

    console.log('[Cart] ngOnInit');//--
  }

  ngOnDestroy(): void {

    console.log('[Cart] ngOnDestroy');//--
  }

  onCommande() {
    if (this.cartService.getAll().length === 0) {
    return;
  }

  // On va à /form. Si pas connecté, le guard redirige vers /login?returnUrl=/form (se connecter puis revenir à la commande)
  this.router.navigateByUrl('/form');

  }
}
