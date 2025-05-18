const cloudinary = require('cloudinary').v2;
const Product = require("../models/Product");
const { asyncWrapper } = require("../utility/wrapAsync.js")

module.exports.allProducts = asyncWrapper(async (req, res) => {
    let products = await Product.find().populate("owner");
    res.render("products/index.ejs", { products })
}
)

module.exports.showProduct = async (req, res, next) => {
    let { id } = req.params;
    let product = await Product.findById(id).populate("owner").populate({path: "reviews" , populate: {
        path: "user"
    }});

    if (!product) {
        req.flash("error", "Product Not Found");
        return res.redirect("/product");
    }
    res.render("products/show.ejs", { product });
}


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
        req.flash("success", "Product Deleted successfully")
        res.redirect("/product")
    }
)