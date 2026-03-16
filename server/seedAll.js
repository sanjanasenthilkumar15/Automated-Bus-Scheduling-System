const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/User');
const Bus = require('./models/Bus');
const Crew = require('./models/Crew');
const Route = require('./models/Route');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dtc-bus';

const users = [
  { name: 'Admin User', email: 'admin@dtc.com', password: 'admin123', role: 'admin' },
  { name: 'Scheduler One', email: 'scheduler@dtc.com', password: 'sched123', role: 'scheduler' },
  { name: 'Depot Manager', email: 'depot@dtc.com', password: 'depot123', role: 'depotManager' },
];

// Routes with added path coordinates
const routes = [
  {
    routeNumber: '15G',
    description: "Parry's → Sholinganallur",
    origin: "Parry's",
    destination: 'Sholinganallur',
    distanceKm: 27,
    roundTripTime: 90,
    frequency: 10,
    path: [
      [13.086, 80.287],
      [13.056, 80.248],
      [12.971, 80.223],
      [12.915, 80.230],
    ]
  },
  {
    routeNumber: '27D',
    description: 'Vadapalani → Thiruvanmiyur',
    origin: 'Vadapalani',
    destination: 'Thiruvanmiyur',
    distanceKm: 18,
    roundTripTime: 70,
    frequency: 12,
    path: [
      [13.050, 80.212],
      [13.022, 80.231],
      [12.982, 80.245],
      [12.980, 80.256],
    ]
  },
  {
    routeNumber: '570',
    description: 'CMBT → Kelambakkam (Via OMR)',
    origin: 'CMBT',
    destination: 'Kelambakkam',
    distanceKm: 35,
    roundTripTime: 100,
    frequency: 8,
    path: [
      [13.069, 80.217],
      [12.983, 80.248],
      [12.919, 80.252],
      [12.788, 80.229],
    ]
  },
  {
    routeNumber: '29C',
    description: 'Broadway → Besant Nagar',
    origin: 'Broadway',
    destination: 'Besant Nagar',
    distanceKm: 15,
    roundTripTime: 50,
    frequency: 15,
    path: [
      [13.093, 80.284],
      [13.020, 80.265],
      [12.996, 80.262],
      [12.998, 80.269],
    ]
  },
  {
    routeNumber: '102A',
    description: 'T Nagar → Tambaram',
    origin: 'T Nagar',
    destination: 'Tambaram',
    distanceKm: 22,
    roundTripTime: 80,
    frequency: 12,
    path: [
      [13.040, 80.234],
      [12.987, 80.179],
      [12.920, 80.120],
      [12.922, 80.112],
    ]
  },
];


const buses = Array.from({ length: 35 }, (_, i) => ({
  busNumber: `TN-01-${String.fromCharCode(65 + Math.floor(i / 10))}-${1000 + i}`,
  status: i % 7 === 0 ? 'maintenance' : 'active',
  capacity: 50,
}));

const crews = [
  ...Array.from({ length: 25 }, (_, i) => ({
    name: `Driver${i + 1}`,
    role: 'driver',
    status: 'available',
  })),
  ...Array.from({ length: 25 }, (_, i) => ({
    name: `Conductor${i + 1}`,
    role: 'conductor',
    status: 'available',
  })),
];

const seedAll = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Drop existing collections safely
    await Promise.allSettled([
      mongoose.connection.db.dropCollection('users'),
      mongoose.connection.db.dropCollection('routes'),
      mongoose.connection.db.dropCollection('buses'),
      mongoose.connection.db.dropCollection('crews'),
    ]);

    const hashedUsers = await Promise.all(
      users.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 10),
      }))
    );

    await User.insertMany(hashedUsers);
    await Route.insertMany(routes);
    await Bus.insertMany(buses);
    await Crew.insertMany(crews);

    console.log('🚀 Seeding complete: 3 users, 5 routes (with paths), 35 buses, 50 crew members.');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    mongoose.disconnect();
  }
};

seedAll();
