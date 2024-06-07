const express = require('express');
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/Dbconnect");
const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//Connect to Database
connectDB();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use("/api/user", authRouter);
app.use("api/product", productRouter);


app.use(notFound);
app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
