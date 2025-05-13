const { User, Seller } = require("../models/User");
const Product = require("../models/Product");
const { asyncWrapper } = require("../utility/wrapAsync.js")

module.exports.adminDashboard = asyncWrapper(async (req, res) => {
    let { username } = req.params;
    let user = await User.findOne({ username: username }).populate("products")
    console.log(`User`, user)
    res.render("admin/dashboard.ejs", { user })
})

module.exports.manageProducts = asyncWrapper(async (req, res) => {
    let { username } = req.params;
    let user = await User.findOne({ username: username }).populate("products")
    res.render("admin/product/products.ejs", { user })
})

module.exports.renderNewProductForm = asyncWrapper(async (req, res) => {
    res.render("admin/product/new.ejs")
})

module.exports.createNewProduct = asyncWrapper(async (req, res) => {
    let { product } = req.body;
    let { username } = req.params
    let id = req.session.user._id;

    // Step 1: Validate that images are uploaded
    if (!req.files || req.files.length === 0) {
        req.flash("error", "Please upload at least one product image.");
        return res.redirect(`/admin/${username}/products/add`);
    }

    // Step 2: Validate that each file has filename and path (extra safety)
    const invalidFiles = req.files.filter(file => !file.filename || !file.path);
    if (invalidFiles.length > 0) {
        req.flash("error", "Invalid image files uploaded. Try again.");
        return res.redirect(`/admin/${username}/products/add`);
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
        return res.redirect("/product/new");
    }
    let objectId = productRes._id
    let seller = await Seller.findByIdAndUpdate(id, {
        products: [objectId]
    })

    req.flash("success", "Product Created Successfully");
    return res.redirect(`/admin/${username}/products`);
}
)
module.exports.renderEditProductForm = asyncWrapper(async (req, res) => {
    let { id } = req.params;
    let product = await Product.findById(id)
    if (!product) {
        req.flash("error", "The Product You're Trying to edit doesn't exist.");
        return res.redirect("/product")
    }
    res.render("admin/product/edit.ejs", { product });
})

module.exports.updateProduct = asyncWrapper(async (req, res) => {
    let { id, username } = req.params;
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
    return res.redirect(`/admin/${username}/products`);
})