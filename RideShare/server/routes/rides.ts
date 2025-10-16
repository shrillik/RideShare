import { RequestHandler } from 'express';
import { RideModel } from '../models/Ride';
import { SearchRideRequest, SearchRideResponse } from '@shared/models';

export const searchRides: RequestHandler = async (req, res) => {
  try {
    const { from, to, date, passengers } = req.query as unknown as SearchRideRequest;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        error: 'From and To locations are required',
      });
    }

    // Search rides matching the from, to, and date
    // Using case-insensitive search for locations
    const query: any = {
      from: { $regex: from, $options: 'i' },
      to: { $regex: to, $options: 'i' },
    };

    if (date) {
      query.departureDate = date;
    }

    if (passengers) {
      query.availableSeats = { $gte: parseInt(passengers as unknown as string) };
    }

    const rides = await RideModel.find(query).limit(20);

    return res.json({
      success: true,
      data: rides,
    } as SearchRideResponse);
  } catch (error) {
    console.error('Error searching rides:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to search rides',
    });
  }
};

export const getAllRides: RequestHandler = async (req, res) => {
  try {
    const rides = await RideModel.find().limit(50);
    return res.json({
      success: true,
      data: rides,
    });
  } catch (error) {
    console.error('Error fetching rides:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch rides',
    });
  }
};

export const createRide: RequestHandler = async (req, res) => {
  try {
    const rideData = req.body;
    const ride = new RideModel(rideData);
    await ride.save();
    return res.status(201).json({
      success: true,
      data: ride,
    });
  } catch (error) {
    console.error('Error creating ride:', error);
    return res.status(400).json({
      success: false,
      error: 'Failed to create ride',
    });
  }
};

export const seedRides: RequestHandler = async (req, res) => {
  try {
    // Clear existing rides
    await RideModel.deleteMany({});

    // Sample rides data for different cities
    const sampleRides = [
      {
        driverName: 'Rajesh Kumar',
        driverImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
        driverRating: 4.8,
        from: 'Bangalore',
        to: 'Mysore',
        fromLat: 12.9716,
        fromLng: 77.5946,
        toLat: 12.2958,
        toLng: 76.6394,
        price: 350,
        availableSeats: 3,
        departureTime: '09:00 AM',
        departureDate: new Date().toISOString().split('T')[0],
      },
      {
        driverName: 'Priya Singh',
        driverImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
        driverRating: 4.9,
        from: 'Bangalore',
        to: 'Hyderabad',
        fromLat: 12.9716,
        fromLng: 77.5946,
        toLat: 17.3850,
        toLng: 78.4867,
        price: 450,
        availableSeats: 2,
        departureTime: '03:30 PM',
        departureDate: new Date().toISOString().split('T')[0],
      },
      {
        driverName: 'Amit Patel',
        driverImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
        driverRating: 4.7,
        from: 'Bangalore',
        to: 'Chennai',
        fromLat: 12.9716,
        fromLng: 77.5946,
        toLat: 13.0827,
        toLng: 80.2707,
        price: 500,
        availableSeats: 4,
        departureTime: '04:00 PM',
        departureDate: new Date().toISOString().split('T')[0],
      },
      {
        driverName: 'Neha Gupta',
        driverImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha',
        driverRating: 4.6,
        from: 'Bangalore',
        to: 'Pune',
        fromLat: 12.9716,
        fromLng: 77.5946,
        toLat: 18.5204,
        toLng: 73.8567,
        price: 650,
        availableSeats: 3,
        departureTime: '10:00 AM',
        departureDate: new Date().toISOString().split('T')[0],
      },
      {
        driverName: 'Vikram Reddy',
        driverImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
        driverRating: 4.8,
        from: 'Bangalore',
        to: 'Coimbatore',
        fromLat: 12.9716,
        fromLng: 77.5946,
        toLat: 11.0081,
        toLng: 76.9875,
        price: 400,
        availableSeats: 2,
        departureTime: '02:00 PM',
        departureDate: new Date().toISOString().split('T')[0],
      },
      {
        driverName: 'Sneha Sharma',
        driverImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
        driverRating: 4.9,
        from: 'Mysore',
        to: 'Bangalore',
        fromLat: 12.2958,
        fromLng: 76.6394,
        toLat: 12.9716,
        toLng: 77.5946,
        price: 350,
        availableSeats: 3,
        departureTime: '11:00 AM',
        departureDate: new Date().toISOString().split('T')[0],
      },
    ];

    const inserted = await RideModel.insertMany(sampleRides);
    return res.json({
      success: true,
      message: `${inserted.length} sample rides created`,
      data: inserted,
    });
  } catch (error) {
    console.error('Error seeding rides:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to seed rides',
    });
  }
};
