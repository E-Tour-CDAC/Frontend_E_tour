package com.example.services;

import com.example.entities.PaymentMaster;

public interface PaymentService {

    PaymentMaster makePayment(
            Integer bookingId,
            String paymentMode,
            String transactionRef,
            String paymentStatus,
            String paymentAmount
    );

    PaymentMaster getPaymentById(Integer paymentId);

    PaymentMaster getSuccessfulPayment(Integer bookingId);
}
