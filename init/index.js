const Product = require("../models/Product");
const { User } = require("../models/User");
const products = require("./data");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "../.env" });

const dbUrl = process.env.MONGODB_ATLAS_URI;

// Connect to DB
main().then(() => {
  console.log("Connected To DB");
  addData(); // call after DB connection
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

async function addData() {
  try {
    const id = '682f38ea8b1f852e996f83bb'; // User ID
    const user = await User.findById(id);

    if (!user) {
      console.log("User not found!");
      return;
    }

    const allProducts = await Product.find({});
    const updatedProducts = [];

    for (let product of allProducts) {
      product.owner = user._id;
      const saved = await product.save();
      updatedProducts.push(saved);
    }

    console.log("Products updated:", updatedProducts.length);
  } catch (err) {
    console.error("Error updating products:", err);
  }
}
