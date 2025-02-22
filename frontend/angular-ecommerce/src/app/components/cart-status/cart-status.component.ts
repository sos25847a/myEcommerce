import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/service/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPrice:number = 0;
  totalQuantity:number = 0;

  constructor(private cartService:CartService) { }

  ngOnInit(): void {
    this.UpdateCartStatus();
  }

  UpdateCartStatus(){
    // subscribe cartService.totalPrice 將改變的資料傳到 this.totalPrice 
    this.cartService.totalPrice.subscribe(
      data =>this.totalPrice = data
    );
    // subscribe cartService.totalQuantity 將改變的資料傳到 this.totalQuantity
    this.cartService.totalQuantity.subscribe(
      data =>{
       this.totalQuantity = data
      }
    );
  }

}
