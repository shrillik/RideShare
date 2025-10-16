import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  driverName: {
    type: String,
    required: true,
  },
  driverImage: {
    type: String,
    default: '',
  },
  driverRating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  fromLat: {
    type: Number,
    required: true,
  },
  fromLng: {
    type: Number,
    required: true,
  },
  toLat: {
    type: Number,
    required: true,
  },
  toLng: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 1,
  },
  departureTime: {
    type: String,
    required: true,
  },
  departureDate: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const RideModel = mongoose.model('Ride', rideSchema);
