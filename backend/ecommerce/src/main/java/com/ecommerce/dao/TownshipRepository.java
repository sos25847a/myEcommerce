package com.ecommerce.dao;

import com.ecommerce.entity.Township;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;


@Repository
public interface TownshipRepository extends JpaRepository<Township, Long> {
    List<Township> findByCityId(@Param("id") long id);
}
