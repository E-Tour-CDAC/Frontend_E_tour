package com.example.controller;

import org.springframework.web.bind.annotation.*;

import com.example.services.EmailService;
import com.example.services.InvoicePdfService;


//
@RestController
@RequestMapping("/api/email")
public class EmailController {

    private final EmailService emailService;

    private final InvoicePdfService invoicePdfService;

    public EmailController(EmailService emailService,
                           InvoicePdfService invoicePdfService) {
        this.emailService = emailService;
        this.invoicePdfService = invoicePdfService;
    }

    // TEST booking mail (kept as-is)
    @PostMapping("/test-confirmation")
    public String testEmail(@RequestParam Integer paymentId) {

        emailService.sendBookingConfirmation(
                null,
                null,
                paymentId.longValue());

        return "Booking confirmation email sent using DB email for paymentId = "
                + paymentId;
    }

    // 🔥 Invoice email — DB email will be used
    @PostMapping("/test-invoice")
    public String testInvoice(@RequestParam Integer paymentId) {

        byte[] simulatedPdf = invoicePdfService.generateInvoice(paymentId);

        emailService.sendInvoiceWithAttachment(
                null,
                null,
                paymentId.longValue(),
                simulatedPdf);

        return "Invoice PDF sent using DB email for paymentId = " + paymentId;
    }
}
