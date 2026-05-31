const mongoose = require("mongoose");
const FoodItem = require("./models-20260320/menu");
const Restaurant = require("./models-20260320/restaurant");
const Category = require("./models-20260320/category");
const User = require("./models-20260320/user");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const foodData = [
  { name: "Juicy Cheeseburger", price: 10.99, description: "Classic juicy cheeseburger with fresh toppings.", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop" },
  { name: "Fresh Pepperoni Pizza", price: 14.50, description: "Hot pepperoni pizza with melted mozzarella.", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop" },
  { name: "Salmon Sushi Platter", price: 18.00, description: "Fresh salmon sushi served with wasabi and soy sauce.", url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop" },
  { name: "Pesto Pasta", price: 12.99, description: "Delicious pasta tossed in fresh basil pesto source.", url: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=800&auto=format&fit=crop" },
  { name: "Chocolate Cupcakes", price: 6.50, description: "Rich chocolate cupcakes with creamy frosting.", url: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=800&auto=format&fit=crop" }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Connected to DB for seeding...");

        // 1. Ensure an Owner exists
        let owner = await User.findOne({ role: "restaurant-owner" });
        if (!owner) {
            console.log("No owner found, creating default owner...");
            owner = await User.create({
                name: "Master Chef",
                email: "owner@foodgenie.com",
                password: "password123",
                passwordConfirm: "password123",
                phoneNumber: "9988776655",
                role: "restaurant-owner"
            });
        }

        // 2. Ensure a Restaurant exists
        let restaurant = await Restaurant.findOne({ owner: owner._id });
        if (!restaurant) {
            console.log("Creating Global Gourmet restaurant...");
            restaurant = await Restaurant.create({
                name: "Global Gourmet",
                address: "123 Food Street, Flavor Town",
                location: "New York",
                phoneNumber: "1122334455",
                description: "The finest cuisine from around the world.",
                owner: owner._id
            });
        }

        // 3. Create a default Category
        let category = await Category.findOne({ name: "Featured" });
        if (!category) {
            category = await Category.create({
                name: "Featured",
                restaurant: restaurant._id
            });
        }

        // 4. Add Food Items
        console.log("Cleaning old items and adding new ones...");
        await FoodItem.deleteMany({ restaurant: restaurant._id });

        const itemsToInsert = foodData.map(item => ({
            name: item.name,
            price: item.price,
            description: item.description,
            images: [{ public_id: "seed_" + Date.now(), url: item.url }],
            category: category._id,
            restaurant: restaurant._id,
            stock: 50
        }));

        await FoodItem.insertMany(itemsToInsert);
        console.log("Successfully seeded 5 items!");
        
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seedData();
