const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors'); 


const cookieParser = require('cookie-parser');

const jswt = require('jsonwebtoken');

const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const dbURL = process.env.DATABASE_URL;

const port = process.env.PORT || 4000;

const app = express();



// Add middlewares

// To allow cross origin resource sharing
app.use(cors());

app.use(cookieParser());

// To read json objects
app.use(express.json());

// to read forms
app.use(express.urlencoded({extended: true }));



const userRouter = require('./routes/userRoutes.js');
const productRouter = require('./routes/productRoutes.js');
const orderRouter = require('./routes/orderRoutes.js');
const orderItemRouter = require('./routes/orderitemRoutes.js');

const appPath = path.join(__dirname, 'app');

console.log(appPath);



app.use("/app", express.static(appPath));


mongoose.connect(dbURL,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

// Propmpts a message once connected
mongoose.connection.once('open', () => console.log(`Now connected to Dela Rosa-Mongo DB Atlas.`));

app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/orderitems", orderItemRouter);

app.use('/', (req, res) => {
    return res.redirect('/app');
})


app.listen(port, () => {
	console.log(`API is now online on port ${port}`);
});