const { User, Seller } = require("../models/User");
const Product = require("../models/Product");
const { asyncWrapper } = require("../utility/wrapAsync.js");
const cloudinary = require("cloudinary").v2

// Show Seller's Products
module.exports.sellerProducts = asyncWrapper(async (req, res) => {
    let user = await User.findOne({ username: req.session.user.username }).populate("products")
    res.render("seller/product/products.ejs", { user })
})

// Render New Product Form
module.exports.renderNewProductForm = asyncWrapper(async (req, res) => {
    res.render("seller/product/new.ejs")
})

// Create New Product 
module.exports.createNewProduct = asyncWrapper(async (req, res) => {
    let { product } = req.body;
    let id = req.session.user._id;

    // Step 1: Validate that images are uploaded
    if (!req.files || req.files.length === 0) {
        req.flash("error", "Please upload at least one product image.");
        return res.redirect(`/api/seller/products/add`);
    }

    // Step 2: Validate that each file has filename and path (extra safety)
    const invalidFiles = req.files.filter(file => !file.filename || !file.path);
    if (invalidFiles.length > 0) {
        req.flash("error", "Invalid image files uploaded. Try again.");
        return res.redirect(`/api/seller/products/add`);
    }

    // Step 3: Create new product
    let newProduct = new Product({
        ...product,
        image: req.files.map((file) => ({
            filename: file.filename,
            url: file.path
        })),
        owner: id
    });
    // Step 4: Save to DB
    let productRes = await newProduct.save();
    if (!productRes) {
        req.flash("error", "Product could not be saved in Database");
        return res.redirect(`/api/seller/products/add`);
    }
    let objectId = productRes._id
    let seller = await Seller.findById(id);
    seller.products.push(objectId);
    await seller.save();

    req.flash("success", "Product Created Successfully");
    return res.redirect(`/api/seller/products`);
}
);

// Render Edit Product Form
module.exports.renderEditProductForm = asyncWrapper(async (req, res) => {
    let { id } = req.params;
    let product = await Product.findById(id)
    if (!product) {
        req.flash("error", "The Product You're Trying to edit doesn't exist.");
        return res.redirect("/api/products")
    }
    res.render("seller/product/edit.ejs", { product });
})

// Update New Product Form
module.exports.updateProduct = asyncWrapper(async (req, res) => {
    let { id } = req.params;
    let { product } = req.body;
    let username = req.session.user.username;

    let oldProduct = await Product.findById(id);

    if (!oldProduct) {
        req.flash("error", "Product not found");
        return res.redirect("/api/products");
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
    return res.redirect(`/api/seller/products`);
})