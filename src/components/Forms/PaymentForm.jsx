import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import Card from '../UI/Card';
import TextInput from './TextInput';
import Select from './Select';
import { bookingAPI } from '../../api';

const PaymentForm = () => {
  const { 
    selectedTour, 
    selectedDeparture, 
    passengers, 
    setBooking, 
    setStep,
    setLoading,
    setError
  } = useBooking();
  
  const [paymentData, setPaymentData] = useState({
    card_number: '',
    cardholder_name: '',
    expiry_month: '',
    expiry_year: '',
    cvv: '',
    billing_address: '',
    billing_city: '',
    billing_country: '',
    billing_zip: ''
  });
  
  const [errors, setErrors] = useState({});

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1).padStart(2, '0')
  }));

  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return {
      value: year.toString(),
      label: year.toString()
    };
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
    { value: 'CN', label: 'China' },
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validatePayment();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      
      const bookingData = {
        tour_id: selectedTour.id,
        departure_id: selectedDeparture.id,
        no_of_pax: passengers.length,
        passengers: passengers.map(p => ({
          pax_name: p.pax_name,
          pax_birthdate: p.pax_birthdate,
          pax_type: p.pax_type,
          pax_amount: 0 // Will be calculated by backend
        })),
        payment: {
          ...paymentData,
          card_number: paymentData.card_number.replace(/\s/g, '')
        }
      };

      const response = await bookingAPI.createBooking(bookingData);
      setBooking(response.data);
      setStep(4);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Payment failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = passengers.reduce((total, passenger) => {
    const { single_person_cost, extra_person_cost, child_with_bed_cost, child_without_bed_cost } = selectedDeparture;
    
    switch (passenger.pax_type) {
      case 'adult':
        return total + (passenger.is_extra ? extra_person_cost : single_person_cost);
      case 'child_with_bed':
        return total + child_with_bed_cost;
      case 'child_without_bed':
        return total + child_without_bed_cost;
      default:
        return total;
    }
  }, 0);

  const taxes = subtotal * 0.1;
  const total = subtotal + taxes;

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Payment Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Card Details
            </h3>
            
            <div className="space-y-4">
              <TextInput
                label="Card Number"
                name="card_number"
                value={paymentData.card_number}
                onChange={(e) => handleInputChange('card_number', e.target.value)}
                error={errors.card_number}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                required
              />

              <TextInput
                label="Cardholder Name"
                name="cardholder_name"
                value={paymentData.cardholder_name}
                onChange={(e) => handleInputChange('cardholder_name', e.target.value)}
                error={errors.cardholder_name}
                placeholder="John Doe"
                required
              />

              <div className="grid grid-cols-3 gap-4">
                <Select
                  label="Expiry Month"
                  name="expiry_month"
                  value={paymentData.expiry_month}
                  onChange={(e) => handleInputChange('expiry_month', e.target.value)}
                  options={monthOptions}
                  error={errors.expiry_month}
                  required
                />

                <Select
                  label="Expiry Year"
                  name="expiry_year"
                  value={paymentData.expiry_year}
                  onChange={(e) => handleInputChange('expiry_year', e.target.value)}
                  options={yearOptions}
                  error={errors.expiry_year}
                  required
                />

                <TextInput
                  label="CVV"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  error={errors.cvv}
                  placeholder="123"
                  maxLength="4"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Billing Address
            </h3>
            
            <div className="space-y-4">
              <TextInput
                label="Street Address"
                name="billing_address"
                value={paymentData.billing_address}
                onChange={(e) => handleInputChange('billing_address', e.target.value)}
                error={errors.billing_address}
                placeholder="123 Main St"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label="City"
                  name="billing_city"
                  value={paymentData.billing_city}
                  onChange={(e) => handleInputChange('billing_city', e.target.value)}
                  error={errors.billing_city}
                  placeholder="New York"
                  required
                />

                <TextInput
                  label="ZIP Code"
                  name="billing_zip"
                  value={paymentData.billing_zip}
                  onChange={(e) => handleInputChange('billing_zip', e.target.value)}
                  error={errors.billing_zip}
                  placeholder="10001"
                  required
                />
              </div>

              <Select
                label="Country"
                name="billing_country"
                value={paymentData.billing_country}
                onChange={(e) => handleInputChange('billing_country', e.target.value)}
                options={countryOptions}
                error={errors.billing_country}
                required
              />
            </div>
          </div>

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
                <span>Total Amount</span>
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-secondary"
            >
              Back
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Complete Payment
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default PaymentForm;
