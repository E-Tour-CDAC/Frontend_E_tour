import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/UI/Card';
import { tourAPI } from '../api';

const TourDetail = () => {
  const { id } = useParams();
  const [subPackages, setSubPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTourData();
  }, [id]);

  const fetchTourData = async () => {
    try {
      setLoading(true);
      // In this backend, 'getTour' (mapped to categories/{id}) returns a LIST of sub-categories/packages
      const response = await tourAPI.getTour(id);

      if (Array.isArray(response.data)) {
        setSubPackages(response.data);
      } else {
        // Fallback if it somehow returns a single object (unexpected)
        setSubPackages([]);
      }

    } catch (err) {
      setError('Failed to fetch package details');
      console.error(err);
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
        <p className="text-red-600 text-lg">{error}</p>
        <Link to="/tours" className="mt-4 inline-block btn-primary">
          Back to Tours
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/tours" className="text-teal-700 hover:text-teal-800 mb-4 inline-block">
          ← Back to Main Tours
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Packages
        </h1>
        <p className="text-gray-600">
          {subPackages.length > 0 ? "Select a sub-package to view more options." : "Explore this destination."}
        </p>
      </div>

      {subPackages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subPackages.map((pkg) => (
            <Link key={pkg.catCode} to={`/tours/${pkg.catCode}`}>
              <Card hover className="cursor-pointer h-full">
                <div className="relative h-48 bg-gray-200">
                  {pkg.imagePath ? (
                    <img
                      src={pkg.imagePath}
                      alt={pkg.categoryName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {pkg.categoryName}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Click to view more details about this package.
                  </p>
                  <span className="text-teal-700 font-medium">
                    View Options →
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Inquiry</h2>
          <p className="text-gray-600 mb-6">
            Detailed itinerary and online pricing are currently being updated for this specific package.
          </p>
          <p className="mb-6">
            Please contact our support team to book this tour directly.
          </p>
          <button className="btn-primary">
            Contact Us
          </button>
        </div>
      )}
    </div>
  );
};

export default TourDetail;
