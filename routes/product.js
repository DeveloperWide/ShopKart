const express = require("express");
const router = express.Router();
const multer = require("multer")
const cloudinary = require('cloudinary').v2;
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const controllers = require("../controllers/product");
const Product = require("../models/Product");
const User = require("../models/User");

// Show Products
router.get("/product", async (req, res) => {
    let products = await Product.find();
    console.log(req.session)
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
router.get("/product/:id/edit", async (req, res) => {
    let {id} = req.params;
    let product =await Product.findById(id)
    res.render("products/edit.ejs" , {product});
})


// Edit Product Route
router.put("/product/:id", upload.array("product[images]", 5), async (req, res) => {
    let { id } = req.params;
    let { product } = req.body;

    let oldProduct = await Product.findById(id);

    // Step 1: Delete old images from Cloudinary
    if (req.files.length > 0) {
        for (let image of oldProduct.image) {
            await cloudinary.uploader.destroy(image.filename);
        }
    }

    let productToBeUpdated = await Product.findByIdAndUpdate(id, { ...product }, { new: true });
    if (req.files.length > 0) {
        productToBeUpdated.image = req.files.map((file) => {
            return {
                filename: file.filename, 
                url: file.path,
            };
        });

        await productToBeUpdated.save();
    }

    res.redirect(`/product/${id}`);
});

// Delete Product and Cloudinary Images
router.delete("/product/:id", async (req, res) => {
    let {id} = req.params;
    let prodcutToBeDeleted = await Product.findByIdAndDelete(id);
     for(let image of prodcutToBeDeleted.image){
        await cloudinary.uploader.destroy(image.filename);
     }
    console.log(prodcutToBeDeleted);
    res.redirect("/product")
})

module.exports = router;