import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../UI/LanguageSwitcher";

import EarthLogo from "../../assets/images/EarthLogo.png";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-[1000] relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={EarthLogo}
              alt={t("nav.logoAlt")}
              className="h-10 w-auto transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
            />
            <span className="text-2xl font-bold text-blue-600">
              {t("nav.brand")}
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="nav-link">
              {t("nav.home")}
            </Link>

            <Link to="/tours" className="nav-link">
              {t("nav.tours")}
            </Link>

            {isAuthenticated && (
              <>
                <Link to="/customer/bookings" className="nav-link">
                  {t("nav.bookings")}
                </Link>
                <Link to="/customer/profile" className="nav-link">
                  {t("nav.profile")}
                </Link>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700">
                  {t("nav.welcome", {
                    name: user?.first_name || user?.email
                  })}
                </span>

                <button
                  onClick={logout}
                  className="btn-secondary text-sm"
                >
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t("nav.login")}
                </Link>

                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  {t("nav.signup")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 🌍 FLOATING Language Switcher — CLICKABLE FIX */}
      <div className="absolute top-full right-6 mt-2 z-[9999] pointer-events-auto">
        <LanguageSwitcher />
      </div>
    </nav>
  );
};

export default Navbar;
