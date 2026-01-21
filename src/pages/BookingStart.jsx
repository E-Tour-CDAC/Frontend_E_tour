import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Stepper from '../components/UI/Stepper';
import Card from '../components/UI/Card';
import BookingSummary from '../components/Bookings/BookingSummary';
import PassengerForm from '../components/Forms/PassengerForm';
import PaymentForm from '../components/Forms/PaymentForm';
import { bookingAPI, tourAPI } from '../api';

const BookingStart = () => {
  const { id } = useParams();
  const { selectedTour, setTour, setDeparture, currentStep, setStep } = useBooking();
  const [tour, setTourData] = useState(null);
  const [departures, setDepartures] = useState([]);
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const steps = ['Select Tour', 'Choose Departure', 'Passenger Details', 'Payment', 'Confirmation'];

  useEffect(() => {
    if (!selectedTour || selectedTour.id !== id) {
      fetchTourData();
    } else {
      setTourData(selectedTour);
      fetchDepartures();
    }
  }, [id]);

  const fetchTourData = async () => {
    try {
      setLoading(true);
      const [tourRes, departuresRes] = await Promise.all([
        tourAPI.getTour(id),
        tourAPI.getDepartures(id)
      ]);

      setTourData(tourRes.data);
      setDepartures(departuresRes.data);
      setTour(tourRes.data);
    } catch (err) {
      setError('Failed to fetch tour data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartures = async () => {
    try {
      const response = await tourAPI.getDepartures(id);
      setDepartures(response.data);
    } catch (err) {
      console.error('Failed to fetch departures:', err);
    }
  };

  const handleDepartureSelect = (departure) => {
    setSelectedDeparture(departure);
    setDeparture(departure);
    setStep(2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">{error || 'Tour not found'}</p>
        <Link to="/tours" className="mt-4 inline-block btn-primary">
          Back to Tours
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to={`/tours/${tour.id}`} className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to Tour Details
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Book Your Tour</h1>
      </div>

      <div className="mb-8">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {currentStep === 0 && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Selected Tour
                </h2>
                <div className="flex items-center mb-4">
                  {tour.image_url ? (
                    <img
                      src={tour.image_url}
                      alt={tour.tour_name}
                      className="w-24 h-24 object-cover rounded-lg mr-4"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-300 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {tour.tour_name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {tour.category_name} • {tour.duration_days} days
                    </p>
                    <p className="text-blue-600 font-semibold">
                      From ${tour.starting_price} per person
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="btn-primary"
                >
                  Continue to Departure Selection
                </button>
              </div>
            </Card>
          )}

          {currentStep === 1 && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Select Departure Date
                </h2>
                <div className="space-y-4">
                  {departures.map((departure) => (
                    <div
                      key={departure.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
                      onClick={() => handleDepartureSelect(departure)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {new Date(departure.departure_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-gray-600 text-sm mt-1">
                            Return: {new Date(departure.return_date).toLocaleDateString()}
                          </div>
                          <div className="text-gray-600 text-sm">
                            Available seats: {departure.available_seats}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            ${departure.single_person_cost}
                          </div>
                          <div className="text-gray-500 text-sm">
                            per person
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {departures.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No departures available for this tour</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {currentStep === 2 && <PassengerForm />}
          {currentStep === 3 && <PaymentForm />}
          {currentStep === 4 && (
            <Card>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Booking Confirmed!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your booking has been successfully confirmed. You will receive a confirmation email shortly.
                </p>
                <Link to="/customer/bookings" className="btn-primary">
                  View My Bookings
                </Link>
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <BookingSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingStart;
