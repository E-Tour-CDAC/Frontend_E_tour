package com.example.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.services.InvoicePdfService;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoicePdfService invoiceService;

    public InvoiceController(InvoicePdfService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping("/{paymentId}/download")
    public ResponseEntity<byte[]> downloadInvoice(
            @PathVariable Integer paymentId) {

        byte[] pdf = invoiceService.generateInvoice(paymentId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=invoice_" + paymentId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}

