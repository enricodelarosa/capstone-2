const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors'); 

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

// To read json objects
app.use(express.json());

// to read forms
app.use(express.urlencoded({extended: true }));

mongoose.connect(dbURL,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

// Propmpts a message once connected
mongoose.connection.once('open', () => console.log(`Now connected to Dela Rosa-Mongo DB Atlas.`));

const userRouter = require('./routes/userRoutes.js')
const productRouter = require('./routes/productRoutes.js')

app.use("/users", userRouter);
app.use("/products", productRouter);

app.listen(port, () => {
	console.log(`API is now online on port ${port}`);
});