const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows JSON body parsing

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
      console.error('❌ MongoDB connection error:', err);
      process.exit(1);
  });

// --- Route Imports ---
const authRoutes = require('./routes/auth');    // Login/Register
const taskRoutes = require('./routes/tasks');   // Task CRUD



// --- Route Middleware ---
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);



// Home route (optional)
app.get('/', (req, res) => {
    res.send('QuickTask Manager API is running.');
});



// Error Handling Middleware (optional but useful)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// --- Server Listen ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
