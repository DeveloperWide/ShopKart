const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { User, Buyer } = require("../models/User");
const { isLoggedIn, isBuyer } = require("../middleware/middleware");
const router = express.Router();
// Cart Item 
router.get("/", isLoggedIn, isBuyer,  async (req, res) => {
    if (req.session.user.role === "buyer") {
        let buyer = await Buyer.findById(req.session.user._id).populate({path : "cart" , populate: {
            path: "items"
        }} );

        res.render("user/Cart/userCarts.ejs", { buyer })
    } else {
        req.flash("error", "You're not a Buyer");
        return res.redirect("/api/products")
    }
})

// add Items in Cart
router.post("/:id", isLoggedIn, isBuyer, async (req, res) => {
    let { id } = req.params;
    let product = await Product.findById(id);
    let buyer = await Buyer.findById(req.session.user._id).populate("cart");

    let cart;

    if (!buyer.cart) {
        let cart = new Cart({
            items: [product._id],
            user: buyer._id
        });

        await cart.save();
        buyer.cart = cart._id;
    }else{
        let cart = await Cart.findById(buyer.cart);

        if(!cart.items.includes(product._id)){
            cart.items.push(product._id);
            await cart.save();
        }
    };

    await buyer.save();
    req.flash("success" , "Product Added successfully");
    return res.redirect(`/api/products/${id}`)
});

// Clear Entire Cart
router.delete("/clear", isLoggedIn, isBuyer, async(req, res) => {
    let currUser = await User.findById(req.session.user._id);
    let cart = await Cart.findById(currUser.cart);

    console.log(cart.items.length)
    cart.items.splice(0, cart.items.length);
    await cart.save();
    req.flash("success" , "Cart Cleared Successfully");
    return res.redirect("back")
})

// Delete One Item
router.delete("/:itemId" ,isLoggedIn, isBuyer, async (req, res) => {
    let {itemId} = req.params;
    let currUser = await User.findById(req.session.user._id)
    let cartItemToBeDeleted = await Cart.findById(currUser.cart);
    console.log(cartItemToBeDeleted)
    let itemToBeDeletedIdx = cartItemToBeDeleted.items.findIndex(el => {
        return String(el._id) === String(itemId);
    });
    cartItemToBeDeleted.items.splice(itemToBeDeletedIdx , 1);
    await cartItemToBeDeleted.save();
    req.flash("success" , "Item Successfully deleted");
    return res.redirect(`/api/cart`);
});



module.exports = router;