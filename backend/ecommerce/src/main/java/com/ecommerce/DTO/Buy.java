package com.ecommerce.DTO;

import com.ecommerce.entity.Address;
import com.ecommerce.entity.Customer;
import com.ecommerce.entity.OrderItem;
import com.ecommerce.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Buy {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems ;


}
