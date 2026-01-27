import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tourAPI } from '../api';

const BACKEND_URL = 'http://localhost:8080';

const getImageUrl = (path) => {
  if (!path) return null;
  const sanitizedPath = path.replace(/^"+|"+$/g, '');
  if (sanitizedPath.startsWith('http')) return sanitizedPath;
  const cleanPath = sanitizedPath.startsWith('/') ? sanitizedPath : `/${sanitizedPath}`;
  return `${BACKEND_URL}${cleanPath}`;
};

const TourDetail = () => {
  const { id } = useParams();
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
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
        <p className="text-red-600 text-xl font-semibold mb-4">{error}</p>
        <Link to="/tours" className="btn-primary">
          Back to Tours
        </Link>
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
        <p className="text-gray-500 text-xl">No tour details available.</p>
        <Link to="/tours" className="btn-primary mt-4">
          Browse Tours
        </Link>
      </div>
    );
  }

  const tour = tours[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Navigation */}
        <Link to="/tours" className="flex items-center text-teal-600 hover:text-teal-800 mb-8 transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Back to Tours</span>
        </Link>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {tour.categoryName} <span className="text-teal-600">Experience</span>
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Explore the details of this amazing journey.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Itinerary */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 md:p-8 bg-gradient-to-r from-teal-50 to-white border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <span className="bg-teal-100 text-teal-700 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.447-.894L15 7m0 13V7" />
                    </svg>
                  </span>
                  Itinerary Schedule
                </h2>
              </div>
              <div className="p-6 md:p-8 space-y-8">
                {tour.itineraries?.length > 0 ? (
                  tour.itineraries.map((day, index) => (
                    <div key={day.id} className="relative pl-8 md:pl-0">
                      {/* Timeline line for mobile visual (optional css enhancement) */}
                      <div className="flex flex-col md:flex-row gap-6 group">
                         {/* Day Number Badge */}
                         <div className="flex-shrink-0 md:w-24 flex flex-col items-center">
                            <span className="text-4xl font-black text-gray-200 group-hover:text-teal-100 transition-colors">
                              {String(day.dayNo).padStart(2, '0')}
                            </span>
                            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Day</span>
                         </div>
                         
                         {/* Content */}
                         <div className="flex-grow bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow duration-300">
                           <div className="flex flex-col sm:flex-row gap-6">
                               {day.dayWiseImage && (
                                  <div className="flex-shrink-0">
                                    <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden">
                                      <img 
                                        src={getImageUrl(day.dayWiseImage)} 
                                        alt={`Day ${day.dayNo}`} 
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                      />
                                    </div>
                                  </div>
                               )}
                               <div>
                                  <h3 className="text-lg font-bold text-gray-900 mb-2">Day {day.dayNo} Highlights</h3>
                                  <p className="text-gray-600 leading-relaxed text-sm">{day.itineraryDetail}</p>
                               </div>
                           </div>
                         </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    <p>Itinerary details are coming soon.</p>
                  </div>
                )}
              </div>
            </div>

             {/* Departures Section (Moved here from bottom to keep consistent flow or can go bottom full width) */}
             {/* Let's keep Departures full width below the grid or inside left col if requested "other things down". 
                 User said "other things down", usually implies below the main split. 
                 But let's put it as a separate full-width card BELOW the split grid as per plan.
             */}
          </div>

          {/* RIGHT COLUMN: Pricing & Action */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              
              {/* Pricing Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 bg-gray-900 text-white">
                  <h2 className="text-xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                    Pricing Packages
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {tour.costs?.length > 0 ? (
                    tour.costs.map((cost) => (
                      <div key={cost.id} className="pb-4 last:pb-0 last:border-0 border-b border-gray-100">
                        <div className="mb-3">
                          <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded">
                            Valid: {new Date(cost.validFrom).toLocaleDateString()} - {new Date(cost.validTo).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Adult (Single)</span>
                            <span className="font-bold text-gray-900 text-lg">₹{cost.singlePersonCost}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Extra Person</span>
                            <span className="font-semibold text-gray-900">₹{cost.extraPersonCost}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Child (w/ Bed)</span>
                            <span className="font-semibold text-gray-900">₹{cost.childWithBedCost}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Child (No Bed)</span>
                            <span className="font-semibold text-gray-900">₹{cost.childWithoutBedCost}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic text-center">Contact us for pricing details.</p>
                  )}
                </div>
                
                {/* Book Action Area */}
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                   <Link
                      to={`/booking/start/${tour.categoryId}`}
                      state={{ tour, departures: tour.departures }}
                      className="block w-full btn-primary text-center py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-lg font-bold"
                   >
                      Book Now
                   </Link>
                   <p className="text-xs text-center text-gray-400 mt-3">Secure payment & Instant confirmation</p>
                </div>
              </div>


            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: Available Departures */}
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pl-2 border-l-4 border-teal-500">Available Departures</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {tour.departures?.length > 0 ? (
                 tour.departures.map((dep) => (
                    <div key={dep.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-4">
                           <div className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                             Confirmed
                           </div>
                           <span className="text-gray-400">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                             </svg>
                           </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800 mb-1">
                          {new Date(dep.departDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-gray-500 text-sm mb-4">{new Date(dep.departDate).getFullYear()}</p>
                        
                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                           <div className="text-sm">
                              <p className="text-gray-500">Duration</p>
                              <p className="font-semibold text-gray-800">{dep.noOfDays} Days</p>
                           </div>
                           <div className="text-right text-sm">
                              <p className="text-gray-500">Return</p>
                              <p className="font-semibold text-gray-800">
                                {new Date(dep.endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                              </p>
                           </div>
                        </div>
                    </div>
                 ))
               ) : (
                 <div className="col-span-full text-center py-8 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No scheduled departures at the moment.</p>
                 </div>
               )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default TourDetail;