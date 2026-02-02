import { Component, OnInit } from '@angular/core';
import { Training } from '../../models/training.model';

import { FormsModule } from '@angular/forms';
import { CartService } from '../../serveices/cart';
import { Router } from '@angular/router';
import { SearchBarComponent } from '../search-bar/search-bar';


@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [FormsModule, SearchBarComponent],
  templateUrl: './trainingsComponent.html',
  styleUrl: './trainingsComponent.css',
})
export class TrainingsComponent implements OnInit {
  // liste affichée dans la vue
  listTrainings : Training[] | undefined;

  // Terme saisi (fourni par SearchBarComponent)
  searchTerm = '';


   /**
   * DI (Injection de dépendances) : Angular injecte CartService (pas de "new CartService()")
   * - private cartService: CartService => Angular injecte le service
   * - private router: Router => Angular injecte le router (navigation)
   *
   * NB (slide 24) : private/public dans le constructor
   * => ça crée automatiquement un attribut de classe (pas besoin de le déclarer au-dessus)
   */
  constructor(private cartService: CartService, private router: Router){

    console.log('[Trainings] constructor');//
  }
    
  /**
   * ngOnInit :
   * - exécuté après l'initialisation du composant
   * - endroit recommandé pour charger des données (liste de trainings)
   */
  ngOnInit(): void {

    console.log('[Trainings] ngOnInit');//--

    // Init du composant : chargement de la liste des formations (mock)
    this.listTrainings = [
      {id : 1, name : 'java', description : 'Formation Java SE 8 sur 5 jours', price : 1500, quantity: 1, category: 'Development'},
      {id : 2, name : 'python', description : 'Formation Python base sur 5 jours', price : 1000, quantity: 1, category: 'Development'},
      {id : 3, name : 'Docker', description : 'Formation Docker sur 3 jours', price : 900, quantity: 1, category: 'DevOps'}
    ];
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

  get filteredTrainings(): Training[] {
    const term = this.searchTerm.toLowerCase();
    if (!term) return this.listTrainings || [];

    return (this.listTrainings || []).filter((t) => {
      const name = (t.name ?? '').toLowerCase();
      const description = (t.description ?? '').toLowerCase();
      return name.includes(term) || description.includes(term);
    });
  }

  ngOnDestroy(): void {
    console.log('[Trainings] ngOnDestroy');//--
  }
}
