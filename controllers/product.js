const cloudinary = require('cloudinary').v2;
const Product = require("../models/Product");
const ExpressError = require("../utility/ExpressError")
const { asyncWrapper } = require("../utility/wrapAsync.js")

module.exports.allProducts = asyncWrapper(async (req, res) => {
    let products = await Product.find();
    res.render("products/index.ejs", { products })
}
)
module.exports.renderNewProductForm = async (req, res) => {
    res.render("products/new.ejs")
}

module.exports.createProduct = asyncWrapper(
    async (req, res) => {
        let { product } = req.body;

        // Step 1: Validate that images are uploaded
        if (!req.files || req.files.length === 0) {
            req.flash("error", "Please upload at least one product image.");
            return res.redirect("/product/new");
        }

        // Step 2: Validate that each file has filename and path (extra safety)
        const invalidFiles = req.files.filter(file => !file.filename || !file.path);
        if (invalidFiles.length > 0) {
            req.flash("error", "Invalid image files uploaded. Try again.");
            return res.redirect("/product/new");
        }

        // Step 3: Create new product
        let newProduct = new Product({
            ...product,
            image: req.files.map((file) => ({
                filename: file.filename,
                url: file.path
            }))
        });

        // Step 4: Save to DB
        let productRes = await newProduct.save();
        if (!productRes) {
            req.flash("error", "Product could not be saved in Database");
            return res.redirect("/product/new");
        }

        req.flash("success", "Product Created Successfully");
        return res.redirect("/product");
    }
)

module.exports.showProduct = async (req, res, next) => {
    let { id } = req.params;
    let product = await Product.findById(id);

    if (!product) {
        next(new ExpressError("Product Not Found", 404))
        return;
    }
    res.render("products/show.ejs", { product });
}

module.exports.renderProductEditPage = async (req, res) => {
    let { id } = req.params;
    let product = await Product.findById(id)
    res.render("products/edit.ejs", { product });
}

module.exports.editProduct = asyncWrapper(async (req, res) => {
    let { id } = req.params;
    let { product } = req.body;

    let oldProduct = await Product.findById(id);

    if (!oldProduct) {
        req.flash("error", "Product not found");
        return res.redirect("/product");
    }

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
    req.flash("success", "Product Updated Successfully")
    res.redirect(`/product/${id}`);
})

module.exports.destroyProduct = asyncWrapper(
    async (req, res) => {
        let { id } = req.params;
        let productToBeDeleted = await Product.findByIdAndDelete(id);
        if (!productToBeDeleted) {
            req.flash("error", "Product not found");
            return res.redirect("/product");
        }

        for (let image of productToBeDeleted.image) {
            await cloudinary.uploader.destroy(image.filename);
        }
        console.log(productToBeDeleted);
        req.flash("success", "Product Deleted successfully")
        res.redirect("/product")
    }
)