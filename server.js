require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const citiesRoutes = require('./routes/cities');
const propertiesRoutes = require('./routes/properties');

const app = express();

// Connect to MongoDB
const mongoURI = 'mongodb+srv://stayora_dev_db:7p8YKu7lZ6Qvqyme@cluster0.xvmqwvb.mongodb.net/stayora-db?retryWrites=true&w=majority'; // Replace with your actual MongoDB URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Student Management System API');
});

app.use('/auth', authRoutes);
app.use('/cities', citiesRoutes);
app.use('/properties', propertiesRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});