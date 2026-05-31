const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Restaurant = require("./models-20260320/restaurant");
const FoodItem = require("./models-20260320/foodItem");
const Category = require("./models-20260320/category");
const User = require("./models-20260320/user");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const dbPath = path.join(__dirname, "Database-20260409");

const legacyRestaurants = JSON.parse(fs.readFileSync(path.join(dbPath, "Internship.restaurants.json"), "utf-8"));
const legacyFoodItems = JSON.parse(fs.readFileSync(path.join(dbPath, "Internship.fooditems.json"), "utf-8"));
const legacyMenus = JSON.parse(fs.readFileSync(path.join(dbPath, "Internship.menus.json"), "utf-8"));

const importData = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected to DB...");

    // 1. Get/Create Owner
    let owner = await User.findOne({ role: "restaurant-owner" });
    if (!owner) {
      owner = await User.create({
        name: "Legacy Manager",
        email: "manager@internship.com",
        password: "password123",
        passwordConfirm: "password123",
        phoneNumber: "9876543210",
        role: "restaurant-owner"
      });
    }

    // 2. Clear current restaurants/items/categories to prevent duplicates during fresh launch
    await Restaurant.deleteMany({});
    await FoodItem.deleteMany({});
    await Category.deleteMany({});

    console.log("Cleared old data. Importing legacy JSONs...");

    // 3. Map Legacy IDs to new MongoDB IDs if needed, but we can reuse the OIDs
    const cleanId = (idObj) => idObj.$oid || idObj;

    // 4. Import Restaurants
    for (let res of legacyRestaurants) {
      await Restaurant.create({
        _id: cleanId(res._id),
        name: res.name,
        isVeg: res.isVeg || false,
        address: res.address || "No address provided",
        location: {
          type: "Point",
          coordinates: res.location?.coordinates || [0, 0]
        },
        ratings: res.ratings || 0,
        numOfReviews: res.numOfReviews || 0,
        reviews: res.reviews || [],
        phoneNumber: "0000000000", // Legacy data doesn't have phone
        owner: owner._id,
        description: `Legacy internship data for ${res.name}`,
        images: res.images || [],
        logo: res.images && res.images[0] ? res.images[0] : null
      });
    }
    console.log(`Imported ${legacyRestaurants.length} Restaurants.`);

    // 5. Import Food Items
    const foodItemMap = {};
    for (let item of legacyFoodItems) {
      // Find a category name for this item from menus.json
      // This is tricky because items belong to categories in menus.json
      // We will create categories on the fly in the next loop.
      // For now, let's just create the items with a placeholder category
      foodItemMap[cleanId(item._id)] = item;
    }

    // 6. Process Menus and Categories
    for (let menuEntry of legacyMenus) {
      const restaurantId = cleanId(menuEntry.restaurant);
      
      for (let catEntry of menuEntry.menu) {
        // Create Category
        const category = await Category.create({
          name: catEntry.category,
          restaurant: restaurantId
        });

        // Create Items for this category
        for (let itemIdObj of catEntry.items) {
          const itemId = cleanId(itemIdObj);
          const rawItem = foodItemMap[itemId];

          if (rawItem) {
            await FoodItem.create({
              _id: itemId,
              name: rawItem.name,
              price: rawItem.price,
              description: rawItem.description || "No description",
              ratings: rawItem.ratings || 0,
              images: rawItem.images || [],
              category: category._id,
              stock: rawItem.stock || 50,
              restaurant: restaurantId,
              numOfReviews: rawItem.numOfReviews || 0,
              reviews: rawItem.reviews || []
            });
          }
        }
      }
    }

    console.log("Successfully linked all items and categories!");
    process.exit(0);
  } catch (err) {
    console.error("Import failed:", err);
    process.exit(1);
  }
};

importData();
