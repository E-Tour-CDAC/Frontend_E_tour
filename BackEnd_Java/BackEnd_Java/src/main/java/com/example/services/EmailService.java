package com.example.services;


public interface EmailService {

    void sendSimpleEmail(String toEmail, String subject, String body);

    void sendBookingConfirmation(String toEmail, String name, Long confirmationNo);

    void sendInvoiceWithAttachment(String toEmail, String name, Long invoiceNo, byte[] pdfBytes);
}

