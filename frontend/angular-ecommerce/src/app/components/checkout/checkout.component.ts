import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Buy } from 'src/app/common/buy';
import { City } from 'src/app/common/city';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { StripePaymentInfo } from 'src/app/common/stripe-payment-info';
import { Township } from 'src/app/common/township';
import { CartService } from 'src/app/service/cart.service';
import { CheckoutService } from 'src/app/service/checkout.service';
import { ShopFormService } from 'src/app/service/shop-form.service';
import { ShopValidators } from 'src/app/validators/shop-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {



  totalQuantity:number=0;
  totalPrice:number=0;

  checkoutFormGroup!:FormGroup;

  creditCardYears:number[]=[];
  creditCardMonths:number[]=[];

  city:City[] = [];

  storage:Storage = localStorage;
  

  shippingAddressTownship:Township[] = [];
  billingAddressTownship:Township[] = [];

  // 初始化stripe API
  stripe = Stripe(environment.stripePublicKey);

  stripePaymentInfo:StripePaymentInfo = new StripePaymentInfo();
  cardElement: any;
  displayError: any = "";
  // 定義接收訊息開關，避免一直接收
  isDisabled:boolean = false;

  constructor(private formBuilder:FormBuilder,
              private shopFormService:ShopFormService,
              private cartService:CartService,
              private checkoutService:CheckoutService,
              private router :Router) { }

  ngOnInit(): void {

    // 設定stripe表單
    this.setupStripePaymentForm();


    this.reviewOrder();
    
    // 從瀏覽器或的用戶手機
    const thePhoneNumber = JSON.parse(this.storage.getItem('userPhoneNumber')!);

    this.checkoutFormGroup = this.formBuilder.group({
      customer:this.formBuilder.group({
        name: new FormControl('', [
          Validators.required,       // 必填
          Validators.minLength(2),   // 最少 2 個字
          ShopValidators.notWhitespace  // 自訂驗證器：不能有空白
        ]),
        phoneNumber: new FormControl(thePhoneNumber,[Validators.required,Validators.pattern(/^09\d{8}$/)])
      }),
      shippingAddress : this.formBuilder.group({
        city: new FormControl('', [Validators.required]),        // 必填 
        township: new FormControl('', [Validators.required]),// 必填 
        zipCode: new FormControl('', [Validators.required]),
        address:new FormControl('', [
          Validators.required,       // 必填  
          ShopValidators.notWhitespace  // 自訂驗證器：不能有空白
        ]),
      }),
      billingAddress : this.formBuilder.group({
        city: new FormControl('', [Validators.required]),        // 必填 
        township: new FormControl('', [Validators.required]),// 必填 
        zipCode: new FormControl('', [Validators.required]),
        address:new FormControl('', [
          Validators.required,       // 必填  
          ShopValidators.notWhitespace  // 自訂驗證器：不能有空白
        ]),
      }),
      creditCard : this.formBuilder.group({
        // cardType: new FormControl('', [Validators.required]),
        // nameOnCard: new FormControl('', [Validators.required ,ShopValidators.notWhitespace]),
        // cardNumber: new FormControl('', [Validators.required ,Validators.pattern('[0-9]{16}')]),
        // securityCode: new FormControl('', [Validators.required ,Validators.pattern('[0-9]{3}')]),
        // expirationYear: [''],
        // expirationMonth: ['']
      })
    });
  

  // 填充city
    this.shopFormService.getCity().subscribe(
      data=>{
        this.city=data;
      }
    );

    console.log(this.city.length);
  }


  // 設置stripe表單
  setupStripePaymentForm() {
    // 獲取stripe element
    var elements = this.stripe.elements();

    // 建造一個card element，且隱藏郵遞區號
    this.cardElement = elements.create('card',{hidePostalCode:true});

    // 將card UI 組件 加到 'card-element' div
    this.cardElement.mount('#card-element');

    // 在card element 新增事件綁定
    this.cardElement.on('change',(event:any) =>{

      // 獲取card-error元素
      this.displayError = document.getElementById("card-errors");

      // 如果事件完成，設置顯示內容為空字符串
      if(event.complete){
        this.displayError.textContent = "";
        // 如果觸發事件(error)，顯示錯誤訊息
      }else if(event.error){
        // 顯示錯誤訊息
        this.displayError.textContent = event.error.message;
      }


    });
  }


  

  // 提交按鈕
  onSubmit(){
    let thePhoneNumber = this.handleCustomerPhoneNumber();
    this.checkoutService.setPhoneNumber(thePhoneNumber);
    //  當整個表單驗證失敗
    if(this.checkoutFormGroup.invalid){
      // 將整個表單的所有欄位標記為 "已觸碰"（touched）。
      // 當欄位被標記為 touched，如果該欄位有驗證錯誤，錯誤訊息就會馬上顯示
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // 設定order的值
    // 新的訂單內容
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    // 獲取購物車內容
    const cartItems = this.cartService.cartItem;
    // 從購物車內容拿到訂單內容
    let orderItems : OrderItem[] = [];
    for(let i =0;i<cartItems.length;i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    // 設定buy
    let buy = new Buy();


    // buy填上customer資訊
    buy.customer = this.checkoutFormGroup.controls['customer'].value;
    


    // buy填上shippingAddress資訊
    buy.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;

    
    const shippingTownship:Township = JSON.parse(JSON.stringify(buy.shippingAddress.township));// JSON.stringify(...) 會將...轉成 JSON 字串。
    const shippingCity:City = JSON.parse(JSON.stringify(buy.shippingAddress.city)); // JSON.parse(...) 會將該 JSON 字串解析回新的物件
    // 提取township跟city的名字
    buy.shippingAddress.township = shippingTownship.name;
    buy.shippingAddress.city = shippingCity.name; 

    // buy填上billingAddress資訊
    buy.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingTownship:Township = JSON.parse(JSON.stringify(buy.billingAddress.township))// JSON.stringify(...) 會將...轉成 JSON 字串。
    const billingCity:City = JSON.parse(JSON.stringify(buy.billingAddress.city)) // JSON.parse(...) 會將該 JSON 字串解析回新的物件
    // 提取township跟city的名字
    buy.billingAddress.township = billingTownship.name;
    buy.billingAddress.city = billingCity.name; 


    // buy填上order和orderItem資訊
    buy.order = order;
    buy.orderItems = orderItems;

    // stripePaymentInfo初始化
    this.stripePaymentInfo.amount = this.totalPrice;
    this.stripePaymentInfo.currency = "TWD"
    


    // 如果表單不為空，且stripe沒有錯誤
    if(!this.checkoutFormGroup.invalid && this.displayError.textContent===""){
      // 開啟接收訊息開關
      this.isDisabled=true;


      // 創建payment intent
      this.checkoutService.createStripePaymentIntent(this.stripePaymentInfo).subscribe(
        (paymentIntentResponse)=>{
          console.log("Stripe Payment Intent Response:", paymentIntentResponse);
          // confirmCardPayment()將信用卡數據直接發送到stripe server
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            { 
              // 付費相關訊息
              payment_method: {
                // 信用卡訊息
                card: this.cardElement,
                billing_details:{
                  name: buy.customer.name,
                  phone: buy.customer.phoneNumber,
                  address: {
                    city: buy.billingAddress.city,
                    line2:buy.billingAddress.township,
                    postal_code:buy.billingAddress.zipCode
                  }
                }
              }
              // 確認是否成功
            },{handleActions:false}).then((result:any)=>{
              if(result.error){
                // 顯示錯誤給用戶
                alert(`出現錯誤: ${result.error.message}`)

                // 關閉接收訊息開關
                this.isDisabled=false;

                // 如果沒有錯誤(代表成功)
              }else{
                // call REST API 透過checkoutService調用
                // 從後端 rest api 拿到存在資料庫的order
                this.checkoutService.placeOrder(buy).subscribe({
                  // 成功
                  next:(response:any)=>{alert(`已收到您的訂單\n訂單編號為:${response.orderTrackingNumber}`);
                  console.log("api re", response);
                  

                  // 重製購物車
                  this.restCart()
                  // 關閉接收訊息開關
                  this.isDisabled=false;
                  },

                  // 錯誤
                  error:(err:any)=>{alert(`發生錯誤: ${err.message}`);
                  this.isDisabled=false;
                  
                }

                });
              }

            })
        }
      );

    // 如果表單有沒填的，標記整個表單為 已接觸 (touched)，讓驗證錯誤訊息立即顯示
    }else{
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }

  handleCustomerPhoneNumber():string{
    // 從表單獲得phoneNumber
    let thePhoneNumber = this.checkoutFormGroup.controls['customer'].value.phoneNumber;
    console.log('Retrieved phone number:', thePhoneNumber);  
    return thePhoneNumber;
  }

  // 重製購物車
  restCart() {
    // 重製購物車數據
    this.cartService.cartItem = [];
    this.cartService.totalQuantity.next(0);
    this.cartService.totalPrice.next(0);
    // 將購物車清空後，保留清空後的購物車內容
    this.cartService.persistCartItems();

    // 重製表單數據
    this.checkoutFormGroup.reset();
    // 跳回主頁面
    this.router.navigateByUrl("/products")
  }


  // getter方法
  // customer
  get name(){return this.checkoutFormGroup.get('customer.name');}
  get phoneNumber(){return this.checkoutFormGroup.get('customer.phoneNumber');}
// shippingAddress
  get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressZipcode(){return this.checkoutFormGroup.get('shippingAddress.zipcode');}
  get shippingAddressAddress(){return this.checkoutFormGroup.get('shippingAddress.address');}
  get shippingAddressTownshipControl(){return this.checkoutFormGroup.get('shippingAddress.township');}
  // billingAddress
  get billingAddressCity(){return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressZipcode(){return this.checkoutFormGroup.get('billingAddress.zipcode');}
  get billingAddressAddress(){return this.checkoutFormGroup.get('billingAddress.address');}
  get billingAddressTownshipControl(){return this.checkoutFormGroup.get('billingAddress.township');}
  // creditCard
  get cardType(){return this.checkoutFormGroup.get('creditCard.cardType')}
  get nameOnCard(){return this.checkoutFormGroup.get('creditCard.nameOnCard')}
  get cardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber')}
  get securityCode(){return this.checkoutFormGroup.get('creditCard.securityCode')}


  // 送貨地址與帳單地址一致
  copyShippingAddressToBillingAddress(event: Event) {
    // 指定checkbox類型為html元素
    const checkbox = event.target as HTMLInputElement;
    
    if (checkbox.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      
      // 設定township
      this.billingAddressTownship = this.shippingAddressTownship;
    } else {
      // 重設billingAddress
      this.checkoutFormGroup.controls['billingAddress'].reset();
      
      // 重設township
      this.billingAddressTownship = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard')

    const currentYear:number = new Date().getFullYear();
    const selectYear:number = Number(creditCardFormGroup!.value.creditCard)
    
    // 比較是不是當前年分 如果是從現在的月份開始
    let startMonth:number;
    if(currentYear==selectYear){
      startMonth = new Date().getMonth()+1;
    }
    // 不是當前年分,從1月開始
    else{
      startMonth = 1;
    }
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data =>{
        console.log("紀錄信用卡年份"+JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
  }
  getTownship(formGroupName:string) {

     const formGroup = this.checkoutFormGroup.get(formGroupName);

     const cityId = formGroup?.value.city.id;
     const cityName = formGroup?.value.city.name;

     console.log(`${formGroupName} city id : ${cityId}`);
     console.log(`${formGroupName} city name : ${cityName}`);
     
     this.shopFormService.getTownship(cityId).subscribe(
      data=>{

        if(formGroupName=='shippingAddress'){
          this.shippingAddressTownship = data;
        }else{
          this.billingAddressTownship = data;
        }
        // 默認選擇第一個
        formGroup?.get('township')?.setValue(data[0]);
      }
     );
    }

    // 處理checkout之後訂單詳情
    reviewOrder(){
      //subscribe價格
      this.cartService.totalPrice.subscribe(
        data=>{
          this.totalPrice = data;
        }
      );
      //subscribe數量
      this.cartService.totalQuantity.subscribe(
        data =>{
          this.totalQuantity = data
        }
      );
    }
}
