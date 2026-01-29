package com.example.services.impl;

import com.example.dto.CreateOrderRequestDTO;
import com.example.dto.CreateOrderResponseDTO;
import com.example.entities.BookingHeader;
import com.example.entities.BookingStatusMaster;
import com.example.entities.PaymentMaster;
import com.example.repositories.BookingRepository;
import com.example.repositories.PaymentRepository;
import com.example.services.PaymentGatewayService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import jakarta.transaction.Transactional;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;

@Service
public class RazorpayServiceImpl implements PaymentGatewayService {

    private static final Logger log =
            LoggerFactory.getLogger(RazorpayServiceImpl.class);

    private final RazorpayClient razorpayClient;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    @Value("${razorpay.webhook.secret}")
    private String webhookSecret;

    public RazorpayServiceImpl(RazorpayClient razorpayClient,
                               BookingRepository bookingRepository,
                               PaymentRepository paymentRepository) {
        this.razorpayClient = razorpayClient;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
    }

    // ================= CONFIRM PAYMENT =================

    @Override
    @Transactional
    public void confirmPayment(String orderId, String paymentId, Long amount) {

        log.info("Confirm payment request | orderId={} | paymentId={}",
                orderId, paymentId);

        PaymentMaster payment = paymentRepository
                .findByTransactionRef(orderId)
                .orElseThrow(() -> {
                    log.warn("Payment not found for orderId={}", orderId);
                    return new RuntimeException("Payment not found");
                });

        if ("SUCCESS".equalsIgnoreCase(payment.getPaymentStatus())) {
            log.info("Payment already confirmed | orderId={}", orderId);
            return;
        }

        long expectedAmount = payment.getPaymentAmount()
                .multiply(BigDecimal.valueOf(100))
                .longValueExact();

        if (expectedAmount != amount) {
            log.error("Amount mismatch | orderId={} | expected={} | received={}",
                    orderId, expectedAmount, amount);
            throw new RuntimeException("Amount mismatch");
        }

        payment.setTransactionRef(paymentId);
        payment.setPaymentStatus("SUCCESS");
        payment.setPaymentDate(Instant.now());
        paymentRepository.save(payment);

        log.info("Payment marked SUCCESS | paymentId={} | bookingId={}",
                paymentId, payment.getBooking().getId());

        bookingRepository.updateBookingStatus(
                payment.getBooking().getId(),
                2 // CONFIRMED
        );

        log.info("Booking status updated to CONFIRMED | bookingId={}",
                payment.getBooking().getId());
    }

    // ================= CREATE ORDER =================

    @Override
    public CreateOrderResponseDTO createOrder(CreateOrderRequestDTO requestDTO) {

        log.info("Create Razorpay order | bookingId={}",
                requestDTO.getBookingId());

        BookingHeader booking = bookingRepository.findById(requestDTO.getBookingId())
                .orElseThrow(() -> {
                    log.warn("Booking not found | bookingId={}",
                            requestDTO.getBookingId());
                    return new RuntimeException("Booking not found");
                });

        // SUCCESS guard
        if (paymentRepository.existsByBooking_IdAndPaymentStatus(
                booking.getId(), "SUCCESS")) {

            log.warn("Payment already completed | bookingId={}",
                    booking.getId());
            throw new RuntimeException("Payment already completed");
        }

        // INITIATED reuse
        Optional<PaymentMaster> initiated =
                paymentRepository.findByBooking_IdAndPaymentStatus(
                        booking.getId(), "INITIATED");

        if (initiated.isPresent()) {

            PaymentMaster p = initiated.get();

            long amount = p.getPaymentAmount()
                    .multiply(BigDecimal.valueOf(100))
                    .longValueExact();

            log.info("Reusing INITIATED order | orderId={} | bookingId={}",
                    p.getTransactionRef(), booking.getId());

            return new CreateOrderResponseDTO(
                    p.getTransactionRef(),
                    amount,
                    "INR"
            );
        }

        long amountInPaise = booking.getTotalAmount()
                .multiply(BigDecimal.valueOf(100))
                .longValueExact();

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "BOOKING_" + booking.getId());

        try {
            log.debug("Calling Razorpay API | bookingId={} | amount={}",
                    booking.getId(), amountInPaise);

            Order order = razorpayClient.orders.create(orderRequest);

            PaymentMaster payment = new PaymentMaster();
            payment.setBooking(booking);
            payment.setPaymentAmount(booking.getTotalAmount());
            payment.setPaymentMode("RAZORPAY");
            payment.setPaymentStatus("INITIATED");
            payment.setTransactionRef(order.get("id"));
            payment.setPaymentDate(Instant.now());

            paymentRepository.save(payment);

            log.info("Razorpay order created | orderId={} | bookingId={}",
                    order.get("id"), booking.getId());

            return new CreateOrderResponseDTO(
                    order.get("id"),
                    amountInPaise,
                    "INR"
            );

        } catch (Exception e) {
            log.error("Razorpay order creation failed | bookingId={}",
                    booking.getId(), e);
            throw new RuntimeException("Razorpay order creation failed", e);
        }
    }

    // ================= WEBHOOK =================

    @Override
    @Transactional
    public void handleWebhook(String payload, String signature) {

        log.info("Razorpay webhook received");

        try {
            JSONObject json = new JSONObject(payload);

            if (!"payment.captured".equals(json.optString("event"))) {
                log.debug("Ignoring webhook event | event={}",
                        json.optString("event"));
                return;
            }

            JSONObject entity = json.getJSONObject("payload")
                    .getJSONObject("payment")
                    .getJSONObject("entity");

            String razorpayOrderId = entity.getString("order_id");
            String razorpayPaymentId = entity.getString("id");
            long amount = entity.getLong("amount");

            log.info("Processing webhook | orderId={} | paymentId={}",
                    razorpayOrderId, razorpayPaymentId);

            PaymentMaster payment = paymentRepository
                    .findByTransactionRef(razorpayOrderId)
                    .orElseThrow(() -> {
                        log.warn("Payment not found for webhook | orderId={}",
                                razorpayOrderId);
                        return new RuntimeException("Payment not found");
                    });

            if ("SUCCESS".equalsIgnoreCase(payment.getPaymentStatus())) {
                log.info("Webhook ignored (idempotent) | orderId={}",
                        razorpayOrderId);
                return;
            }

            long expected = payment.getPaymentAmount()
                    .multiply(BigDecimal.valueOf(100))
                    .longValueExact();

            if (expected != amount) {
                log.error("Webhook amount mismatch | orderId={} | expected={} | received={}",
                        razorpayOrderId, expected, amount);
                throw new RuntimeException("Amount mismatch");
            }

            payment.setTransactionRef(razorpayPaymentId);
            payment.setPaymentStatus("SUCCESS");
            payment.setPaymentDate(Instant.now());
            paymentRepository.save(payment);

            BookingHeader booking = payment.getBooking();
            BookingStatusMaster status = new BookingStatusMaster();
            status.setId(2); // CONFIRMED
            booking.setStatus(status);

            bookingRepository.save(booking);

            log.info("Webhook processed successfully | bookingId={} | paymentId={}",
                    booking.getId(), razorpayPaymentId);

        } catch (Exception e) {
            log.error("Webhook processing failed", e);
            throw new RuntimeException("Webhook processing failed", e);
        }
    }
}
