package com.example.controller;


import com.example.dto.CreateOrderRequestDTO;
import com.example.dto.CreateOrderResponseDTO;
import com.example.services.PaymentGatewayService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment-gateway")
public class PaymentGatewayController {

    private static final Logger log =
            LoggerFactory.getLogger(PaymentGatewayController.class);

    private final PaymentGatewayService paymentGatewayService;

    public PaymentGatewayController(PaymentGatewayService paymentGatewayService) {
        this.paymentGatewayService = paymentGatewayService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<CreateOrderResponseDTO> createOrder(
            @RequestBody CreateOrderRequestDTO requestDTO) {

        // ✅ Correct logging (DTO has only bookingId)
        log.info("Create order request received | bookingId={}",
                requestDTO.getBookingId());

        CreateOrderResponseDTO response =
                paymentGatewayService.createOrder(requestDTO);

        log.info("Order created successfully | orderId={}",
                response.getOrderId());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/confirm-payment")
    public ResponseEntity<String> confirmPayment(
            @RequestParam String orderId,
            @RequestParam String paymentId,
            @RequestParam Long amount) {

        log.info("Confirm payment request | orderId={} | paymentId={} | amount={}",
                orderId, paymentId, amount);

        paymentGatewayService.confirmPayment(orderId, paymentId, amount);

        log.info("Payment confirmed | orderId={} | paymentId={}",
                orderId, paymentId);

        return ResponseEntity.ok("Payment confirmed");
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {

        log.info("Webhook received from Razorpay");

        try {
            paymentGatewayService.handleWebhook(payload, signature);
            log.info("Webhook processed successfully");
        } catch (Exception e) {
            // Razorpay requires HTTP 200 always
            log.error("Webhook processing failed", e);
        }

        return ResponseEntity.ok("OK");
    }
}
