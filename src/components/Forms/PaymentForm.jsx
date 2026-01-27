import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../UI/Card';
import TextInput from './TextInput';
import Select from './Select';
import { bookingAPI } from '../../api';

const PaymentForm = () => {
  const {
    selectedTour,
    selectedDeparture,
    passengers,
    calculateTotal,
    setBooking,
    setStep,
    setLoading,
    setError,
  } = useBooking();

  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentData, setPaymentData] = useState({
    card_number: '',
    cardholder_name: '',
    expiry_month: '',
    expiry_year: '',
    cvv: '',
    billing_address: '',
    billing_city: '',
    billing_country: '',
    billing_zip: '',
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1).padStart(2, '0'),
  }));

  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return { value: year.toString(), label: year.toString() };
  });

  const countryOptions = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
    { value: 'IN', label: 'India' },
    { value: 'SG', label: 'Singapore' },
    { value: 'MY', label: 'Malaysia' },
    { value: 'TH', label: 'Thailand' },
    { value: 'JP', label: 'Japan' },
    { value: 'CN', label: 'China' }
  ];

  const validatePayment = () => {
    const newErrors = {};

    if (!paymentData.card_number.trim()) {
      newErrors.card_number = 'Card number is required';
    } else if (!/^\d{16}$/.test(paymentData.card_number.replace(/\s/g, ''))) {
      newErrors.card_number = 'Invalid card number';
    }

    if (!paymentData.cardholder_name.trim()) {
      newErrors.cardholder_name = 'Cardholder name is required';
    }

    if (!paymentData.expiry_month) {
      newErrors.expiry_month = 'Expiry month is required';
    }

    if (!paymentData.expiry_year) {
      newErrors.expiry_year = 'Expiry year is required';
    }

    if (!paymentData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
      newErrors.cvv = 'Invalid CVV';
    }

    if (!paymentData.billing_address.trim()) {
      newErrors.billing_address = 'Billing address is required';
    }

    if (!paymentData.billing_city.trim()) {
      newErrors.billing_city = 'Billing city is required';
    }

    if (!paymentData.billing_country) {
      newErrors.billing_country = 'Billing country is required';
    }

    if (!paymentData.billing_zip.trim()) {
      newErrors.billing_zip = 'Billing ZIP code is required';
    }

    return newErrors;
  };

  const handleInputChange = (field, value) => {
    if (field === 'card_number') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }

    setPaymentData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    setSubmitError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validatePayment();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setLoading(true);
      setSubmitError(null);

      // SIMULATE PAYMENT PROCESSING
      // In a real app, you would send paymentData to a payment gateway here.
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Payment successful');

      // Move to Confirmation Step
      setStep(5);

      // Optional: Navigate to bookings page after a delay
      setTimeout(() => {
        navigate('/customer/bookings');
      }, 5000);

    } catch (error) {
      console.error('Error processing payment:', error);
      setSubmitError('Payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  // ✅ SINGLE SOURCE OF TRUTH
  const subtotal = calculateTotal();
  const taxes = subtotal * 0.1;
  const total = subtotal + taxes;

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Payment Information
        </h2>

        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* CARD DETAILS */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Card Details
            </h3>

            <div className="space-y-4">
              <TextInput
                label="Card Number"
                value={paymentData.card_number}
                onChange={(e) =>
                  handleInputChange('card_number', e.target.value)
                }
                error={errors.card_number}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                required
              />

              <TextInput
                label="Cardholder Name"
                value={paymentData.cardholder_name}
                onChange={(e) =>
                  handleInputChange('cardholder_name', e.target.value)
                }
                error={errors.cardholder_name}
                required
              />

              <div className="grid grid-cols-3 gap-4">
                <Select
                  label="Expiry Month"
                  value={paymentData.expiry_month}
                  onChange={(e) =>
                    handleInputChange('expiry_month', e.target.value)
                  }
                  options={monthOptions}
                  error={errors.expiry_month}
                  required
                />

                <Select
                  label="Expiry Year"
                  value={paymentData.expiry_year}
                  onChange={(e) =>
                    handleInputChange('expiry_year', e.target.value)
                  }
                  options={yearOptions}
                  error={errors.expiry_year}
                  required
                />

                <TextInput
                  label="CVV"
                  value={paymentData.cvv}
                  onChange={(e) =>
                    handleInputChange('cvv', e.target.value)
                  }
                  error={errors.cvv}
                  maxLength="4"
                  required
                />
              </div>
            </div>
          </div>

          {/* BILLING */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Billing Address
            </h3>

            <div className="space-y-4">
              <TextInput
                label="Street Address"
                value={paymentData.billing_address}
                onChange={(e) =>
                  handleInputChange('billing_address', e.target.value)
                }
                error={errors.billing_address}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label="City"
                  value={paymentData.billing_city}
                  onChange={(e) =>
                    handleInputChange('billing_city', e.target.value)
                  }
                  error={errors.billing_city}
                  required
                />

                <TextInput
                  label="ZIP Code"
                  value={paymentData.billing_zip}
                  onChange={(e) =>
                    handleInputChange('billing_zip', e.target.value)
                  }
                  error={errors.billing_zip}
                  required
                />
              </div>

              <Select
                label="Country"
                value={paymentData.billing_country}
                onChange={(e) =>
                  handleInputChange('billing_country', e.target.value)
                }
                options={countryOptions}
                error={errors.billing_country}
                required
              />
            </div>
          </div>

          {/* TOTAL */}
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxes (10%)</span>
                <span>₹{taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span>Total Amount</span>
                <span className="text-blue-600">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Back
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                'Complete Payment'
              )}
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default PaymentForm;
