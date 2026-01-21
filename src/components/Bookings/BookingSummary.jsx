import React from 'react';
import { useBooking } from '../../context/BookingContext';
import Card from '../UI/Card';

const BookingSummary = () => {
  const { selectedTour, selectedDeparture, passengers, calculateTotal } = useBooking();

  if (!selectedTour) {
    return (
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Booking Summary
          </h3>
          <p className="text-gray-500 text-sm">
            No tour selected yet
          </p>
        </div>
      </Card>
    );
  }

  const subtotal = calculateTotal();
  const taxes = subtotal * 0.1; // 10% tax
  const total = subtotal + taxes;

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Booking Summary
        </h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Tour Details</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{selectedTour.tour_name}</p>
              <p>{selectedTour.duration_days} days</p>
              <p>{selectedTour.category_name}</p>
            </div>
          </div>

          {selectedDeparture && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Departure</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  {new Date(selectedDeparture.departure_date).toLocaleDateString()}
                </p>
                <p>
                  Return: {new Date(selectedDeparture.return_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {passengers.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Passengers ({passengers.length})
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                {passengers.map((passenger, index) => (
                  <p key={index}>
                    {passenger.pax_name} - {passenger.pax_type}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxes (10%)</span>
                <span className="font-medium">${taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span>Total</span>
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Free cancellation up to 24 hours before departure</p>
            <p>• Instant confirmation</p>
            <p>• 24/7 customer support</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BookingSummary;
