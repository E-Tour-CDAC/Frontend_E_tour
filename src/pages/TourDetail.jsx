import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tourAPI } from '../api';

const BACKEND_URL = 'http://localhost:8080';

const TourDetail = () => {
  const { id } = useParams(); // categoryId
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTourDetails();
  }, [id]);

  const fetchTourDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await tourAPI.getTourDetails(id);
      setTours(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      setError('Failed to load tour details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <Link to="/tours" className="btn-primary mt-4 inline-block">
          Back to Tours
        </Link>
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No tour details available.
      </div>
    );
  }

  const tour = tours[0];

  return (
    <div className="container mx-auto px-4 py-8">

      <Link to="/tours" className="text-teal-700">
        ← Back to Tours
      </Link>

      <h1 className="text-3xl font-bold mt-4 mb-8">
        {tour.categoryName}
      </h1>

      {/* 🗺️ ITINERARY */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Itinerary</h2>

        {tour.itineraries?.length > 0 ? (
          tour.itineraries.map(day => (
            <div key={day.id} className="border rounded-lg p-4 mb-4 flex gap-4">
              {day.dayWiseImage && (
                <img
                  src={`${BACKEND_URL}${day.dayWiseImage}`}
                  alt={`Day ${day.dayNo}`}
                  className="w-40 h-28 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-semibold">Day {day.dayNo}</h3>
                <p className="text-gray-600">{day.itineraryDetail}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Itinerary not available.</p>
        )}
      </div>

      {/* 💰 COST DETAILS */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Pricing</h2>

        {tour.costs?.length > 0 ? (
          tour.costs.map(cost => (
            <div key={cost.id} className="border rounded-lg p-4 mb-3">
              <p>Single Person: ₹{cost.singlePersonCost}</p>
              <p>Extra Person: ₹{cost.extraPersonCost}</p>
              <p>Child (With Bed): ₹{cost.childWithBedCost}</p>
              <p>Child (Without Bed): ₹{cost.childWithoutBedCost}</p>
              <p className="text-sm text-gray-500 mt-1">
                Valid from {cost.validFrom} to {cost.validTo}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Pricing details not available.</p>
        )}
      </div>

      {/* 🚍 DEPARTURES */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Available Departures
        </h2>

        {tour.departures?.length > 0 ? (
          tour.departures.map(dep => (
            <div key={dep.id} className="border rounded-lg p-4 mb-3">
              <p>Departure: {dep.departDate}</p>
              <p>End: {dep.endDate}</p>
              <p>Duration: {dep.noOfDays} days</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No departure dates available.</p>
        )}
      </div>

      {/* 📞 BOOK NOW */}
      <div className="text-center mt-10">
        <Link
          to={`/booking/start/${tour.categoryId}`}
          state={{
            tour,
            departures: tour.departures
          }}
          className="btn-primary px-8 py-3 inline-block text-lg"
        >
          Book Now
        </Link>
      </div>

    </div>
  );
};

export default TourDetail;
