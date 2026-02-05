import { Routes } from '@angular/router';

import { UserForm } from './components/forms/user-form/user-form';
import { PageNotFound } from './components/error-page/page-not-found/page-not-found';
import { LoginComponent } from './components/login/login/loginComponent';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'trainings', pathMatch: 'full' },

    { 
        path: 'login',
        component: LoginComponent
    },
    {   // route protégée : seul un user connecté accède au panier/commande
        path: 'cart',
        canActivate: [authGuard],
        loadComponent: () => import('./components/cart/cartComponent').then(m => m.CartComponent)
    },

    {
        path : 'trainings',
        loadComponent: () => import('./components/trainings/trainingsComponent').then(m => m.TrainingsComponent)
    },
    {
        path: 'form',
        component: UserForm
    },
    { path: 'form', canActivate: [authGuard], loadComponent: () => import('./components/forms/customer-form/customer-form').then(m => m.CustomerFormComponent) },

    //toute route inconnue redirige vers /page-not-found
    { path: '**', component: PageNotFound },
];
