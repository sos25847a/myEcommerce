import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { from, lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
    
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request,next));
  }

  //async:異步(非同步函式)當一個函式被標記為async，它一定會回傳一個Promise，即使你沒有明確寫 return Promise，也會自動把回傳值包裝成Promise
  // Promise是JavaScript的一種非同步處理機制，它代表一個尚未完成但**最終會被解決，成功（fulfilled）或失敗（rejected）**的操作。
  // HttpRequest<any> 代表任何型別的 HTTP 請求，可能是 GET、POST、PUT等請求
  // /<any> 表示請求的 body（請求體）可以是任何型別
  // HttpHandler 是 Angular 的 HTTP 攔截器機制中的一部分，它負責將請求傳遞給下一個處理器（通常是 HTTP 客戶端）
  // next.handle(request) 會返回一個 Observable<HttpEvent<any>>，代表這個請求的處理流程
  private async handleAccess(request:HttpRequest<any>,next: HttpHandler): Promise<HttpEvent<any>>{
    
    // 添加一個令牌(token)到受保護的API端點(Secured Endpoints)
    const theEndpoints = environment.myShopUrl +'/orders'
    const securedEndpoints = [theEndpoints];

    
    //urlWithParams = 完整的請求 URL，包含查詢參數
    // .some()會檢查陣列中是否至少有一個元素滿足條件
    // includes檢查字串或陣列是否包含某個值
    // 所以這裡是檢查當前請求的URL是否匹配securedEndpoints陣列中的任何一個受保護端點
    if(securedEndpoints.some(url => request.urlWithParams.includes(url))){

      // 獲取訪問令牌(token)
      const accessToken = this.oktaAuth.getAccessToken();

      //添加一個帶有令牌的request
      request = request.clone({ 
        //每當 HttpClient 送出請求時：
        //如果 accessToken 存在，就會自動附加 Authorization 標頭
        setHeaders:{
          Authorization: 'Bearer '+accessToken
        }    
      });
    }

    // await：等待Promise完成，讓handleAccess()變成異步函式
    //next.handle(request)會將request傳遞給下一個HttpInterceptor，或者最終送出HTTP請求
    // lastValueFrom()可以將Observable轉換為 Promise，並取得Observable 的最後一個值
    return await lastValueFrom(next.handle(request));

  }
  
}
