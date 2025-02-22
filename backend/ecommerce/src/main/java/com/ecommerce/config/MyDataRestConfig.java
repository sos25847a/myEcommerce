package com.ecommerce.config;

import com.ecommerce.entity.*;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

 

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;
    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager) {
        entityManager = theEntityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        //禁用PUT POST DELETE
        HttpMethod[] theUnsupportedActions = {HttpMethod.PUT,HttpMethod.POST,HttpMethod.DELETE,HttpMethod.PATCH};

        disableHttpMethods(Product.class, config, theUnsupportedActions);
        disableHttpMethods(ProductCategory.class, config, theUnsupportedActions);
        disableHttpMethods(City.class, config, theUnsupportedActions);
        disableHttpMethods(Township .class, config, theUnsupportedActions);
        disableHttpMethods(Order.class,config,theUnsupportedActions);
        config.exposeIdsFor(Product.class, ProductCategory.class, City.class, Township.class, Order.class);
        //設定 CORS 所有 api/ 開頭的路徑 都會受到這個 CORS 設定影響
        cors.addMapping("/api/**").allowedOrigins("https://localhost:4200");
    }

    private void disableHttpMethods(Class theClass ,RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }
}



