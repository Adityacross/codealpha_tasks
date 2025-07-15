const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('DB connection error:', err));

// Root route
app.get('/', (req, res) => {
    res.send('Collaboard API is running...');
});

// Routes
const taskRoutes = require('../backend/routes/TaskRoutes');
app.use('/api/tasks', taskRoutes);

const authRoutes = require('../backend/routes/auth');
app.use('/api/auth', authRoutes);

const boardRoutes = require('../backend/routes/boards'); 
app.use('/api/boards', boardRoutes);                          

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
