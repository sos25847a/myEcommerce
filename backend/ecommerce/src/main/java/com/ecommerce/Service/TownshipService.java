package com.ecommerce.Service;

import com.ecommerce.entity.Township;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TownshipService {
    public List<Township> findByCityId(Long id);
}
