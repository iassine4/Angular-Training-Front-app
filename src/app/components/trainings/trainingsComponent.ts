import { Component, OnDestroy, OnInit } from '@angular/core';
import { Training } from '../../models/training.model';
import { CommonModule } from '@angular/common';
import { TrainingApiService } from '../../serveices/training-api';

import { FormsModule } from '@angular/forms';
import { CartService } from '../../serveices/cart';
import { Router } from '@angular/router';
import { SearchBarComponent } from '../search-bar/search-bar';


@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [FormsModule, SearchBarComponent, CommonModule],
  templateUrl: './trainingsComponent.html',
  styleUrl: './trainingsComponent.css',
})
export class TrainingsComponent implements OnInit, OnDestroy {
  // liste affichée dans la vue
  listTrainings : Training[] = [];
  // Terme saisi (fourni par SearchBarComponent)
  searchTerm = '';
  selectedCategory = 'all';      // 'all' = pas de filtre
  maxPrice: number | null = null; // null = pas de filtre

   /**
   * DI (Injection de dépendances) : Angular injecte CartService (pas de "new CartService()")
   * - private cartService: CartService => Angular injecte le service
   * - private router: Router => Angular injecte le router (navigation)
   *
   * NB (slide 24) : private/public dans le constructor
   * => ça crée automatiquement un attribut de classe (pas besoin de le déclarer au-dessus)
   */
  constructor(private cartService: CartService, private router: Router, private readonly trainingApiService: TrainingApiService) {

    console.log('[Trainings] constructor');//
  }
    
  /**
   * ngOnInit :
   * - exécuté après l'initialisation du composant
   * - endroit recommandé pour charger des données (liste de trainings)
   */
  ngOnInit(): void {

    console.log('[Trainings] ngOnInit');//--

    this.trainingApiService.getTrainings().subscribe({
    next: (trainings) => {
      this.listTrainings = trainings;
      console.log('[Trainings] trainings loaded =>', trainings.length);
    },
    error: (error) => {
      console.error('[Trainings] API error', error);
      this.listTrainings = [];
    },
  });
    

    // Init du composant : chargement de la liste des formations (mock)
/*  this.listTrainings = [
      {id : 1, name : 'java', description : 'Formation Java SE 8 sur 5 jours', price : 1500, quantity: 1, category: 'Development'},
      {id : 2, name : 'python', description : 'Formation Python base sur 5 jours', price : 1000, quantity: 1, category: 'Development'},
      {id : 3, name : 'Docker', description : 'Formation Docker sur 3 jours', price : 900, quantity: 1, category: 'DevOps'}
    ];
*/
   /* this.trainingApi.getTrainings().subscribe({
      next: (trainings) => {
        this.listTrainings = trainings;
        console.log('[Trainings] ngOnInit - trainings loaded:', this.listTrainings);
      },
      error: (error) => {
        console.error('[Trainings] ngOnInit - error loading trainings:', error);
      }
    });*/
  }

  /**
   * Action métier :
   * - ajoute au panier via le service
   * - puis navigation vers la page panier (slide routage : this.router.navigate(['cart']))
   */
  onAddToCart(training: Training) {

    console.log('[Trainings] onAddToCart', training.name);//--

    this.cartService.addTraining(training); // Business via Service
    this.router.navigateByUrl('/cart');
    //this.router.navigate(['cart']);      // Navigation vers /cart

  }
  
  onSearchTermChange(term: string): void {
    this.searchTerm = term;
    console.log('[Trainings] searchTerm =>', this.searchTerm);
  }

  get categories(): string[] {
  // Set => supprime les doublons
  return Array.from(new Set(this.listTrainings.map(t => t.category))).sort();
  }

  get filteredTrainings(): Training[] {
    const term = this.searchTerm.trim().toLowerCase();
    let result = this.listTrainings;

    //  Filtre mot-clé (name + description)
    if (term){
      result = result.filter(t => {
      const name = (t.name ?? '').toLowerCase();
      const description = (t.description ?? '').toLowerCase();
      return name.includes(term) || description.includes(term);
    });
  }

    // Filtre catégorie
    if (this.selectedCategory !== 'all') {
      result = result.filter(t => t.category === this.selectedCategory);
    }

    // Filtre prix max
    if (this.maxPrice !== null) {
      result = result.filter(t => t.price <= this.maxPrice!);
    }
  return result;
  }

  ngOnDestroy(): void {
    console.log('[Trainings] ngOnDestroy');//--
  }
}
