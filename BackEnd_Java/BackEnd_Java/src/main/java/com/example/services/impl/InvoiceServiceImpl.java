package com.example.services.impl;


import com.example.services.InvoicePdfService;
import org.springframework.stereotype.Service;

import com.example.entities.BookingHeader;
import com.example.entities.PaymentMaster;
import com.example.repositories.PaymentRepository;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfCell;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;

@Service
@Transactional
public class InvoiceServiceImpl implements InvoicePdfService {

    private final PaymentRepository paymentRepo;

    public InvoiceServiceImpl(PaymentRepository paymentRepo) {
        this.paymentRepo = paymentRepo;
    }

    @Override
    public byte[] generateInvoice(Integer paymentId) {

        PaymentMaster payment = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (!"SUCCESS".equalsIgnoreCase(payment.getPaymentStatus())) {
            throw new RuntimeException("Payment not successful");
        }

        BookingHeader booking = payment.getBooking();

        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, out);
            document.open();

            // ===== Fonts =====
            Font titleFont = new Font(Font.HELVETICA, 24, Font.BOLD, Color.BLUE);
            Font boldFont = new Font(Font.HELVETICA, 11, Font.BOLD);
            Font normalFont = new Font(Font.HELVETICA, 11);

            // ===== Header =====
            Paragraph header = new Paragraph("VirtuGo Invoice", titleFont);
            header.setAlignment(Element.ALIGN_CENTER);
            header.setSpacingAfter(20);
            document.add(header);

            // ===== Company + Billing Info =====
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setWidths(new float[]{1, 1});

            PdfPCell companyCell = new PdfPCell(new Phrase(
                    "TourVista\n123 Travel Street\nMumbai, India\n📞 +91-9876543210\n🌐 www.tourvista.com",
                    normalFont));
            companyCell.setBorder(Rectangle.NO_BORDER);
            infoTable.addCell(companyCell);

            String customerName =
                    booking.getCustomer().getFirstName() + " " +
                    booking.getCustomer().getLastName();

            PdfPCell billingCell = new PdfPCell(new Phrase(
                    "Billed To:\n" + customerName +
                    "\nBooking Date: " + booking.getBookingDate(),
                    normalFont));
            billingCell.setBorder(Rectangle.NO_BORDER);
            billingCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            infoTable.addCell(billingCell);

            document.add(infoTable);
            document.add(Chunk.NEWLINE);

            // ===== Invoice Table =====
            PdfPTable invoiceTable = new PdfPTable(4);
            invoiceTable.setWidthPercentage(100);
            invoiceTable.setWidths(new float[]{3, 1, 2, 2});

            addHeader(invoiceTable, "Tour Package", boldFont);
            addHeader(invoiceTable, "Passengers", boldFont);
            addHeader(invoiceTable, "Base Price (₹)", boldFont);
            addHeader(invoiceTable, "Total Price (₹)", boldFont);

            String tourName =
                    booking.getTour().getCategory().getCategoryName();

            invoiceTable.addCell(new PdfPCell(new Phrase(tourName, normalFont)));
            invoiceTable.addCell(centerCell(String.valueOf(booking.getNoOfPax()), normalFont));
            invoiceTable.addCell(rightCell(booking.getTourAmount().toString(), normalFont));
            invoiceTable.addCell(rightCell(booking.getTotalAmount().toString(), normalFont));

            document.add(invoiceTable);
            document.add(Chunk.NEWLINE);

            // ===== Total Section =====
            PdfPTable totalTable = new PdfPTable(2);
            totalTable.setWidthPercentage(40);
            totalTable.setHorizontalAlignment(Element.ALIGN_RIGHT);

            addNoBorder(totalTable, "Subtotal:", normalFont);
            addRightNoBorder(totalTable, booking.getTourAmount().toString(), normalFont);

            addNoBorder(totalTable, "Tax (5%):", normalFont);
            addRightNoBorder(totalTable, booking.getTaxes().toString(), normalFont);

            addNoBorder(totalTable, "Total Amount:", boldFont);
            addRightNoBorder(totalTable, booking.getTotalAmount().toString(),
                    new Font(Font.HELVETICA, 11, Font.BOLD, Color.RED));

            document.add(totalTable);

            // ===== Footer =====
            Paragraph footer = new Paragraph(
                    "\nThank you for choosing TourVista!\n" +
                    "Your gateway to amazing experiences.\nwww.tourvista.com",
                    new Font(Font.HELVETICA, 10, Font.ITALIC, Color.GRAY));
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(20);
            document.add(footer);

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Invoice PDF generation failed", e);
        }
    }

    // ===== Helper Methods =====
    private void addHeader(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(Color.LIGHT_GRAY);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);
    }

    private PdfPCell centerCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        return cell;
    }

    private PdfPCell rightCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        return cell;
    }

    private void addNoBorder(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorder(Rectangle.NO_BORDER);
        table.addCell(cell);
    }

    private void addRightNoBorder(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(cell);
    }
}
