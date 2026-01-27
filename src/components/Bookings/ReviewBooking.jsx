import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { bookingAPI } from '../../api';

const ReviewBooking = () => {
  const {
    selectedTour,
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

      console.log('📦 BookingHeader payload:', bookingPayload);

      const res = await bookingAPI.createBooking(bookingPayload);
      setBooking(res.data);
      setStep(4);

    } catch (err) {
      console.error(err);
      alert('Failed to create booking');
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-900">Review & Confirm</h2>
        <p className="text-sm text-gray-500">Please review your booking details before proceeding.</p>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Tour Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Tour Information</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                 <p className="font-bold text-blue-900 text-lg">{selectedTour?.categoryName}</p>
                 <div className="mt-2 text-sm text-blue-800 space-y-1">
                    <p><span className="font-semibold">Departure:</span> {formatDate(selectedDeparture?.departDate)}</p>
                    <p><span className="font-semibold">Return:</span> {formatDate(selectedDeparture?.endDate)}</p>
                    <p><span className="font-semibold">Duration:</span> {selectedDeparture?.noOfDays} Days</p>
                 </div>
              </div>
           </div>

           <div>
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Payment Summary</h3>
             <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2">
                <div className="flex justify-between text-sm">
                   <span className="text-gray-600">Base Amount</span>
                   <span className="font-medium">₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-gray-600">Taxes (10%)</span>
                   <span className="font-medium">₹{(calculateTotal() * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2">
                   <span className="text-gray-900">Total</span>
                   <span className="text-blue-600">₹{(calculateTotal() * 1.1).toFixed(2)}</span>
                </div>
             </div>
           </div>
        </div>

        {/* Passenger List */}
        <div>
           <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Passenger Details ({passengers.length})</h3>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm border-collapse">
               <thead>
                 <tr className="bg-gray-100 border-b border-gray-200">
                   <th className="p-3 font-semibold text-gray-700">#</th>
                   <th className="p-3 font-semibold text-gray-700">Name</th>
                   <th className="p-3 font-semibold text-gray-700">Birth Date</th>
                   <th className="p-3 font-semibold text-gray-700">Type</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {passengers.map((pax, index) => (
                   <tr key={index} className="hover:bg-gray-50">
                     <td className="p-3 text-gray-500">{index + 1}</td>
                     <td className="p-3 font-medium text-gray-900">{pax.pax_name}</td>
                     <td className="p-3 text-gray-600">{pax.pax_birthdate}</td>
                     <td className="p-3 text-gray-600 capitalize">
                       {pax.pax_type.replace(/_/g, ' ')}
                       {pax.is_extra && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Extra</span>}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-4">
          <button
            onClick={() => setStep(2)}
            className="btn-secondary w-full sm:w-auto text-center"
          >
            Back to Passengers
          </button>
          <button
            onClick={handleConfirmBooking}
            className="btn-primary w-full sm:w-auto text-center px-8"
          >
            Confirm & Proceed to Payment
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReviewBooking;
