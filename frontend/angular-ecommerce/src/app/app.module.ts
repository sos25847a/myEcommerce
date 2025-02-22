import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProductService } from './service/product.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';

import { OktaAuthModule, OktaCallbackComponent,OKTA_CONFIG, OktaAuthGuard } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

import myAppConfig from './config/my-app-config';
import { MemberPageComponent } from './components/member-page/member-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthInterceptorService } from './service/auth-interceptor.service';


const oktaConfig = myAppConfig.oidc;
const oktaAuth = new OktaAuth(oktaConfig);


function sendToLoginPage(oktaAuth:OktaAuth,injector:Injector){
  // 注入器中獲取 Router
  const router = injector.get(Router);
  // 導航到/login
  router.navigate(['/login']);
}



const routes : Routes = [
  {path:'order-history',component:OrderHistoryComponent,canActivate:[OktaAuthGuard],data:{onAuthRequired:sendToLoginPage}},

  {path:'members',component:MemberPageComponent,canActivate:[OktaAuthGuard],data:{onAuthRequired:sendToLoginPage}},

  {path:'login/callback',component:OktaCallbackComponent},
  {path:'login',component:LoginComponent},

  {path:'checkout',component:CheckoutComponent},
  {path:'cart-details',component:CartDetailsComponent},
  {path:'products/:id',component:ProductDetailsComponent},
  {path:'search/:keyword',component:ProductListComponent},
  {path:'category/:id',component:ProductListComponent},
  {path:'category',component:ProductListComponent},
  {path:'products',component:ProductListComponent},
  {path:'',redirectTo:'/products',pathMatch:'full' },
  {path:'**',redirectTo:'/products',pathMatch:'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    MemberPageComponent,
    OrderHistoryComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    OktaAuthModule
  ],



  providers: [ProductService ,{ provide: OKTA_CONFIG, useValue:{oktaAuth}},
    // 讓 AuthInterceptorService 這個攔截器（Interceptor）在 HttpClient 發送請求時生效
    // provide: HTTP_INTERCEPTORS : 註冊一個HTTP攔截器
    // useClass:AuthInterceptorService : 使用 AuthInterceptorService 來攔截 HTTP 請求
    // multi: true : 這表示 允許多個 HTTP 攔截器
              {provide: HTTP_INTERCEPTORS,useClass:AuthInterceptorService,multi:true}
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
