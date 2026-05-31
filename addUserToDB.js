const mongoose = require("mongoose");
const User = require("./models-20260320/user");
const dotenv = require("dotenv");

// Load connection string from .env
dotenv.config({ path: "./.env" });

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log("DB Connected. Adding user...");
  try {
    const user = new User({
      name: "Test User",
      email: "testuser123@example.com",
      password: "password123",
      passwordConfirm: "password123",
      phoneNumber: "1234567890",
      role: "user"
    });
    // This will trigger the pre save middleware and hash the password
    await user.save();
    console.log("User added successfully. Check database.");
    process.exit(0);
  } catch (err) {
    console.error("Error adding user: ", err);
    process.exit(1);
  }
}).catch(err => {
  console.error("DB Connection Error: ", err);
  process.exit(1);
});
