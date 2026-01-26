import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

import Tours from "../pages/Tours";
import TourDetail from "../pages/TourDetail";
import BookingStart from "../pages/BookingStart";
import CustomerProfile from "../pages/CustomerProfile";
import CustomerBookings from "../pages/CustomerBookings";
import AdminDashboard from "../pages/Admin/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:id" element={<Tours />} />
      <Route path="/tours/details/:id" element={<TourDetail />} />
      <Route path="/booking/start/:tourId" element={<BookingStart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/customer/profile" element={<CustomerProfile />} />
      <Route path="/customer/bookings" element={<CustomerBookings />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
