import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { bookingAPI } from '../../api';

const ReviewBooking = () => {
  const {
    selectedDeparture,
    passengers,
    customerId,
    calculateTotal,
    setBooking,
    setStep,
  } = useBooking();

  const handleConfirmBooking = async () => {
    try {
      if (!customerId || !selectedDeparture?.tourId) {
        alert('Missing booking data');
        return;
      }

      const baseAmount = calculateTotal();
const taxes = Math.round(baseAmount * 0.1);

const bookingPayload = {
  customerId,
  tourId: selectedDeparture.tourId,
  noOfPax: passengers.length,
  tourAmount: baseAmount,
  taxes,
  statusId: 1,
};

      // ✅ REQUIRED CONSOLE LOG
      console.log('📦 BookingHeader payload:', bookingPayload);

      const res = await bookingAPI.createBooking(bookingPayload);

      // Save booking response in context
      setBooking(res.data);

      // Move to Payment step
      setStep(4);

    } catch (err) {
      console.error(err);
      alert('Failed to create booking');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Review Booking</h2>

      <button
        onClick={handleConfirmBooking}
        className="btn-primary mt-6"
      >
        Confirm & Proceed to Payment
      </button>
    </div>
  );
};

export default ReviewBooking;
