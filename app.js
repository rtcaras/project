const express = require('express');
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/Dbconnect");
const authRoutes = require('./routes/authRoute');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


//Connect to Database
connectDB();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api/user', authRoutes);


app.use(notFound);
app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
