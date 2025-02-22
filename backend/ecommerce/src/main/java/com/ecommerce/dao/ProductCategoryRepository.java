package com.ecommerce.dao;

import com.ecommerce.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;


import java.util.List;

@Repository
public interface ProductCategoryRepository  extends JpaRepository<ProductCategory, Long> {
    public List<ProductCategory> findAllByOrderByIdAsc();
}
