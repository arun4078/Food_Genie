// BACKEND/utils/seeder.js

const Fooditem = require("./models-20260320/foodItem");
const dotenv = require("dotenv");
const connectDatabase = require("./db");

const fooditems = [
    {
      "name": "Pani Puri",
      "description": "A popular street food in India, consisting of a round, hollow puri filled with a mixture of flavored water, tamarind chutney, chili, chaat masala, potato, onion, and chickpeas.",
      "price": 50,
      "images": [{"public_id": "seed1", "url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"}],
      "stock": 100
    },
    {
      "name": "Dahi Papdi Chaat",
      "description": "The appetising flavor of the papdi, wrapped in the pot pourri style mix of fresh yogurt, sweet & sour chutney, chaat masala and finished off with curd and sev.",
      "price": 149,
      "images": [{"public_id": "seed2", "url": "https://images.unsplash.com/photo-1626804475297-416091bfa7cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"}],
      "stock": 50
    }
];

// Setting dotenv file
dotenv.config({ path: ".env" });

connectDatabase();

const seedFooditems = async () => {
  try {
    await Fooditem.deleteMany(); //will delete all the fooditems
    console.log("FoodItems are deleted");
    await Fooditem.insertMany(fooditems);
    console.log("All FoodItems are added.");
    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedFooditems();
