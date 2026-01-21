const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const weatherRoutes = require('./routes/WeatherRoutes');   

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/weather', weatherRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message : 'server is runing'
    });
});

app.use((err , req , res , next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message : 'Something Went Wrong!',
        error: err.message
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});