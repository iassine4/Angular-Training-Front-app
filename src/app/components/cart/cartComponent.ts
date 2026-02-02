import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../serveices/cart';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cartComponent.html',
  styleUrls: ['./cartComponent.css'],
})
export class CartComponent implements OnInit, OnDestroy {

  // public => accessible directement dans le template : cartService.total(), cartService.getAll()
  constructor(public cartService: CartService, private router: Router){

     console.log('[Cart] constructor');//--
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
