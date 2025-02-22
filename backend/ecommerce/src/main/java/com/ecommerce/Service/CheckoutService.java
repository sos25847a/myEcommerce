package com.ecommerce.Service;

import com.ecommerce.DTO.Buy;
import com.ecommerce.DTO.BuyResponse;
import com.ecommerce.DTO.StripePaymentInfo;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
    BuyResponse placeOrder(Buy buy);

    PaymentIntent createPaymentIntent(StripePaymentInfo stripePaymentInfo) throws StripeException;
}
