import React, { createContext, useContext, useReducer } from 'react';

const BookingContext = createContext();

const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TOUR':
      return { ...state, selectedTour: action.payload, currentStep: 1 };
    case 'SET_DEPARTURE':
      return { ...state, selectedDeparture: action.payload, currentStep: 2 };
    case 'SET_PASSENGERS':
      return { ...state, passengers: action.payload, currentStep: 3 };
    case 'ADD_PASSENGER':
      return { ...state, passengers: [...state.passengers, action.payload] };
    case 'UPDATE_PASSENGER':
      return {
        ...state,
        passengers: state.passengers.map((p, index) =>
          index === action.payload.index ? action.payload.passenger : p
        ),
      };
    case 'REMOVE_PASSENGER':
      return {
        ...state,
        passengers: state.passengers.filter((_, index) => index !== action.payload),
      };
    case 'SET_PAYMENT':
      return { ...state, payment: action.payload, currentStep: 4 };
    case 'SET_BOOKING':
      return { ...state, booking: action.payload, currentStep: 5 };
    case 'RESET_BOOKING':
      return initialState;
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const initialState = {
  selectedTour: null,
  selectedDeparture: null,
  passengers: [],
  payment: null,
  booking: null,
  currentStep: 0,
  loading: false,
  error: null,
};

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const setTour = (tour) => {
    dispatch({ type: 'SET_TOUR', payload: tour });
  };

  const setDeparture = (departure) => {
    dispatch({ type: 'SET_DEPARTURE', payload: departure });
  };

  const setPassengers = (passengers) => {
    dispatch({ type: 'SET_PASSENGERS', payload: passengers });
  };

  const addPassenger = (passenger) => {
    dispatch({ type: 'ADD_PASSENGER', payload: passenger });
  };

  const updatePassenger = (index, passenger) => {
    dispatch({ type: 'UPDATE_PASSENGER', payload: { index, passenger } });
  };

  const removePassenger = (index) => {
    dispatch({ type: 'REMOVE_PASSENGER', payload: index });
  };

  const setPayment = (payment) => {
    dispatch({ type: 'SET_PAYMENT', payload: payment });
  };

  const setBooking = (booking) => {
    dispatch({ type: 'SET_BOOKING', payload: booking });
  };

  const resetBooking = () => {
    dispatch({ type: 'RESET_BOOKING' });
  };

  const setStep = (step) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const calculateTotal = () => {
    if (!state.selectedDeparture || !state.passengers.length) return 0;
    
    const { single_person_cost, extra_person_cost, child_with_bed_cost, child_without_bed_cost } = state.selectedDeparture;
    
    return state.passengers.reduce((total, passenger) => {
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
  };

  return (
    <BookingContext.Provider
      value={{
        ...state,
        setTour,
        setDeparture,
        setPassengers,
        addPassenger,
        updatePassenger,
        removePassenger,
        setPayment,
        setBooking,
        resetBooking,
        setStep,
        setLoading,
        setError,
        calculateTotal,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
