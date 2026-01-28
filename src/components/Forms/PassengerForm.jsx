import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import Card from '../UI/Card';
import TextInput from './TextInput';
import DatePicker from './DatePicker';
import RadioGroup from './RadioGroup';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const PassengerForm = () => {
  const { passengers, addPassenger, updatePassenger, removePassenger, setStep } = useBooking();
  const [errors, setErrors] = useState({});

  const passengerTypes = [
    { value: 'adult', label: 'Adult' },
    { value: 'child_with_bed', label: 'Child (with bed)' },
    { value: 'child_without_bed', label: 'Child (without bed)' },
  ];

  const validatePassenger = (passenger) => {
    const newErrors = {};

    if (!passenger.pax_name.trim()) {
      newErrors.pax_name = 'Name is required';
    }

    if (!passenger.pax_birthdate) {
      newErrors.pax_birthdate = 'Birth date is required';
    }

    if (!passenger.pax_type) {
      newErrors.pax_type = 'Passenger type is required';
    }

    return newErrors;
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassenger = { ...passengers[index], [field]: value };
    updatePassenger(index, updatedPassenger);

    if (errors[index] && errors[index][field]) {
      const newErrors = { ...errors };
      delete newErrors[index][field];
      setErrors(newErrors);
    }
  };

  const addNewPassenger = () => {
    const newPassenger = {
      pax_name: '',
      pax_birthdate: '',
      pax_type: 'adult',
      is_extra: passengers.length > 0
    };
    addPassenger(newPassenger);
  };

  const removePassengerHandler = (index) => {
    removePassenger(index);
    const newErrors = { ...errors };
    delete newErrors[index];
    setErrors(newErrors);
  };

  const validateAllPassengers = () => {
    const newErrors = {};
    let isValid = true;

    passengers.forEach((passenger, index) => {
      const passengerErrors = validatePassenger(passenger);
      if (Object.keys(passengerErrors).length > 0) {
        newErrors[index] = passengerErrors;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateAllPassengers()) {
      setStep(3);
    }
  };

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Passenger Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {passengers.map((passenger, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Passenger {index + 1}
                  {passenger.is_extra && (
                    <span className="ml-2 text-sm text-blue-600">(Extra)</span>
                  )}
                </h3>
                {passengers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePassengerHandler(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Full Name"
                  name={`pax_name_${index}`}
                  value={passenger.pax_name}
                  onChange={(e) => handlePassengerChange(index, 'pax_name', e.target.value)}
                  error={errors[index]?.pax_name}
                  placeholder="Enter passenger name"
                  required
                />

                <DatePicker
                  label="Birth Date"
                  name={`pax_birthdate_${index}`}
                  value={passenger.pax_birthdate}
                  onChange={(e) => handlePassengerChange(index, 'pax_birthdate', e.target.value)}
                  error={errors[index]?.pax_birthdate}
                  required
                />
              </div>

              <RadioGroup
                label="Passenger Type"
                name={`pax_type_${index}`}
                options={passengerTypes}
                value={passenger.pax_type}
                onChange={(e) => handlePassengerChange(index, 'pax_type', e.target.value)}
                error={errors[index]?.pax_type}
              />
            </div>
          ))}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={addNewPassenger}
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Another Passenger
            </button>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary w-full sm:w-auto text-center justify-center"
              >
                Back
              </button>
              <button
                type="submit"
                className="btn-primary w-full sm:w-auto text-center justify-center"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default PassengerForm;
