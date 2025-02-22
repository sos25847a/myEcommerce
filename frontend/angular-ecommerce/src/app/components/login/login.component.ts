import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import myAppConfig from 'src/app/config/my-app-config';
import OktaSignIn from '@okta/okta-signin-widget';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin:any

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { 
    this.oktaSignin  = new OktaSignIn({
      logo: 'assets/images/logo.png',
      // 擷取所有在oauth2之前的內容
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams:{
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    });
  }

  ngOnInit(): void {
    // 刪除以前的任何元素
    this.oktaSignin.remove();
    // 渲染一個元素
    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget'},//這個名字要跟HTML login.component.html中的id 一致
      // 確認response是否成功
      // 成功
      (response: any) => {
        if(response.status==='SUCCESS'){
          // 重定向進行登入
          this.oktaAuth.signInWithRedirect();
          }
      },  
      // 失敗
      (error:any)=>{
        throw error;
        }
      );
    } 
  }
