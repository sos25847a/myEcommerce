package com.ecommerce.controller;

import com.ecommerce.Service.TownshipService;
import com.ecommerce.entity.Township;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TownshipController {

    private final TownshipService townshipService;

    public TownshipController(TownshipService townshipService){
        this.townshipService = townshipService;
    }

    @GetMapping("/township/findByCityId")
    public List<Township> findByCityId(@Param("id") Long id){
        return townshipService.findByCityId(id);
    }
}
