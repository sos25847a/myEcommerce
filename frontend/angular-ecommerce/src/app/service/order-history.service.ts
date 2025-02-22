import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = environment.myShopUrl + '/orders'
  

  constructor(private httpClient:HttpClient) { }

  getOrderHistory(thePhoneNumber:string):Observable<GetResponseOrderHistory>{
    // 對應後端建立Url
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerPhoneNumberOrderByDateCreatedDesc?phoneNumber=${thePhoneNumber}`;
    // call Rest API
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }

}
interface GetResponseOrderHistory{
  _embedded: {
    orders: OrderHistory[];
  }

}
