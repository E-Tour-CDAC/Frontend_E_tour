package com.example.services.impl;

import com.example.entities.BookingHeader;
import com.example.entities.PaymentMaster;
import com.example.repositories.PaymentRepository;
import com.example.services.EmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class EmailServiceImpl implements EmailService {

	private final JavaMailSender mailSender;
	private final PaymentRepository paymentRepository;

	@Value("${spring.mail.username}")
	private String FROM_EMAIL;

	public EmailServiceImpl(JavaMailSender mailSender, PaymentRepository paymentRepository) {

		this.mailSender = mailSender;
		this.paymentRepository = paymentRepository;
	}

	// ---------------- BASIC MAIL ----------------
	@Override
	public void sendSimpleEmail(String toEmail, String subject, String body) {

		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(FROM_EMAIL);
		message.setTo(toEmail);
		message.setSubject(subject);
		message.setText(body);

		mailSender.send(message);
	}

	// ---------------- BOOKING CONFIRMATION ----------------
	@Override
	public void sendBookingConfirmation(String toEmail, String name, Long paymentId) {

		// 🔥 Fetch payment
		PaymentMaster payment = paymentRepository.findById(paymentId.intValue())
				.orElseThrow(() -> new RuntimeException("Payment not found"));

		BookingHeader booking = payment.getBooking();

		String dbEmail = booking.getCustomer().getEmail();
		String dbName = booking.getCustomer().getFirstName();

		// 👇 DEBUG
		System.out.println("DEBUG email from DB = " + dbEmail);

		if (dbEmail == null || dbEmail.isBlank()) {
			throw new RuntimeException("Customer email not found in DB for paymentId = " + paymentId);
		}

		String subject = "Booking Confirmed: #" + booking.getId();

		String body = "Hello " + dbName + ",\n\n" + "Your booking has been successfully processed.\n" + "Booking ID: "
				+ booking.getId() + "\n\n" + "Thank you for choosing TourVista!";

		sendSimpleEmail(dbEmail, subject, body);
	}

	// ---------------- INVOICE MAIL (DB EMAIL) ----------------
	@Override
	public void sendInvoiceWithAttachment(String toEmail, String name, Long paymentId, byte[] pdfContent) {

		// 🔥 Fetch from DB
		PaymentMaster payment = paymentRepository.findById(paymentId.intValue())
				.orElseThrow(() -> new RuntimeException("Payment not found"));

		BookingHeader booking = payment.getBooking();

		String dbEmail = booking.getCustomer().getEmail();

		String dbName = booking.getCustomer().getFirstName();

		try {
			MimeMessage message = mailSender.createMimeMessage();

			MimeMessageHelper helper = new MimeMessageHelper(message, true);

			helper.setFrom(FROM_EMAIL);
			helper.setTo(dbEmail); // ✅ FROM TABLE
			helper.setSubject("Invoice - Booking #" + paymentId);

			helper.setText("Hello " + dbName + ",\n\n" + "Please find your attached invoice.\n\n"
					+ "Thank you for choosing TourVista!");

			helper.addAttachment("Invoice_" + paymentId + ".pdf", new ByteArrayResource(pdfContent));

			mailSender.send(message);

		} catch (MessagingException e) {
			throw new RuntimeException("Error sending email with invoice", e);
		}
	}

}
