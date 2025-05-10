const Product = require("../models/Product");
const products = require("./data")
const mongoose = require("mongoose");

// Connect to db
main().then(() => {
    console.log(`Connected To DB`)
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/shopkart');
}

async function addData(){
    let allProducts = await Product.insertMany(products.products);
    console.log(allProducts);
}

addData()