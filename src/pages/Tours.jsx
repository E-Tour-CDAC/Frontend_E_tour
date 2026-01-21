import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Card from '../components/UI/Card';
import Select from '../components/Forms/Select';
import { tourAPI } from '../api';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceRange: '',
    duration: '',
    sortBy: 'name'
  });

  useEffect(() => {
    fetchTours();
    fetchCategories();
  }, [filters]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.category) params.category_id = filters.category;
      if (filters.priceRange) params.price_range = filters.priceRange;
      if (filters.duration) params.duration = filters.duration;
      params.sort_by = filters.sortBy;

      const response = await tourAPI.getTours(params);
      setTours(response.data);
    } catch (err) {
      setError('Failed to fetch tours');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await tourAPI.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const priceRangeOptions = [
    { value: '0-5000', label: 'Under $5,000' },
    { value: '5000-10000', label: '$5,000 - $10,000' },
    { value: '10000-20000', label: '$10,000 - $20,000' },
    { value: '20000+', label: 'Above $20,000' },
  ];

  const durationOptions = [
    { value: '1-3', label: '1-3 Days' },
    { value: '4-7', label: '4-7 Days' },
    { value: '8-14', label: '8-14 Days' },
    { value: '15+', label: '15+ Days' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'duration', label: 'Duration' },
    { value: 'rating', label: 'Rating' },
  ];

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

      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Filter Tours</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            name="category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            options={[
              { value: '', label: 'All Categories' },
              ...categories.map(cat => ({ value: cat.id, label: cat.category_name }))
            ]}
          />

          <Select
            name="priceRange"
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            options={[
              { value: '', label: 'All Prices' },
              ...priceRangeOptions
            ]}
          />

          <Select
            name="duration"
            value={filters.duration}
            onChange={(e) => handleFilterChange('duration', e.target.value)}
            options={[
              { value: '', label: 'All Durations' },
              ...durationOptions
            ]}
          />

          <Select
            name="sortBy"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            options={sortOptions}
          />
        </div>
      </div>

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
                {tour.featured && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Featured
                  </span>
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
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {tour.duration_days} days
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {tour.rating || '4.5'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-teal-700">
                      ${tour.starting_price}
                    </span>
                    <span className="text-gray-500 text-sm">/person</span>
                  </div>
                  <button className="text-teal-700 hover:text-teal-800 font-medium text-sm">
                    View Details →
                  </button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {tours.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tours found matching your criteria</p>
          <button
            onClick={() => setFilters({ category: '', priceRange: '', duration: '', sortBy: 'name' })}
            className="mt-4 btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Tours;
