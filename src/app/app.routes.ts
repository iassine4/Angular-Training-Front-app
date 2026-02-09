import { Routes } from '@angular/router';
import { PageNotFound } from './components/error-page/page-not-found/page-not-found';
import { LoginComponent } from './components/login/login/loginComponent';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'trainings', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: 'trainings',
    loadComponent: () =>
      import('./components/trainings/trainingsComponent').then((m) => m.TrainingsComponent),
  },

  // Panier accessible (plus fluide)
  {
    path: 'cart',
    loadComponent: () => import('./components/cart/cartComponent').then((m) => m.CartComponent),
  },

  // Commande (Customer) protégée
  {
    path: 'form',
    
    loadComponent: () =>
      import('./components/forms/customer-form/customer-form').then((m) => m.CustomerFormComponent),
  },

  { path: '**', component: PageNotFound },
];
