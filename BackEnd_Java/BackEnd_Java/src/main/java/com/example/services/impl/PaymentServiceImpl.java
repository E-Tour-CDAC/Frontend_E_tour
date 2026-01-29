package com.example.services.impl;

import com.example.dto.PaymentDTO;
import com.example.entities.BookingHeader;
import com.example.entities.PaymentMaster;
import com.example.repositories.BookingRepository;
import com.example.repositories.PaymentRepository;
import com.example.services.PaymentService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;

@Service
public class PaymentServiceImpl implements PaymentService {

    private static final Logger log =
            LoggerFactory.getLogger(PaymentServiceImpl.class);

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository,
                              BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    @Transactional
    public PaymentMaster makePayment(Integer bookingId,
                                     String paymentMode,
                                     String transactionRef,
                                     String paymentStatus,
                                     String paymentAmount) {

        log.info("Starting payment processing | bookingId={} | transactionRef={}",
                bookingId, transactionRef);

        // 1️⃣ Fetch booking
        BookingHeader booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> {
                    log.warn("Booking not found | bookingId={}", bookingId);
                    return new RuntimeException("Booking not found");
                });

        // 2️⃣ Check existing successful payment
        if (paymentRepository.existsByBooking_IdAndPaymentStatus(bookingId, "SUCCESS")) {
            log.warn("Payment already completed | bookingId={}", bookingId);
            throw new RuntimeException("Payment already completed for this booking");
        }

        // 3️⃣ Duplicate transaction check
        paymentRepository.findByTransactionRef(transactionRef)
                .ifPresent(p -> {
                    log.warn("Duplicate transaction reference detected | transactionRef={}",
                            transactionRef);
                    throw new RuntimeException("Duplicate transaction reference");
                });

        // 4️⃣ Amount validation
        BigDecimal payAmount = new BigDecimal(paymentAmount);
        if (booking.getTotalAmount() == null ||
                payAmount.compareTo(booking.getTotalAmount()) != 0) {

            log.warn("Payment amount mismatch | bookingId={} | expected={} | received={}",
                    bookingId, booking.getTotalAmount(), payAmount);

            throw new RuntimeException("Payment amount mismatch");
        }

        // 5️⃣ Create payment entity
        PaymentMaster payment = new PaymentMaster();
        payment.setBooking(booking);
        payment.setPaymentMode(paymentMode);
        payment.setTransactionRef(transactionRef);
        payment.setPaymentStatus(paymentStatus);
        payment.setPaymentAmount(payAmount);
        payment.setPaymentDate(Instant.now());

        // 6️⃣ Save payment
        PaymentMaster savedPayment = paymentRepository.save(payment);

        log.info("Payment saved successfully | paymentId={} | bookingId={}",
                savedPayment.getId(), bookingId);

        return savedPayment;
    }

    @Override
    public PaymentMaster getPaymentById(Integer paymentId) {

        log.debug("Fetching payment by ID | paymentId={}", paymentId);

        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> {
                    log.warn("Payment not found | paymentId={}", paymentId);
                    return new RuntimeException("Payment not found");
                });
    }

    @Override
    public PaymentMaster getSuccessfulPayment(Integer bookingId) {

        log.debug("Fetching successful payment | bookingId={}", bookingId);

        return paymentRepository.findByBooking_Id(bookingId)
                .stream()
                .filter(p -> "SUCCESS".equalsIgnoreCase(p.getPaymentStatus()))
                .findFirst()
                .orElseThrow(() -> {
                    log.warn("No successful payment found | bookingId={}", bookingId);
                    return new RuntimeException("No successful payment found");
                });
    }

    public PaymentDTO mapToDTO(PaymentMaster payment) {

        log.debug("Mapping PaymentMaster to PaymentDTO | paymentId={}",
                payment.getId());

        PaymentDTO dto = new PaymentDTO();
        dto.setPaymentId(payment.getId());
        dto.setPaymentAmount(payment.getPaymentAmount());
        dto.setPaymentStatus(payment.getPaymentStatus());
        dto.setPaymentMode(payment.getPaymentMode());
        dto.setTransactionRef(payment.getTransactionRef());
        dto.setPaymentDate(payment.getPaymentDate());

        if (payment.getBooking() != null) {
            dto.setBookingId(payment.getBooking().getId());
        }

        return dto;
    }
}
