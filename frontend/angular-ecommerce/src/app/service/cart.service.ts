import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  cartItem:CartItem[]=[];

  totalPrice:Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity:Subject<number> = new BehaviorSubject<number>(0);
  // 在同一個瀏覽器分頁或窗口中，讓多個頁面之間共享資料
  storage:Storage = localStorage;

  constructor() { 
    // 從Storage獲取資料
    let data = JSON.parse(this.storage.getItem('cartItems')!)
    // 如果data不為空，代表之前購物車有東西
    if(data!=null){
      // 將data放到購物車中
      this.cartItem = data;

      //計算所有的價格及數量有多少
      this.computeCartTotals();
    }
  }

  addToCart(theCartItem:CartItem){
    
    // 確認是否有東西在購物車裡面
    let alreadyExistsInCart:boolean=false;
    let existingCartItem:CartItem = undefined!;

    if(this.cartItem.length>0){
      //如果有,用id找尋是哪個商品
      for(let tempCartItem of this.cartItem){
        if(tempCartItem.id==theCartItem.id){
          existingCartItem = tempCartItem;
          break;
        }
      }

      // 確認有沒有在購物車找到
      if (existingCartItem != undefined) {
        //有找到
        alreadyExistsInCart = true;
      } else {
        //沒有找到
        alreadyExistsInCart = false;
      }
    }
    if(alreadyExistsInCart){
      //已經在購物車裡面,數量+1
      existingCartItem.quantity++;
    }else{
      //沒有在購物車裡面,將商品加進去
      this.cartItem.push(theCartItem);
    }

    // 計算所有的價格及數量有多少
    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue:number = 0;
    let totalQuantityValue:number = 0;

    for(let currentCartItem of this.cartItem){
      totalPriceValue +=currentCartItem.quantity*currentCartItem.unitPrice;
      totalQuantityValue+=currentCartItem.quantity;
    }
    // 所有的subscribers接收新data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    // 紀錄購物車訊息
    this.logCartData(totalPriceValue,totalQuantityValue);


    // 保留購物車內容
    this.persistCartItems();
  }
  // 保留購物車內容
  persistCartItems(){
    // 將 this.cartItem 物件轉換成 JSON 字串，因為 Web Storage 只允許儲存字串，不能直接儲存物件
    // 使用 storage.setItem() 方法將資料存儲到 sessionStorage
    this.storage.setItem('cartItems',JSON.stringify(this.cartItem));
  }



  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log("in the cart car:");
    for(let tempCartItem of this.cartItem){
      const logTotalPrice = tempCartItem.quantity*tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name},quantity: ${tempCartItem.quantity},unitPrice:${tempCartItem.unitPrice},totalPrice:${logTotalPrice}`);
      
    }
    console.log(`totalPrice:${totalPriceValue},totalQuantity:${totalQuantityValue}`);
    console.log("------");
  }

  reduceQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    
    if(theCartItem.quantity == 0){
      this.remove(theCartItem)
    }
    else{
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    // 找到購物車裡面的內容
    const itemIndex = this.cartItem.findIndex(tempCartItem=>tempCartItem.id==theCartItem.id);

    // 如果找到刪除他
    if(itemIndex>-1){
      this.cartItem.splice(itemIndex,1);

      this.computeCartTotals();
    }
  }
}
