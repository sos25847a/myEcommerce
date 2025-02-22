package com.ecommerce.controller;

import com.ecommerce.DTO.Buy;
import com.ecommerce.DTO.BuyResponse;
import com.ecommerce.DTO.StripePaymentInfo;
import com.ecommerce.Service.CheckoutService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {
    private final CheckoutService  checkoutService;

    @Autowired
    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/buy")
    public BuyResponse placeOrder(@RequestBody Buy buy){
        BuyResponse buyResponse = checkoutService.placeOrder(buy);
        return buyResponse;
    }

    @PostMapping("/stripePayment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody StripePaymentInfo stripePaymentInfo) throws StripeException {
        PaymentIntent paymentIntent = checkoutService.createPaymentIntent(stripePaymentInfo);

        String paymentStr = paymentIntent.toJson();

        return new ResponseEntity<>(paymentStr, HttpStatus.OK);
    }
}
