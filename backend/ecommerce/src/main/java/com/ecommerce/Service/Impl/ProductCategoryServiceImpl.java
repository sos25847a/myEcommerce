package com.ecommerce.Service.Impl;

import com.ecommerce.Service.ProductCategoryService;
import com.ecommerce.dao.ProductCategoryRepository;
import com.ecommerce.entity.ProductCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ProductCategoryServiceImpl implements ProductCategoryService {

    private final ProductCategoryRepository productCategoryRepository;

    @Autowired
    public ProductCategoryServiceImpl(ProductCategoryRepository productCategoryRepository){
        this.productCategoryRepository = productCategoryRepository;
    }

    @Override
    public List<ProductCategory> findAll() {
        return productCategoryRepository.findAllByOrderByIdAsc();
    }
}
