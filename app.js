const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/connectDb'); 
const userRoutes = require('./routes/userRoute'); 
const productRoutes = require('./routes/productRoute'); 
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const blogRoutes = require("./routes/blogRoute");

// Load environment variables
require('dotenv').config();

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use user and product routes
app.use('/api/users', userRoutes); 
app.use('/api/products', productRoutes); 
app.use('/api/blogs', blogRoutes); 

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
