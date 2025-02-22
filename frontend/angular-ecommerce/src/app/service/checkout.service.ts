import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Buy } from '../common/buy';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StripePaymentInfo } from '../common/stripe-payment-info';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private buyUrl = environment.myShopUrl +'/checkout/buy';

  private phoneNumber: string = '';

  storage:Storage = localStorage;

  private stripePaymentIntentUrl  = environment.myShopUrl + '/checkout/stripePayment-intent'

  constructor(private httpClient:HttpClient) { }
  
  placeOrder(buy:Buy):Observable<any>{
    return this.httpClient.post<Buy>(this.buyUrl,buy)
  }
 // 設置 phoneNumber
  setPhoneNumber(phoneNumber: string): void {
    this.storage.setItem('userPhoneNumber', JSON.stringify(phoneNumber));
    console.log('Stored phone number:', phoneNumber); 
  }
   // 獲取 phoneNumber
  getPhoneNumber(): string {
    const phoneNumber = JSON.parse(this.storage.getItem('userPhoneNumber')!);
    return phoneNumber;
  }

  createStripePaymentIntent(StripePaymentInfo:StripePaymentInfo):Observable<any>{
    return this.httpClient.post<StripePaymentInfo>(this.stripePaymentIntentUrl,StripePaymentInfo);
  }
}
