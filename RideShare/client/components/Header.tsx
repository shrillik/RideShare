import { Car } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary p-2 rounded-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-ride-dark">RideShare</span>
          </Link>

          <nav className="hidden md:flex gap-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Find Rides
            </Link>
            <Link
              to="/offer-ride"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Offer Rides
            </Link>
            <a
              href="#about"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden sm:block px-4 py-2 text-primary font-medium hover:bg-gray-50 rounded-lg transition-colors">
              Sign In
            </button>
            <button className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
