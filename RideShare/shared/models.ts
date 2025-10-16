export interface Ride {
  _id?: string;
  driverName: string;
  driverImage?: string;
  driverRating: number;
  from: string;
  to: string;
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  price: number;
  availableSeats: number;
  departureTime: string;
  departureDate: string;
  createdAt?: Date;
}

export interface SearchRideRequest {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

export interface SearchRideResponse {
  success: boolean;
  data?: Ride[];
  error?: string;
}
