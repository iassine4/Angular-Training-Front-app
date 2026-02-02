import { Routes } from '@angular/router';
import { TrainingsComponent } from './components/trainings/trainingsComponent';
import { CartComponent } from './components/cart/cartComponent';
import { UserForm } from './components/forms/user-form/user-form';
import { PageNotFound } from './components/error-page/page-not-found/page-not-found';

export const routes: Routes = [
    { path: '', redirectTo: 'trainings', pathMatch: 'full' },

    {
        path : 'trainings',
        component : TrainingsComponent
    },
    { 
        path: 'cart',
        component : CartComponent
    },

    {
        path: 'form',
        component: UserForm
    },

    //toute route inconnue redirige vers /page-not-found
    { path: '**', component: PageNotFound },
];
