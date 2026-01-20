import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import TourList from "../pages/TourList";
import TourDetails from "../pages/TourDetails";
import Booking from "../pages/Booking";
import Payment from "../pages/Payment";

const AppRoutes = () => {
  return (
    
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tours" element={<TourList />} />
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/booking/:tourId" element={<Booking />} />
      <Route path="/payment/:bookingId" element={<Payment />} />
    </Routes>
   
  );
};

export default AppRoutes;
