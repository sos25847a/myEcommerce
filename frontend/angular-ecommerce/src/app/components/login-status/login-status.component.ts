import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';


@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {
  userName:string = '';
  isAuthenticated:boolean = false;
  storage:Storage = sessionStorage;

  constructor(private oktaAuthService:OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  ngOnInit(): void {
    // 訂閱驗證狀態
    // oktaAuth服務的狀態更改
    this.oktaAuthService.authState$.subscribe(
      (result) =>{
        // 以驗證
        this.isAuthenticated = result.isAuthenticated!;
        // 獲得用戶訊息
        this.getUserDetails();
      }
    );
  }
  // 獲得用戶訊息
  getUserDetails() {
    // 如果身分驗證通過，登入成功
    if(this.isAuthenticated){
      // 用戶登入權限，用戶名稱
      this.oktaAuth.getUser().then(
        (res) =>{
          this.userName = res.name as string;

          // 獲取user的email(okta帳戶)
          const theEmail = res.email;

          // 在瀏覽器在儲存
          this.storage.setItem('userEmail',JSON.stringify(theEmail))
        }
      );

    }
  }
  // 登出
  logout(){
    // okta移除當前令牌
    this.oktaAuth.signOut();
  }
}
