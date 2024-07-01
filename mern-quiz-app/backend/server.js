const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes'); 
const quizRoutes = require("./routes/quizRoutes")
const cors = require('cors')

const app = express();


app.use(cors())

dotenv.config(); // Load environment variables from .env file


// Middleware to parse JSON bodies
app.use(express.json());
// Connect to MongoDB
let db;
const initializeDBConnection = async () => {
    try {
        db =  await connectDB();
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // Exit process with failure
    }
};

initializeDBConnection();

// Mount userRoutes at /api/users
app.use('/api/users', userRoutes); 
// Mount quizRoutes at /api/users
app.use('/api/quizzes', quizRoutes);


// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
