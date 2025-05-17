const express = require("express");
const Product = require("../models/Product");
const { User } = require("../models/User");
const router = express.Router();
const Wishlist = require("../models/Wishlist")

router.get("/", async (req, res) => {
    let currUser = await User.findById(req.session.user._id).populate({
        path: "wishlist", populate: {
            path: "items"
        }
    });
    res.render("user/Wishlist/userWishlist.ejs" , {buyer: currUser});
})

router.post("/:id", async (req, res) => {
    let { id } = req.params;
    let product = await Product.findById(id);
    let currUser = await User.findById(req.session.user._id);


    let wishlist;
    if (!currUser.wishlist) {
        wishlist = new Wishlist({
            items: [product._id],
            user: currUser._id
        });

        let newWishlist = await wishlist.save();
        currUser.wishlist = newWishlist._id;
    } else {
        let wishlist = await Wishlist.findById(currUser.wishlist);

        if (!wishlist.items.includes(product._id)) {
            wishlist.items.push(product._id);
            await wishlist.save();
        }
    };

    await currUser.save();
    console.log(currUser);
    req.flash("success", "Product Added successfully");
    return res.redirect(`/api/products/${id}`)
});

// Delete One Item
router.delete("/:itemId" , async (req, res) => {
    let {itemId} = req.params;
    let currUser = await User.findById(req.session.user._id)
    let wishlistItemToBeDeleted = await Wishlist.findById(currUser.wishlist);
    console.log(wishlistItemToBeDeleted)
    let itemToBeDeletedIdx = wishlistItemToBeDeleted.items.findIndex(el => {
        return String(el._id) === String(itemId);
    });
    wishlistItemToBeDeleted.items.splice(itemToBeDeletedIdx , 1);
    await wishlistItemToBeDeleted.save();
    req.flash("success" , "Item Successfully deleted");
    return res.redirect(`/api/wishlist`);
});



module.exports = router;