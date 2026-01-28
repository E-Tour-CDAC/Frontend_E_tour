import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { tourAPI } from "../api";

const Home = () => {
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useState({
    location: "",
    date: "",
    price: ""
  });

  const [tours, setTours] = useState([]);
  const [loadingTours, setLoadingTours] = useState(true);
  const [toursError, setToursError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPopularTours();
  }, []);

  const fetchPopularTours = async () => {
    try {
      setLoadingTours(true);
      const response = await tourAPI.getTours();
      setTours(response.data.slice(0, 4));
      setToursError(null);
    } catch (error) {
      console.error("Error fetching tours:", error);
      setToursError(
        t("common.loadError", { defaultValue: "Failed to load tours" })
      );
    } finally {
      setLoadingTours(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/tours", { state: { searchParams } });
  };

  return (
    <div className="min-h-screen">

      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-gradient-to-r from-teal-700 to-teal-900 text-white">
        {/* IMPORTANT: prevent overlay blocking clicks */}
        <div className="absolute inset-0 pointer-events-none"></div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t("home.heroTitle")}
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-teal-100">
              {t("home.heroSubtitle")}
            </p>

            {/* Search Box */}
            <div className="max-w-4xl mx-auto mb-10 bg-white rounded-lg shadow-xl p-6 text-gray-800">
              <form
                onSubmit={handleSearch}
                className="flex flex-col md:flex-row gap-4 items-end"
              >
                <div className="flex-1 text-left w-full">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    {t("home.search.locationLabel")}
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder={t("home.search.locationPlaceholder")}
                    value={searchParams.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>

                <div className="flex-1 text-left w-full">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    {t("home.search.dateLabel")}
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={searchParams.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>

                <div className="flex-1 text-left w-full">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    {t("home.search.maxPriceLabel")}
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder={t("home.search.pricePlaceholder")}
                    value={searchParams.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                >
                  {t("home.search.searchBtn")}
                </button>
              </form>
            </div>

            {/* HERO BUTTONS (FIXED) */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              {/* Primary */}
              <Link
                to="/tours"
                className="
                  px-6 py-3 rounded-lg font-semibold
                  bg-white text-teal-700
                  hover:bg-gray-100
                  transition-all
                  shadow-md
                "
              >
                {t("home.buttons.browseTours")}
              </Link>

              {/* Secondary – FIXED (no faded look) */}
              <Link
                to="/categories"
                className="
                  px-6 py-3 rounded-lg font-semibold
                  border-2 border-teal-300
                  text-teal-100
                  hover:bg-teal-600
                  hover:text-white
                  hover:border-teal-600
                  transition-all
                  cursor-pointer
                "
              >
                {t("home.buttons.viewCategories")}
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY SECTION ================= */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t("home.why.title")}
          </h2>
          <p className="text-gray-600 mb-12">
            {t("home.why.subtitle")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t("home.why.expertTitle")}
              </h3>
              <p className="text-gray-600">
                {t("home.why.expertDesc")}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t("home.why.priceTitle")}
              </h3>
              <p className="text-gray-600">
                {t("home.why.priceDesc")}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t("home.why.supportTitle")}
              </h3>
              <p className="text-gray-600">
                {t("home.why.supportDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= POPULAR TOURS ================= */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("home.popular.title")}
          </h2>

          {loadingTours ? (
            <div className="flex justify-center">
              <div className="animate-spin h-12 w-12 border-b-2 border-teal-600 rounded-full"></div>
            </div>
          ) : toursError ? (
            <div className="text-center text-red-600">{toursError}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tours.map((tour) => (
                <Link
                  key={tour.categoryId}
                  to={`/tours/details/${tour.categoryId}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition"
                >
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">
                      {tour.categoryName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {tour.categoryDescription ||
                        t("home.popular.toursAvailable", { count: 0 })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/tours" className="btn-primary">
              {t("home.buttons.viewAllTours")}
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-teal-700 rounded-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              {t("home.cta.title")}
            </h2>
            <p className="text-xl mb-8 text-teal-100">
              {t("home.cta.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-6 py-3 bg-white text-teal-700 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                {t("home.buttons.signUpNow")}
              </Link>

              <Link
                to="/tours"
                className="px-6 py-3 border-2 border-teal-300 text-teal-100 rounded-lg font-semibold hover:bg-teal-600 hover:text-white transition"
              >
                {t("home.buttons.exploreTours")}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
