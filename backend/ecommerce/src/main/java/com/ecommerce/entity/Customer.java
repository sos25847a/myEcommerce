package com.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;


import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="customer")
@Setter
@Getter
public class Customer {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name="id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "phone_number")
    private String phoneNumber;

    @OneToMany(mappedBy = "customer" , cascade = CascadeType.ALL)
    private Set<Order> order = new HashSet<>();



    public void addOrder(Order theOrder) {
        if(theOrder != null) {
            if(order==null){
                order = new HashSet<>();
            }
            order.add(theOrder);
            theOrder.setCustomer(this);
        }
    }
}
