package com.ecommerce.controller;

import com.ecommerce.Service.Impl.ProductCategoryServiceImpl;
import com.ecommerce.Service.ProductCategoryService;
import com.ecommerce.entity.ProductCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductCategoryController {

    private final ProductCategoryService productCategoryService;

    @Autowired
    public ProductCategoryController(ProductCategoryServiceImpl productCategoryService){
        this.productCategoryService = productCategoryService;
    }

    @GetMapping("/product-category")
    public  List<ProductCategory> categories(){
        return productCategoryService.findAll();

    }

}
