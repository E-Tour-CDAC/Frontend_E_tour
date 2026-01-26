import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/UI/Card';
import { tourAPI } from '../api';

const TourDetail = () => {
  const { id } = useParams(); // categoryId from /tours/details/:id
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

      if (Array.isArray(response.data)) {
        setTours(response.data);
      } else {
        setTours([]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load tour details');
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700"></div>
      </div>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">{error}</p>
        <Link to="/tours" className="btn-primary mt-4 inline-block">
          Back to Tours
        </Link>
      </div>
    );
  }

  // 🛑 No data
  if (tours.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No tour details available.</p>
      </div>
    );
  }

  // Use first item (category-level page)
  const tour = tours[0];

  return (
    <div className="container mx-auto px-4 py-8">

      {/* 🔙 Back */}
      <div className="mb-6">
        <Link to="/tours" className="text-teal-700 hover:text-teal-800">
          ← Back to Tours
        </Link>
      </div>

      {/* 🏷️ Category Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {tour.categoryName}
        </h1>
        <p className="text-gray-600">
          Category Code:{' '}
          <span className="font-medium">{tour.categoryCode}</span>
        </p>
      </div>

      {/* 📅 Itinerary */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Itinerary</h2>

        {tour.itineraries?.length > 0 ? (
          tour.itineraries.map((day) => (
            <div key={day.id} className="border rounded-lg p-4 mb-3">
              <h3 className="font-semibold mb-1">
                Day {day.dayNo}
              </h3>
              <p className="text-gray-600">
                {day.itineraryDetail}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Itinerary not available.</p>
        )}
      </div>

      {/* 💰 Pricing */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Pricing</h2>

        {tour.costs?.length > 0 ? (
          tour.costs.map((cost, idx) => (
            <div key={idx} className="border rounded-lg p-4 mb-3">
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

      {/* 🚍 Departure Dates */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Available Departures
        </h2>

        {tour.departures?.length > 0 ? (
          tour.departures.map((dep) => (
            <div key={dep.id} className="border rounded-lg p-4 mb-3">
              <p>Departure Date: {dep.departDate}</p>
              <p>End Date: {dep.endDate}</p>
              <p>Duration: {dep.noOfDays} days</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No departure dates available.
          </p>
        )}
      </div>

      {/* 🧑‍✈️ Tour Guides */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Tour Guides</h2>

        {tour.guides?.length > 0 ? (
          tour.guides.map((guide) => (
            <div key={guide.id} className="border rounded-lg p-4 mb-3">
              <p className="font-semibold">{guide.name}</p>
              <p>Email: {guide.email}</p>
              <p>Phone: {guide.phone}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            Guide information not available.
          </p>
        )}
      </div>

      {/* 📞 CTA */}
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">
          Interested in this tour?
        </h2>
        <p className="text-gray-600 mb-6">
          Book your slot now before seats fill up.
        </p>

        {tour?.categoryId && (
          <Link
            to={`/booking/start/${tour.categoryId}`}
            className="btn-primary px-8 py-3 inline-block text-lg"
          >
            Book Now
          </Link>
        )}
      </div>

    </div>
  );
};

export default TourDetail;
