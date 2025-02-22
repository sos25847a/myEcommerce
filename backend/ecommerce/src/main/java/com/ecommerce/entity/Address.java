package com.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="address")
@Data
public class Address {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "city")
    private String city;

    @Column(name = "township")
    private String township;

    @Column(name = "zip_code")
    private String zipCode;

    @OneToOne
    @PrimaryKeyJoinColumn
    private Order order;


}
