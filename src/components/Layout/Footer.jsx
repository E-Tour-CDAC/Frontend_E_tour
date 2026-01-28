import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {t("footer.brandTitle")}
            </h3>
            <p className="text-gray-300 mb-4">
              {t("footer.brandDesc")}
            </p>

            <div className="flex space-x-4 text-gray-300">
              <span>🌐</span>
              <span>🐦</span>
              <span>📸</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t("footer.quickLinksTitle")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  {t("footer.links.home")}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-300 hover:text-white">
                  {t("footer.links.categories")}
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-gray-300 hover:text-white">
                  {t("footer.links.tours")}
                </Link>
              </li>
              <li>
                <Link
                  to="/customer/bookings"
                  className="text-gray-300 hover:text-white"
                >
                  {t("footer.links.myBookings")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t("footer.supportTitle")}
            </h4>
            <ul className="space-y-2">
              <li className="text-gray-300">
                {t("footer.support.helpCenter")}
              </li>
              <li className="text-gray-300">
                {t("footer.support.contactUs")}
              </li>
              <li className="text-gray-300">
                {t("footer.support.privacyPolicy")}
              </li>
              <li className="text-gray-300">
                {t("footer.support.terms")}
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t("footer.contactTitle")}
            </h4>
            <div className="space-y-2 text-gray-300">
              <p>📧 {t("footer.contact.email")}</p>
              <p>📞 {t("footer.contact.phone")}</p>
              <p>📍 {t("footer.contact.address")}</p>
              <p>🕐 {t("footer.contact.hours")}</p>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          {t("footer.bottom")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
