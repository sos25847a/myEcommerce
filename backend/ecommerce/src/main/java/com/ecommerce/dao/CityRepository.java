package com.ecommerce.dao;

import com.ecommerce.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;


@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    public List<City> findAllByOrderByIdAsc();
}
