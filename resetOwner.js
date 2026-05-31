const mongoose = require("mongoose");
const User = require("./models-20260320/user");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

mongoose.connect(process.env.DB_URI).then(async () => {
  console.log("DB Connected...");
  try {
    // Delete any existing owner account and recreate it fresh
    await User.deleteOne({ email: "owner@foodgenie.com" });

    const owner = new User({
      name: "Master Chef",
      email: "owner@foodgenie.com",
      password: "password123",
      passwordConfirm: "password123",
      phoneNumber: "9988776655",
      role: "restaurant-owner",
    });

    // .save() triggers the pre-save hook which hashes the password correctly
    await owner.save();

    console.log("✅ Restaurant Owner account ready!");
    console.log("   Email   : owner@foodgenie.com");
    console.log("   Password: password123");
    console.log("   Role    : restaurant-owner");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}).catch(err => {
  console.error("DB Error:", err.message);
  process.exit(1);
});
