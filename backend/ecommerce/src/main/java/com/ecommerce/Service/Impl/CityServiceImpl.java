package com.ecommerce.Service.Impl;

import com.ecommerce.Service.CityService;
import com.ecommerce.dao.CityRepository;
import com.ecommerce.entity.City;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CityServiceImpl implements CityService {

    private final CityRepository cityRepository;
    @Autowired
    public CityServiceImpl(CityRepository cityRepository){
        this.cityRepository = cityRepository;
    }

    @Override
    public List<City> findAll() {
        return this.cityRepository.findAll();
    }
}
