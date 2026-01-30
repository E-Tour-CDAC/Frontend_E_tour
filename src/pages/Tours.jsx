// UPDATED CODE FOR COST AND LOCATION SEARCH
import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Card from "../components/UI/Card";
import { tourAPI, searchAPI } from "../api";



const BACKEND_URL = 'http://localhost:8080';

const getImageUrl = (path) => {
  if (!path) return null;
  const sanitizedPath = path.replace(/^"+|"+$/g, '');
  if (sanitizedPath.startsWith('http')) return sanitizedPath;
  const cleanPath = sanitizedPath.startsWith('/') ? sanitizedPath : `/${sanitizedPath}`;
  console.log(`${BACKEND_URL}${cleanPath}`);
  return `${BACKEND_URL}${cleanPath}`;
};


const BACKEND_URL = 'http://localhost:8080';

const getImageUrl = (path) => {
  if (!path) return null;
  const sanitizedPath = path.replace(/^"+|"+$/g, '');
  if (sanitizedPath.startsWith('http')) return sanitizedPath;
  const cleanPath = sanitizedPath.startsWith('/') ? sanitizedPath : `/${sanitizedPath}`;
  console.log(`${BACKEND_URL}${cleanPath}`);
  return `${BACKEND_URL}${cleanPath}`;
};

const Tours = () => {
  const { id } = useParams();
  const location = useLocation();

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 SEARCH STATES
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchedCategoryIds, setSearchedCategoryIds] = useState([]);

  /* ================= SEARCH HANDLER ================= */

  useEffect(() => {
    if (!location.state?.searchParams) {
      setIsSearchMode(false);
      setSearchedCategoryIds([]);
      return;
    }

    const { price, date, location: loc } = location.state.searchParams;
    setIsSearchMode(true);

    const runSearch = async () => {
      try {
        setLoading(true);
        let response;

        if (price) {
          response = await searchAPI.searchByCost(0, price);
        } else if (date) {
          // response = await searchAPI.searchByDate(date, date);
          // continue
          const fromDate = date;

          const toDateObj = new Date(date);
          toDateObj.setDate(toDateObj.getDate() + 10); // 7–10 din ka buffer

          const toDate = toDateObj.toISOString().split("T")[0];

          response = await searchAPI.searchByDate(fromDate, toDate);
        } else if (loc) {
          response = await searchAPI.searchByLocation(loc);
        }

        // 🔥 IMPORTANT: sirf categoryIds store karo
        const ids =
          response?.data?.map((item) =>
            typeof item === "number" ? item : item.categoryId,
          ) || [];

        setSearchedCategoryIds(ids);
      } catch (err) {
        console.error("Search failed", err);
        setSearchedCategoryIds([]);
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [location.state]);

  /* ================= FETCH TOURS (ALWAYS) ================= */

  useEffect(() => {
    if (id) {
      fetchToursBySubcat(id);
    } else {
      fetchTours();
    }
  }, [id]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await tourAPI.getTours();
      mapAndSetTours(response.data);
    } catch (err) {
      setError("Failed to fetch tours");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchToursBySubcat = async (subcat) => {
    try {
      setLoading(true);
      setError(null);

      const response = await tourAPI.getTour(subcat);
      mapAndSetTours(response.data);
    } catch (err) {
      setError("Failed to fetch tours");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= MAPPER (UNCHANGED) ================= */

  const mapAndSetTours = (data) => {
    const mappedTours = data.map((cat) => {
      let basePrice = null;

      if (Array.isArray(cat.costs) && cat.costs.length > 0) {
        basePrice = Math.min(...cat.costs.map((c) => c.singlePersonCost));
      }

      return {
        id: cat.catCode || cat.CategoryCode,
        catid: cat.categoryId,
        jumpFlag: cat.jumpFlag,
        tour_name: cat.categoryName,
        image_url: cat.imagePath,
        description: `Explore our amazing ${cat.categoryName} packages.`,
        starting_price: basePrice,
        duration_days: "5-10",
        rating: 4.5,
        category_name: "Tour Package",
        featured: false,
      };
    });

    setTours(mappedTours);
  };

  /* ================= FINAL DISPLAY LOGIC ================= */

  const displayTours = isSearchMode
    ? tours.filter((tour) => searchedCategoryIds.includes(tour.catid))
    : tours;

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {isSearchMode ? "Search Results" : "Available Tours"}
        </h1>
        <p className="text-gray-600">Discover your next adventure</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayTours.map((tour) => (
          <Link
            key={tour.id}
            to={
              tour.jumpFlag
                ? `/tours/details/${tour.catid}`
                : `/tours/${tour.id}`
            }
          >
            <Card hover className="cursor-pointer group">
              <div >
                {tour.image_url ? (
                  <img
                    src={getImageUrl(tour.image_url)}
                    alt={tour.tour_name}
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/fallback.jpg";
                    }}
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

                {tour.jumpFlag && tour.starting_price && (
                  <div className="mt-2 text-sky-700 font-semibold">
                    Starting from ₹{tour.starting_price}
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <span className="text-sky-700 font-bold">View</span>
                  <span className="text-sky-700 text-sm">View Packages →</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {displayTours.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tours found.</p>
        </div>
      )}
    </div>
  );
};

export default Tours;