import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Card from '../components/UI/Card';
import Tabs from '../components/UI/Tabs';
import { tourAPI } from '../api';

const TourDetail = () => {
  const { id } = useParams();
  const { setTour } = useBooking();
  const [tour, setTourData] = useState(null);
  const [departures, setDepartures] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTourData();
  }, [id]);

  const fetchTourData = async () => {
    try {
      setLoading(true);
      const [tourRes, departuresRes, itineraryRes, pricingRes, guidesRes] = await Promise.all([
        tourAPI.getTour(id),
        tourAPI.getDepartures(id),
        tourAPI.getItinerary(id),
        tourAPI.getPricing(id),
        tourAPI.getGuides(id)
      ]);

      setTourData(tourRes.data);
      setDepartures(departuresRes.data);
      setItinerary(itineraryRes.data);
      setPricing(pricingRes.data);
      setGuides(guidesRes.data);
      setTour(tourRes.data);
    } catch (err) {
      setError('Failed to fetch tour details');
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

  if (error || !tour) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">{error || 'Tour not found'}</p>
        <Link to="/tours" className="mt-4 inline-block btn-primary">
          Back to Tours
        </Link>
      </div>
    );
  }

  const itineraryTab = {
    label: 'Itinerary',
    content: (
      <div className="space-y-4">
        {itinerary.map((item, index) => (
          <div key={item.id} className="border-l-4 border-teal-500 pl-4">
            <div className="flex items-center mb-2">
              <span className="bg-teal-100 text-teal-800 text-sm font-medium px-2 py-1 rounded">
                Day {item.day_number}
              </span>
              <span className="ml-2 text-gray-500 text-sm">
                {item.date}
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">
              {item.title}
            </h4>
            <p className="text-gray-600">
              {item.description}
            </p>
            {item.meals && (
              <div className="mt-2 text-sm text-gray-500">
                Meals: {item.meals}
              </div>
            )}
            {item.accommodation && (
              <div className="mt-1 text-sm text-gray-500">
                Accommodation: {item.accommodation}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  };

  const pricingTab = {
    label: 'Pricing',
    content: (
      <div className="space-y-4">
        {pricing.map((price, index) => (
          <Card key={price.id}>
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                {price.season_type} Season
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-gray-500 text-sm">Single Person</span>
                  <p className="text-xl font-bold text-teal-700">
                    ${price.single_person_cost}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Extra Person</span>
                  <p className="text-xl font-bold text-teal-700">
                    ${price.extra_person_cost}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Child (with bed)</span>
                  <p className="text-xl font-bold text-teal-700">
                    ${price.child_with_bed_cost}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Child (no bed)</span>
                  <p className="text-xl font-bold text-teal-700">
                    ${price.child_without_bed_cost}
                  </p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Valid from: {new Date(price.valid_from).toLocaleDateString()}</p>
                <p>Valid to: {new Date(price.valid_to).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  };

  const guidesTab = {
    label: 'Tour Guides',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <Card key={guide.id}>
            <div className="p-4">
              <div className="flex items-center mb-3">
                {guide.photo_url ? (
                  <img
                    src={guide.photo_url}
                    alt={guide.guide_name}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-500 text-sm">No Photo</span>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {guide.guide_name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {guide.specialization}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p className="mb-1">Languages: {guide.languages}</p>
                <p className="mb-1">Experience: {guide.experience_years} years</p>
                <p>Rating: ⭐ {guide.rating || '4.5'}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/tours" className="text-teal-700 hover:text-teal-800 mb-4 inline-block">
          ← Back to Tours
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            {tour.image_url ? (
              <img
                src={tour.image_url}
                alt={tour.tour_name}
                className="w-full h-96 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}
          </div>

          <div className="mb-8">
            <div className="flex items-center mb-4">
              <span className="bg-teal-100 text-teal-800 text-sm font-medium px-3 py-1 rounded">
                {tour.category_name}
              </span>
              {tour.featured && (
                <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded">
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {tour.tour_name}
            </h1>
            <div className="flex items-center space-x-6 text-gray-600 mb-6">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {tour.duration_days} days
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {tour.rating || '4.5'} rating
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {tour.difficulty_level}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {tour.description}
            </p>
          </div>

          <Tabs tabs={[itineraryTab, pricingTab, guidesTab]} />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <Card>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Book This Tour
                </h3>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-teal-700 mb-2">
                    From ${tour.starting_price}
                  </div>
                  <p className="text-gray-600 text-sm">
                    Price per person
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Free cancellation
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Instant confirmation
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Professional guides
                  </div>
                </div>

                <Link
                  to={`/booking/start/${tour.id}`}
                  className="w-full btn-primary text-center block"
                >
                  Book Now
                </Link>

                <div className="mt-4 text-center">
                  <Link
                    to={`/tours/${tour.id}/departures`}
                    className="text-teal-700 hover:text-teal-800 text-sm"
                  >
                    View departure dates →
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
