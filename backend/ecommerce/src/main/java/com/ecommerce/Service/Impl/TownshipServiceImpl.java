package com.ecommerce.Service.Impl;

import com.ecommerce.Service.TownshipService;
import com.ecommerce.dao.TownshipRepository;
import com.ecommerce.entity.Township;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class TownshipServiceImpl implements TownshipService {

    private final TownshipRepository townshipRepository;
    @Autowired
    public TownshipServiceImpl(TownshipRepository townshipRepository){
        this.townshipRepository = townshipRepository;
    }

    @Override
    public List<Township> findByCityId(Long id) {
        return townshipRepository.findByCityId(id);
    }
}
