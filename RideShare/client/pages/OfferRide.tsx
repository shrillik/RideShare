import { useState } from 'react';
import { ArrowRight, MapPin, Calendar, Clock, Users, DollarSign } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function OfferRide() {
  const [formData, setFormData] = useState({
    driverName: '',
    from: '',
    to: '',
    fromLat: 12.9716,
    fromLng: 77.5946,
    toLat: 13.0827,
    toLng: 80.2707,
    departureDate: '',
    departureTime: '',
    availableSeats: '2',
    price: '',
    driverRating: 4.5,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.driverName || !formData.from || !formData.to || !formData.departureDate || !formData.departureTime || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create ride');
      }

      const result = await response.json();

      if (result.success) {
        toast.success('Ride posted successfully! 🎉');
        // Reset form
        setFormData({
          driverName: '',
          from: '',
          to: '',
          fromLat: 12.9716,
          fromLng: 77.5946,
          toLat: 13.0827,
          toLng: 80.2707,
          departureDate: '',
          departureTime: '',
          availableSeats: '2',
          price: '',
          driverRating: 4.5,
        });
      } else {
        toast.error('Failed to post ride');
      }
    } catch (error) {
      console.error('Error posting ride:', error);
      toast.error('Error posting ride. Please try again.');
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
              Offer Your Ride
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Share your journey and earn money while helping others get to their destination safely and affordably.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Post Your Ride</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Driver Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* From and To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  From *
                </label>
                <input
                  type="text"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  placeholder="Pickup location"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  To *
                </label>
                <input
                  type="text"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  placeholder="Dropoff location"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Date *
                </label>
                <input
                  type="date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Departure Time *
                </label>
                <input
                  type="time"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Seats and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline w-4 h-4 mr-1" />
                  Available Seats *
                </label>
                <select
                  name="availableSeats"
                  value={formData.availableSeats}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Seat' : 'Seats'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-1" />
                  Price per Seat *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
              >
                {loading ? 'Posting...' : 'Post Your Ride'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>

          <p className="text-sm text-gray-500 mt-4">
            * All fields are required
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Why Offer Your Ride?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Earn Money</h3>
            <p className="text-gray-600">
              Cover your travel costs and earn extra money by sharing your ride.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Meet People</h3>
            <p className="text-gray-600">
              Connect with like-minded travelers and make new friends on the road.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Help Others</h3>
            <p className="text-gray-600">
              Provide affordable transportation options to people in your community.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ride-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 RideShare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
