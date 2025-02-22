package com.ecommerce.Service.Impl;

import com.ecommerce.DTO.Buy;
import com.ecommerce.DTO.BuyResponse;
import com.ecommerce.DTO.StripePaymentInfo;
import com.ecommerce.Service.CheckoutService;
import com.ecommerce.dao.CustomerRepository;
import com.ecommerce.entity.Customer;
import com.ecommerce.entity.OrderItem;
import com.ecommerce.entity.Order;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService {

        private final CustomerRepository customerRepository;

        @Autowired
        public CheckoutServiceImpl(CustomerRepository customerRepository,
                                    @Value("${stripe.key.secret}") String secretKey) {
            this.customerRepository = customerRepository;

            //初始化stripe API 的secretKey
            Stripe.apiKey = secretKey;
        }

    @Override
    @Transactional
    public BuyResponse placeOrder(Buy buy) {
        //從DTO獲取該訂單
        Order order = buy.getOrder();
        //生成tracking number
        String orderTrackingNumber = generateTrackingNumber();
        //該訂單的TrackingNumber
        order.setOrderTrackingNumber(orderTrackingNumber);
        //把訂單內容放到訂單內
        Set<OrderItem> orderItems = buy.getOrderItems();
        orderItems.forEach(theItem -> order.addItem(theItem));
        //設定訂單的shippingAddress跟billingAddress
        order.setShippingAddress(buy.getShippingAddress());
        order.setBillingAddress(buy.getBillingAddress());
        order.setTownship(buy.getShippingAddress().getTownship());
        // 將這筆訂單（order）添加到該客戶（customer）名下
        Customer customer = buy.getCustomer();

        //確認此客戶是不是已經在資料庫有了
        String thePhoneNumber = customer.getPhoneNumber();
        Customer customerFromDB = customerRepository.findByPhoneNumber(thePhoneNumber);

        //如果有在資料庫中
        if(customerFromDB!=null){
            //找到了代表是同一個客戶，不需要存兩次
            customer =customerFromDB;
        }


        customer.addOrder(order);
        //將更新後的customer存到資料庫
        customerRepository.save(customer);
        //回傳Response
        return new BuyResponse(orderTrackingNumber);
    }

    @Override
    public PaymentIntent createPaymentIntent(StripePaymentInfo stripePaymentInfo) throws StripeException {

        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        //設定參數
        HashMap<String, Object> params = new HashMap<>();
        params.put("amount",stripePaymentInfo.getAmount());
        params.put("currency",stripePaymentInfo.getCurrency());
        params.put("payment_method_types",paymentMethodTypes);
        params.put("description","myShop purchase");
        return PaymentIntent.create(params);
    }

    //        使用UUID生成隨機的TrackingNumber
        private String generateTrackingNumber() {
            return UUID.randomUUID().toString();
        }
    }
