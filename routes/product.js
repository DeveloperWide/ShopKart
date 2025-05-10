const express = require("express");
const router = express.Router();
const multer = require("multer")
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const controllers = require("../controllers/product");
const Product = require("../models/Product");
const User = require("../models/User");

// Show Products
router.get("/product", async (req, res) => {
    let products = await Product.find();
    res.render("products/index.ejs", { products })
});

// Render Product Form
router.get("/product/new", async (req, res) => {
    res.render("products/new.ejs")
})

//Create Product
router.post("/product", upload.array("product[images]", 5), async (req, res) => {
    let { product } = req.body;

    let newProduct = new Product({
        ...product
    })

   newProduct.image =  req.files.map((obj) => {
        return {
            filename: obj.filename,
            url: obj.path
        }
    });

    let productRes = await newProduct.save();
    console.log(productRes)
    res.redirect("/product")
});

// Product Show Page
router.get("/product/:id", async (req, res) => {
    let {id} = req.params;
    let product = await Product.findById(id);
    res.render("products/show.ejs", {product});
}) 

// Render Edit Page
/* router.get("/product/:id/edit", (req, res) => {
    res.render("product/edit.ejs");
})


//Edit Page
router.put("/product/:id", (req, res) => {

})
 */

module.exports = router;