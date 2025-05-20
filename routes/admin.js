const express = require("express");
const Product = require("../models/Product");
const { User } = require("../models/User");
const router = express.Router();

router.get("/dashboard" , async (req, res) => {
    let products = await Product.find({});
    let users = await User.find({})
    let arrOfStocks = products.map(obj => {
        return obj.stock
    });

    let sumOfStock = 0;
    for(let stock in arrOfStocks){
        sumOfStock += arrOfStocks[stock];
    };

    res.render("admin/dashboard.ejs" , {stocks: sumOfStock});
})

module.exports = router;