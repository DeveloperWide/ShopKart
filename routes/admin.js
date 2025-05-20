const express = require("express");
const Product = require("../models/Product");
const { User } = require("../models/User");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

router.get("/dashboard", async (req, res) => {
    let products = await Product.find({});
    let users = await User.find({})
    let arrOfStocks = products.map(obj => {
        return obj.stock
    });

    let sumOfStock = 0;
    for (let stock in arrOfStocks) {
        sumOfStock += arrOfStocks[stock];
    };

    res.render("admin/dashboard.ejs", { stocks: sumOfStock });
});

router.get("/sales-report", (req, res) => {
    res.render("admin/salesReport.ejs")
});

// User Management
router.get("/users", async (req, res) => {
    let users = await User.find();
    res.render("admin/users/index.ejs", { users });
});

// Render Edit form
router.get("/users/:id/edit", async (req, res, next) => {
    let user = await User.findById(req.params.id);
    res.render("admin/users/edit.ejs", { user })
});

// Update the User
router.put("/users/:id", upload.single('user[image]'), async (req, res) => {
    let { id } = req.params;
    if (req.file && req.file.filename && req.file.path) {
        let user = await User.findById(id);
        await cloudinary.uploader.destroy(user.image.filename);
        let updatedUser = await User.findByIdAndUpdate(id, {
            ...req.body.user, image: {
                filename: req.file.filename,
                url: req.file.path,
            }
        });
        req.flash("success", "User Updated Successfully");
        console.log(updatedUser);
        return res.redirect(`/api/admin/users`);
    }
    req.flash("error", "User Updation Failed");
    return res.redirect(`/api/admin/users`)
});

/* 
TASK:

Whenever we are deleting the User also delete all the user's Products and Reviews related
*/

// Delete The User
router.delete("/users/:id", async (req, res) => {
    let user = await User.findByIdAndDelete(req.params.id);
    await cloudinary.uploader.destroy(user.image.filename);
    return res.redirect("/api/admin/users/");
});

// Product Management
router.get("/products", async (req, res) => {
    let products = await Product.find();
    res.render("admin/products/index.ejs", { products })
});

// Product Edit Page 
router.get("/products/:id/edit", async (req, res) => {
    let product = await Product.findById(req.params.id);
    res.render("admin/products/edit.ejs", { product })
})

// Update The Product 
router.put("/products/:id", upload.array('product[images]', 5), async (req, res) => {
    let { id } = req.params;
    if (req.files.length > 0) {
        let product = await Product.findById(id);
        for (let image of product.image) {
            await cloudinary.uploader.destroy(image.filename);
        }

        let images = req.files.map(obj => {
            return {
                filename: obj.filename,
                url: obj.path
            }
        });
        let updatedProduct = await Product.findByIdAndUpdate(id, {
            ...req.body.product, image: images
        });
        console.log(updatedProduct)
        req.flash("success" , "User Updated Successfully");
        return res.redirect(`/api/admin/products`);
    }
    req.flash("error", "User Updation Failed");
    return res.redirect(`/api/admin/users`)
});

// Task:
// Whenever i am deleting the Product also delete All the Reviews related to Product

// Delete The Product
router.delete("/products/:id", async (req, res) => {
    let product = await Product.findByIdAndDelete(req.params.id);
    for(let image of product.image){
        await cloudinary.uploader.destroy(image.filename);
    }
    return res.redirect("/api/admin/users/");
})

module.exports = router;