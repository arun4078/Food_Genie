const mongoose = require("mongoose");
const User = require("./models-20260320/user");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

mongoose.connect(process.env.DB_URI).then(async () => {
  console.log("DB Connected. Creating admin user...");
  try {
    // Remove any existing admin to avoid duplicates
    await User.deleteOne({ email: "admin@foodgenie.com" });

    const admin = new User({
      name: "Admin",
      email: "admin@foodgenie.com",
      password: "admin123456",
      passwordConfirm: "admin123456",
      phoneNumber: "0000000000",
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
    console.log("   Email   : admin@foodgenie.com");
    console.log("   Password: admin123456");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  }
}).catch(err => {
  console.error("DB Connection Error:", err.message);
  process.exit(1);
});
