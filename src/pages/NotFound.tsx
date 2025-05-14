
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    // Add more detailed debugging
    console.log("Current pathname:", location.pathname);
    console.log("Expected route for Benita:", "/clients/Benita Mendez");
    console.log("URL encoded version:", "/clients/Benita%20Mendez");
    console.log("Are they equal?", location.pathname === "/clients/Benita Mendez");
    console.log("Decoded pathname:", decodeURIComponent(location.pathname));
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found: {location.pathname}</p>
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </Link>
        <div className="mt-4">
          <Link to="/clients" className="text-blue-500 hover:text-blue-700 underline">
            Go to Clients List
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
