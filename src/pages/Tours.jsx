import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Card from '../components/UI/Card';
import { tourAPI } from '../api';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Backend Categories API does not support filtering by price/duration/etc for now.
  // We will fetch all categories (Top Level Tours) and display them.

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await tourAPI.getTours();
      // Map CategoryDTO to Tour format expected by UI
      const mappedTours = response.data.map(cat => ({
        id: cat.catCode,
        tour_name: cat.categoryName,
        image_url: cat.imagePath,
        description: 'Explore our amazing ' + cat.categoryName + ' packages.', // Mock description
        starting_price: 'Check Details', // Mock price
        duration_days: '5-10', // Mock duration
        rating: 4.5, // Mock rating
        category_name: 'Tour Package',
        featured: false
      }));
      setTours(mappedTours);
    } catch (err) {
      setError('Failed to fetch tours');
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
        <button onClick={fetchTours} className="mt-4 btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Tours</h1>
        <p className="text-gray-600">Discover your next adventure</p>
      </div>

      {/* Filters removed as backend does not support them for Categories */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tours.map((tour) => (
          <Link key={tour.id} to={`/tours/${tour.id}`}>
            <Card hover className="cursor-pointer">
              <div className="relative">
                {tour.image_url ? (
                  <img
                    src={tour.image_url}
                    alt={tour.tour_name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-teal-700 font-medium">
                    {tour.category_name}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tour.tour_name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {tour.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  {/* Mock Data Display */}
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Var. Days
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {tour.rating}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-teal-700">
                      View
                    </span>
                  </div>
                  <button className="text-teal-700 hover:text-teal-800 font-medium text-sm">
                    View Packages →
                  </button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {tours.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tours found.</p>
        </div>
      )}
    </div>
  );
};

export default Tours;
