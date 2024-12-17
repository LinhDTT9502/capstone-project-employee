import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center  from-gray-900 via-gray-800 to-gray-900">
      {/* Content Container */}
      <div className="relative bg-neutral-900 bg-opacity-80 shadow-2xl rounded-lg p-8 sm:p-12 text-center text-white max-w-lg mx-4">
        {/* Overlay Animation */}

        {/* Heading */}
        <h1 className="text-5xl font-bold mb-4 text-orange-400">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>

        {/* Description */}
        <p className="text-gray-300 mb-6 leading-relaxed">
          Oops! Looks like you followed a bad link. If you think this is a
          problem with us, please let us know.
        </p>

        {/* Go Home Button */}
        <Link
          to="/"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full text-lg font-medium transition-transform transform hover:scale-105 duration-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
