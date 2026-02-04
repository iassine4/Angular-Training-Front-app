import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { SearchBarComponent } from '../search-bar/search-bar';
import { FormsModule } from '@angular/forms';
import { Training } from '../../models/training.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, SearchBarComponent],
  templateUrl: './cartComponent.html',
  styleUrls: ['./cartComponent.css'],
})
export class CartComponent implements OnInit, OnDestroy {

  // Terme saisi (barre de recherche)
  searchTerm = '';

  // Injection du service + router
  constructor(public cartService: CartService, private router: Router){

     console.log('[Cart] constructor');//--
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
  this.router.navigateByUrl('/form');
}
}
