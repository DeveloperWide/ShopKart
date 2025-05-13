const Product = require("../models/Product");
const { User } = require("../models/User");
const products = require("./data")
const mongoose = require("mongoose");

// Connect to db
main().then(() => {
  console.log(`Connected To DB`)
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/shopkart');
}

async function addData() {
  try {
    let id = '68222d52ce142d6f91d53d19'; // User ID
    let user = await User.findById(id); // Find the user by ID
    if (!user) {
      console.log("User not found!");
      return;
    }

    let products = await Product.find({}); // Get all products

    // Get all product IDs
    let alProIds = products.map((obj) => obj._id.toString());

    // Ensure we don't have duplicate product IDs in user.products
    let uniqueProductIds = [...new Set([...user.products, ...alProIds])];

    // Update user's products
    user.products = uniqueProductIds;

    let svdUser = await user.save(); // Save updated user document
    console.log("User updated:", svdUser);
  } catch (err) {
    console.error("Error updating user data:", err);
  }
}

addData();