package com.ecommerce.DTO;

import lombok.Data;

@Data
public class StripePaymentInfo {
    //多少錢
    private int amount;
    //幣值
    private String currency;
}
