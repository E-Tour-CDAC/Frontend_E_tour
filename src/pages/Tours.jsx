import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import Card from '../components/UI/Card';
import { tourAPI } from '../api';

const Tours = () => {
  const { id } = useParams(); // subcatCode from URL
  const location = useLocation();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.searchParams) {
      console.log('Search Params Received:', location.state.searchParams);
    }
  }, [location.state]);

  // 🔁 Runs whenever URL changes
  useEffect(() => {
    if (id) {
      fetchToursBySubcat(id);
    } else {
      fetchTours();
    }
  }, [id]);

  // 🔹 Fetch all tours
  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await tourAPI.getTours();
      mapAndSetTours(response.data);
    } catch (err) {
      setError('Failed to fetch tours');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch tours by subcategory
  const fetchToursBySubcat = async (subcat) => {
    try {
      setLoading(true);
      setError(null);

      const response = await tourAPI.getTour(subcat);
      mapAndSetTours(response.data);
    } catch (err) {
      setError('Failed to fetch tours');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Mapper with BASE PRICE logic
  const mapAndSetTours = (data) => {
    const mappedTours = data.map(cat => {
      // 🔥 Calculate base price from costs[]
      let basePrice = null;

      if (Array.isArray(cat.costs) && cat.costs.length > 0) {
        basePrice = Math.min(
          ...cat.costs.map(c => c.singlePersonCost)
        );
      }

      return {
        id: cat.catCode || cat.CategoryCode,
        catid: cat.categoryId,
        jumpFlag: cat.jumpFlag,
        tour_name: cat.categoryName,
        image_url: cat.imagePath,
        description: `Explore our amazing ${cat.categoryName} packages.`,
        starting_price: basePrice, // ✅ BASE PRICE
        duration_days: '5-10',
        rating: 4.5,
        category_name: 'Tour Package',
        featured: false
      };
    });

    setTours(mappedTours);
  };

  // ⏳ Loader
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">{error}</p>
        <button
          onClick={() => (id ? fetchToursBySubcat(id) : fetchTours())}
          className="mt-4 btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {id ? `Tours: ${id}` : 'Available Tours'}
        </h1>
        <p className="text-gray-600">Discover your next adventure</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tours.map((tour) => (
          <Link
            key={tour.id}
            to={
              tour.jumpFlag
                ? `/tours/details/${tour.catid}`
                : `/tours/${tour.id}`
            }
          >
            <Card hover className="cursor-pointer group">
              <div className="relative">
                {tour.image_url ? (
                  <img
                    src={tour.image_url}
                    alt={tour.tour_name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <span className="text-xs text-sky-600 font-medium">
                  {tour.category_name}
                </span>

                <h3 className="text-lg font-semibold text-gray-900 mt-2">
                  {tour.tour_name}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-2 mt-2">
                  {tour.description}
                </p>

                <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                  <span>Var. Days</span>
                  <span>⭐ {tour.rating}</span>
                </div>

                {/* 💰 SHOW PRICE ONLY WHEN jumpFlag = true */}
                {tour.jumpFlag && tour.starting_price && (
                  <div className="mt-2 text-sky-700 font-semibold">
                    Starting from ₹{tour.starting_price}
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <span className="text-sky-700 font-bold">View</span>
                  <span className="text-sky-700 text-sm">
                    View Packages →
                  </span>
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
