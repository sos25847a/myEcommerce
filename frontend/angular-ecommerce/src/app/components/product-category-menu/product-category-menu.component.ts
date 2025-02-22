import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories :ProductCategory[] = [];

  constructor(private productService :ProductService) { }

  ngOnInit(): void {
    this.listProductCategories();
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      (data) => {
        console.log('Received product categories:', data); // 輸出返回的資料
        this.productCategories = data;  // 將資料賦值給 productCategories
      },
      (error) => {
        console.error('Error fetching categories:', error);  // 錯誤處理
      }
    );
  }

}
