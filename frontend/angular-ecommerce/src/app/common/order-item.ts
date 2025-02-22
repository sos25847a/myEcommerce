import { CartItem } from "./cart-item";

export class OrderItem {
    imageUrl!:string;
    unitPrice!:number;
    quantity!:number;
    productId!:string;

    //將訂單內容初始化，將購物車內的放入
    constructor(cartItem:CartItem){
        this.imageUrl = cartItem.imageUrl;
        this.unitPrice = cartItem.unitPrice;
        this.quantity = cartItem.quantity;
        this.productId = cartItem.id;
    }
}
