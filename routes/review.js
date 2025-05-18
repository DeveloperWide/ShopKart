const express = require("express");
const Review = require("../models/Reviews");
const Product = require("../models/Product");
const router = express.Router({ mergeParams: true });

router.post("/", async (req, res) => {
    let { id } = req.params;
    let product = await Product.findById(id);
    let review = new Review({
        ...req.body.review,
        user: req.session.user._id
    });
    let svdReview = await review.save();
    product.reviews.push(svdReview._id);
    await product.save();
    console.log(product);
    console.log(svdReview)
    req.flash("success", "Review Successfully Added");
    return res.redirect(`/api/products/${id}`);
});

router.delete("/:reviewId" , async (req, res) => {
    let {id , reviewId} = req.params;
    let product = await Product.findById(id);
    let review = await Review.findByIdAndDelete(reviewId);

    let reviewToBeDeletedIdx = product.reviews.findIndex(el => {
        return String(el) === String(reviewId);
    });

    product.reviews.splice(reviewToBeDeletedIdx, 1);
    await product.save();
    req.flash("success" , "Review  Successfully Deleted");
    return res.redirect(`/api/products/${id}`);
})

module.exports = router;