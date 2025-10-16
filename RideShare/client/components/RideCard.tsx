import { Users, MapPin, Clock, DollarSign } from 'lucide-react';
import { Button } from './ui/button';

interface RideCardProps {
  from: string;
  to: string;
  time: string;
  price: number;
  driver: string;
  driverImage?: string;
  seats: number;
  rating: number;
  onSelect?: () => void;
}

export function RideCard({
  from,
  to,
  time,
  price,
  driver,
  driverImage,
  seats,
  rating,
  onSelect,
}: RideCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex gap-3 mb-3">
        {driverImage && (
          <img
            src={driverImage}
            alt={driver}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{driver}</h3>
          <div className="flex items-center gap-1">
            <span className="text-sm text-yellow-500">★ {rating}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-primary">${price}</div>
          <div className="text-xs text-gray-500">{seats} seats</div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex gap-2 items-start">
          <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{from}</div>
            <div className="text-xs text-gray-500">Pickup point</div>
          </div>
        </div>

        <div className="border-l-2 border-gray-200 ml-2 h-4" />

        <div className="flex gap-2 items-start">
          <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{to}</div>
            <div className="text-xs text-gray-500">Dropoff point</div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 items-center justify-between py-3 border-t border-gray-200">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          {time}
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          {seats}
        </div>
      </div>

      <Button
        onClick={onSelect}
        className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg"
      >
        Book Ride
      </Button>
    </div>
  );
}
