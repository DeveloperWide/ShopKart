const express = require("express");
const router = express.Router();
const multer = require("multer")
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const controllers = require("../controllers/product");
const { productSchema } = require("../schema");

let validateProduct = (req, res, next) => {
    let { error } = productSchema.validate(req.body)
    if (error) {
        req.flash("error", error.details[0].message);
        res.redirect("/product/new")
    }
    next();
}


// Show Products
router.get("/product", controllers.allProducts);

// Render Product Form
router.get("/product/new", controllers.renderNewProductForm)

//Create Product
router.post("/product", upload.array("product[images]", 5), validateProduct, controllers.createProduct);

// Product Show Page
router.get("/product/:id", controllers.showProduct)

// Render Edit Page
router.get("/product/:id/edit", controllers.renderProductEditPage)


// Product Update Route
router.put("/product/:id", upload.array("product[images]", 5), controllers.editProduct);

// Delete Product and Cloudinary Images
router.delete("/product/:id", controllers.destroyProduct)

module.exports = router;