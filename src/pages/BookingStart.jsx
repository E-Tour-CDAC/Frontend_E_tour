import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Stepper from '../components/UI/Stepper';
import Card from '../components/UI/Card';
import BookingSummary from '../components/Bookings/BookingSummary';
import PassengerForm from '../components/Forms/PassengerForm';
import PaymentForm from '../components/Forms/PaymentForm';
import { tourAPI } from '../api';

const BookingStart = () => {
  const { id } = useParams(); // categoryId
  const location = useLocation();

  const passedTour = location.state?.tour;
  const passedDepartures = location.state?.departures;

  const {
    setTour,
    setDeparture,
    currentStep,
    setStep
  } = useBooking();

  const [tour, setTourData] = useState(null);
  const [departures, setDepartures] = useState([]);
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const steps = [
    'Select Tour',
    'Choose Departure',
    'Passenger Details',
    'Payment',
    'Confirmation'
  ];

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

  useEffect(() => {
    initBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const initBooking = async () => {
    try {
      setLoading(true);
      setStep(0);
      setDeparture(null);
      setSelectedDeparture(null);

      // ✅ USE PASSED DATA FIRST
      if (passedTour && passedDepartures) {
        setTourData(passedTour);
        setDepartures(passedDepartures);
        setTour(passedTour);
        setLoading(false);
        return;
      }

      // 🔁 FALLBACK (DIRECT URL ACCESS)
      const response = await tourAPI.getTourDetails(id);
      const tourData = response.data[0];

      setTourData(tourData);
      setDepartures(tourData.departures || []);
      setTour(tourData);

    } catch (err) {
      console.error(err);
      setError('Failed to load booking data');
    } finally {
      setLoading(false);
    }
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
        <p className="text-red-600">{error || 'Tour not found'}</p>
        <Link to="/tours" className="btn-primary mt-4 inline-block">
          Back to Tours
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">

      <h1 className="text-3xl font-bold mb-6">
        Book Your Tour
      </h1>

      <Stepper steps={steps} currentStep={currentStep} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

        {/* LEFT */}
        <div className="lg:col-span-2">

          {/* STEP 0 */}
          {currentStep === 0 && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Selected Tour
                </h2>

                <h3 className="font-semibold">
                  {tour.categoryName}
                </h3>

                <button
                  onClick={() => setStep(1)}
                  className="btn-primary mt-4"
                >
                  Continue
                </button>
              </div>
            </Card>
          )}

          {/* STEP 1 — RADIO DEPARTURES */}
          {currentStep === 1 && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Select Departure Date
                </h2>

                <div className="space-y-4">
                  {departures.map(dep => (
                    <label
                      key={dep.id}
                      className={`flex items-start border rounded-lg p-4 cursor-pointer
                        ${
                          selectedDeparture?.id === dep.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'hover:border-blue-500'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="departure"
                        className="mt-1 mr-4"
                        checked={selectedDeparture?.id === dep.id}
                        onChange={() => setSelectedDeparture(dep)}
                      />

                      <div>
                        <p className="font-semibold">
                          Departure: {formatDate(dep.departDate)}
                        </p>
                        <p className="text-sm text-gray-600">
                          End: {formatDate(dep.endDate)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Duration: {dep.noOfDays} days
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="mt-6 text-right">
                  <button
                    disabled={!selectedDeparture}
                    onClick={() => {
                      setDeparture(selectedDeparture);
                      setStep(2);
                    }}
                    className={`btn-primary ${
                      !selectedDeparture
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </Card>
          )}

          {currentStep === 2 && <PassengerForm />}
          {currentStep === 3 && <PaymentForm />}

        </div>

        {/* RIGHT */}
        <div className="lg:col-span-1">
          <BookingSummary />
        </div>

      </div>
    </div>
  );
};

export default BookingStart;
