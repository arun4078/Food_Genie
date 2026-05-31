const mongoose = require('mongoose');

const connectDatabase = () => {
  // Use DB_URI from environment variables, fallback to localhost if not found
  const dbURI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/food-order';

  mongoose
    .connect(dbURI)
    .then((con) => {
      console.log(`MongoDB Database connected with HOST: ${con.connection.host}`);
    })
    .catch((error) => {
      console.error(`Error connecting to MongoDB: ${error.message}`);
      console.warn("Continuing to run server on Port 5000 despite DB failure.");
      // process.exit(1);
    });
};

module.exports = connectDatabase;