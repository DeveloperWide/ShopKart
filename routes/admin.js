const express = require("express");
const {User} = require("../models/User");
const router = express.Router();

// /admin                → Admin dashboard
router.get("/admin" , async (req, res) => {
    let user = await User.findById('68222d52ce142d6f91d53d19');
    res.render("admin/dashboard.ejs" , {user})
})

// /admin/products       → Manage products
// /admin/products/add   → Add new product
// /admin/products/:id/edit → Edit product
// /admin/categories     → Manage categories
// /admin/orders         → View and manage all orders
// /admin/users          → Manage customers
// /admin/coupons        → Manage discount coupons
// /admin/banners        → Manage homepage banners/sliders
// /admin/settings       → Store settings



module.exports = router;