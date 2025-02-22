package com.ecommerce.controller;


import com.ecommerce.Service.CityService;
import com.ecommerce.Service.Impl.CityServiceImpl;
import com.ecommerce.entity.City;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CityController {

    private final CityService cityService;
    @Autowired
    public CityController(CityServiceImpl cityService){
        this.cityService = cityService;
    }
    @GetMapping("/city")
    public List<City> findAll(){
        return this.cityService.findAll();
    }
}
