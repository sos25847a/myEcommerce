import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-gird.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {


  products:Product[]=[];
  currentCategoryId:number=1;
  previousCategoryId: number=1;
  searchMode:boolean=false;

  //定義paginate屬性
  thePageNumber :number = 1;
  thePageSize:number = 5;
  theTotalElements:number=0;
  pageSize: number = 5;
  previousKeyword:string="";

  

  constructor(private productService:ProductService,
              private route:ActivatedRoute,
              private cartService:CartService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }


  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
  }

  handleSearchProducts(){
    const theKeyword:string = this.route.snapshot.paramMap.get('keyword')!;

    //如果有跟之前不一樣不同的keyword,設定thePageNumber=1
    if(this.previousKeyword != theKeyword){
      this.thePageNumber=1;
    }

    // 追蹤keyword已經搜尋過的在下一次搜尋時，變成先前搜尋的
    this.previousKeyword=theKeyword;

    console.log(`keyword=${theKeyword},thePageNumber=${this.thePageNumber}`);
    

    //根據keyword新搜尋
    this.productService.searchProductsPaginate(this.thePageNumber-1,
                                               this.thePageSize,
                                               theKeyword).subscribe(this.processResult());
  }



  handleListProducts(){
    // 檢查id是否存在
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if(hasCategoryId){
      // 將id用+號從string轉成number
      this.currentCategoryId=+this.route.snapshot.paramMap.get('id')!;
    }else{
      //如果沒有這個id預設為1
      this.currentCategoryId=1;
    }

    // 確認是否有不同於之前的Category id
    // 注意: Angular不是每次都會生成一個新的元件
    // 如果目前瀏覽器正在查看該元件，將會重複使用該元件


    // 如果我們有不同於之前的Category id
    // 要重製thePageNumber回到1
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber=1;
    }
    // 這次使用的Category id 在下次使用時會變成先前的,這邊把它存到先前的Category id
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId},thePageNumber=${this.thePageNumber}`);
    
    // 根據Category id 獲取該product
    this.productService.getProductListPaginate(this.thePageNumber-1,
                                               this.thePageSize,
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());
  }

  // 指定一頁展示幾個商品大小
  updatePageSize(pageSize :string){
      this.thePageSize = +pageSize;
      // 因為選擇完大小,將頁數條回1
      this.thePageNumber = 1;
      // 再根據選擇的一頁商品大小，顯示商品
      this.listProducts(); 
  }
  processResult(){
    return(data:any)=>{
      this.products = data._embedded.products;
      this.thePageNumber=data.page.number+1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);
    
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }
}
