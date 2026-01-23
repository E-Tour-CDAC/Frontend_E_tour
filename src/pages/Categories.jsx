import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import { tourAPI } from '../api';

const Categories = () => {
  const { catCode } = useParams(); // STRING catCode
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [catCode]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      if (catCode) {
        // fetch sub-categories using catCode
        response = await tourAPI.getCategoriesByCatCode(catCode);
      } else {
        // fetch home categories
        response = await tourAPI.getHomeCategories();
      }

      setCategories(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    if (category.jump_flag === 1) {
      // go to tours page
      navigate(`/tours?category=${category.cat_code}`);
    } else {
      // drill down into sub-categories
      navigate(`/categories/${category.cat_code}`);
    }
  };

  /* ------------------ UI STATES ------------------ */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">{error}</p>
        <button
          onClick={fetchCategories}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  /* ------------------ MAIN RENDER ------------------ */

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {catCode ? 'Sub Categories' : 'Tour Categories'}
        </h1>
        <p className="text-gray-600">
          {catCode
            ? 'Choose a category to continue'
            : 'Explore our wide range of tour categories'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={`${category.cat_code}-${category.category_name}`}
            onClick={() => handleCategoryClick(category)}
            className="cursor-pointer"
          >
            <Card hover>
              <div className="bg-gray-200">
                {category.image_path ? (
                  <img
                    src={category.image_path}
                    alt={category.category_name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.category_name}
                </h3>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-blue-600 text-sm font-medium">
                    {category.jump_flag === 1 ? 'View Tours' : 'Explore'}
                  </span>
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No categories available</p>
        </div>
      )}
    </div>
  );
};

export default Categories;
