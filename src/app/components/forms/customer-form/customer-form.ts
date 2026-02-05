import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer } from '../../../models/customer.model';
import { CartService } from '../../../services/cart.service';


@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.css',
})
export class CustomerFormComponent {

  public customer: Customer = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
  };

  public errorMessage = '';

  constructor(public readonly cartService: CartService, 
              private readonly router: Router) {
    console.log('[CustomerForm] constructor');
  }

  public onSubmit(form: NgForm): void {

    this.errorMessage = '';

    if (this.cartService.getAll().length === 0) {
      this.errorMessage = 'Votre panier est vide.';
      return;
    }

    if (form.invalid) {
      this.errorMessage = 'Veuillez corriger les erreurs du formulaire.';
      return;
    }

    // Ici, on simule la commande en affichant les infos dans la console.
    console.log('[Order] customer =>', this.customer);
    console.log('[Order] cart =>', this.cartService.getAll());
    console.log('[Order] total =>', this.cartService.total());

     // UX : rediriger vers une page "confirmation" ou revenir au panier
    this.router.navigateByUrl('/cart');
  }
}
