const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const busRoutes = require('./routes/busRoutes');
const routeRoutes = require('./routes/routeRoutes');
const userRoutes = require('./routes/userRoutes'); // ✅ Added
const dutyRoutes = require('./routes/dutyRoutes');
const crewRoutes = require('./routes/crewRoutes');
const alertRoutes = require('./routes/alertRoutes');
const adminRoutes = require('./routes/adminRoutes');






const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Register all routes
app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/duties', dutyRoutes);
app.use('/api/crews', crewRoutes);
app.use('/api/alerts', alertRoutes); 
app.use('/api/admin', adminRoutes);
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
