//import express 
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyparser = require('body-parser');

// Import middlewares
const errorMiddleware = require('./middlewares-20260320/errors');

//create express application
const app = express();

//use middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(bodyparser.json());
app.use(cookieParser());

// Import all routes
const authRoutes = require('./routes-20260320/auth');
const restaurantRoutes = require('./routes-20260320/restaurant');
const menuRoutes = require('./routes-20260320/menu');
const categoryRoutes = require('./routes-20260320/category');
const cartRoutes = require('./route-20260330/cart');
const adminRoutes = require('./routes-20260320/admin');
const orderRoutes = require('./routes-20260320/order');

app.use("/api/v1/user", authRoutes);
app.use("/api/v1/restaurants", restaurantRoutes);
app.use("/api/v1/menu", menuRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/orders", orderRoutes);

// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;
