import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/service/order-history.service';
import { CheckoutService } from 'src/app/service/checkout.service';  // 引入服務

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList:OrderHistory[] = [];
  storage:Storage = sessionStorage;
  constructor(private orderHistoryService:OrderHistoryService,
              private checkoutService: CheckoutService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }
  // 處理OrderHistory
  handleOrderHistory() {
    // 從瀏覽器獲取用戶email
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);
    // 從 CheckoutService 獲取 phoneNumber
    const thePhoneNumber= this.checkoutService.getPhoneNumber();
    

    // 從orderHistoryService獲取data
    this.orderHistoryService.getOrderHistory(thePhoneNumber).subscribe(
      data=>{
        
        this.orderHistoryList = data._embedded.orders;
      }
    );
  }
  
}
