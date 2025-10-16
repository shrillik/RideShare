import { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, ArrowRight, Car, Loader } from 'lucide-react';
import { Header } from '@/components/Header';
import { RideCard } from '@/components/RideCard';
import { MapView } from '@/components/MapView';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Ride } from '@shared/models';

interface RideCardData extends Ride {
  id: string;
  time: string;
  driver: string;
  rating: number;
  lat: number;
  lng: number;
}

export default function Index() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [showMap, setShowMap] = useState(false);
  const [rides, setRides] = useState<RideCardData[]>([]);
  const [loading, setLoading] = useState(false);

  // Seed initial data on component mount
  useEffect(() => {
    const seedData = async () => {
      try {
        const response = await fetch('/api/rides/seed', {
          method: 'POST',
        });
        if (response.ok) {
          console.log('Database seeded with sample rides');
        }
      } catch (error) {
        console.log('Seed data skipped or already exists');
      }
    };
    seedData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!from.trim() || !to.trim()) {
      toast.error('Please enter both departure and destination locations');
      return;
    }

    setLoading(true);
    setShowMap(true);

    try {
      const params = new URLSearchParams({
        from: from.trim(),
        to: to.trim(),
        date: date || new Date().toISOString().split('T')[0],
        passengers,
      });

      const response = await fetch(`/api/rides/search?${params}`);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        const formattedRides: RideCardData[] = data.data.map((ride: Ride) => ({
          ...ride,
          id: ride._id || Math.random().toString(),
          time: ride.departureTime,
          driver: ride.driverName,
          rating: ride.driverRating,
          lat: ride.fromLat,
          lng: ride.fromLng,
        }));

        if (formattedRides.length === 0) {
          toast.info(`No rides found from ${from} to ${to}`);
        } else {
          toast.success(`Found ${formattedRides.length} available rides!`);
        }

        setRides(formattedRides);
      } else {
        toast.error(data.error || 'Failed to search rides');
        setRides([]);
      }
    } catch (error) {
      console.error('Error searching rides:', error);
      toast.error('Error searching rides. Please try again.');
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/90 to-primary/70 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Share Rides, Save Money
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Find affordable rides with verified drivers or offer your own. Travel smart with our carpooling platform.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Ride</h2>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Pickup location"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Dropoff location"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passengers
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Person' : 'People'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-end">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  Search
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {showMap ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rides List */}
            <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  Available Rides ({rides.length})
                </h3>
                {loading && <Loader className="w-5 h-5 animate-spin text-primary" />}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-primary mb-3" />
                  <p className="text-gray-600">Searching for rides...</p>
                </div>
              ) : rides.length > 0 ? (
                rides.map((ride) => (
                  <RideCard
                    key={ride.id}
                    from={ride.from}
                    to={ride.to}
                    time={ride.time}
                    price={ride.price}
                    driver={ride.driver}
                    driverImage={ride.driverImage}
                    seats={ride.availableSeats}
                    rating={ride.rating}
                    onSelect={() => {
                      toast.success(`Booking ${ride.driver}'s ride from ${ride.from} to ${ride.to}!`);
                    }}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <p>No rides found for this route</p>
                  <p className="text-sm mt-2">Try searching with different locations</p>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[600px]">
                {rides.length > 0 ? (
                  <MapView rides={rides} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    {loading ? 'Loading map...' : 'No rides to display on map'}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Enter your details above and search to see available rides
            </p>
          </div>
        )}
      </section>

      {/* Offer Rides CTA Section */}
      <section
        id="offer"
        className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 mb-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want to Earn Money?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Offer your empty seats to other travelers and earn extra money while covering your travel costs.
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-lg text-lg">
            Offer a Ride
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Why Choose RideShare?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Tracking</h3>
            <p className="text-gray-600">
              Track your ride in real-time with our integrated map system.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Drivers</h3>
            <p className="text-gray-600">
              All drivers are verified and rated by the community for your safety.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Booking</h3>
            <p className="text-gray-600">
              Book your ride in just a few clicks with our simple interface.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ride-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Car className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">RideShare</span>
              </div>
              <p className="text-gray-400">The modern carpooling platform</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-primary transition-colors">Find Rides</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Offer Rides</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RideShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
