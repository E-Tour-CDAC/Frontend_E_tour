import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/UI/Card';
import Table from '../components/UI/Table';
import { customerAPI, bookingAPI } from '../api';
import { toast } from 'react-toastify';

const CustomerBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // 1. Get Customer Profile first to get the ID
      const profileRes = await customerAPI.getProfileId();
      const customerId = profileRes.data.id;

      if (!customerId) {
        toast.error("Could not verify customer identity.");
        return;
      }

      // 2. Fetch Bookings for this customer
      const response = await bookingAPI.getBookingsByCustomer(customerId);
      setBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // ... (keep auth check and loading states same as before if needed, or I'll just rewrite the render)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button onClick={fetchBookings} className="mt-4 btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bookings</h1>
        <p className="text-gray-600">View and manage your tour bookings</p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't made any bookings yet. Start exploring our amazing tours!
            </p>
            <Link to="/tours" className="btn-primary">
              Browse Tours
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking.bookingId}>
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Booking #{booking.bookingId}
                      {/* Note: Tour Name is not provided in the list API */}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Ref: {booking.bookingId}</span>
                      <span>•</span>
                      <span>Date: {formatDate(booking.bookingDate)}</span>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Number of Passengers</h4>
                    <p className="text-gray-900">{booking.noOfPax} Passengers</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Total Amount</h4>
                    <p className="text-xl font-bold text-blue-600">₹{booking.totalAmount}</p>
                  </div>
                </div>

                {/* Removed Passenger Details and Departure Date as they are not in the provided JSON */}

                <div className="flex items-center justify-end mt-6 pt-4 border-t">
                  <div className="flex space-x-4">
                    {/* 
                       Buttons preserved but logic requires more data than available.
                       They are strictly UI placeholders for now as per "simple" instruction.
                     */}
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      View Details
                    </button>
                    {booking.status === 'CONFIRMED' && (
                      <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerBookings;
