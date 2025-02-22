import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/service/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {




  cartItem:CartItem[] = [];
  totalPrice:number = 0;
  totalQuantity:number = 0;


  constructor(private cartService:CartService) {}

  ngOnInit(): void {
    this.listCartItem();
  }
  listCartItem() {
    // 將購物車內的東西傳入
    this.cartItem = this.cartService.cartItem;
    //subscribe價格 
    this.cartService.totalPrice.subscribe(
      data =>{
        this.totalPrice = data
      }
    );
    //subscribe數量
    this.cartService.totalQuantity.subscribe(
      data =>{
        this.totalQuantity = data
      }
    );
    // 計算總價與總數量
    this.cartService.computeCartTotals();
  }
  increaseQuantity(theCartItem: CartItem) {
    this.cartService.addToCart(theCartItem);
    }
    reduceQuantity(theCartItem: CartItem) {
      this.cartService.reduceQuantity(theCartItem)
      }
      remove(theCartItem: CartItem) {
        this.cartService.remove(theCartItem);
      }
}
