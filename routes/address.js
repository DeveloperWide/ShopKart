const express = require("express");
const { User, Buyer } = require("../models/User");
const router = express.Router();


router.get("/", async(req, res) => {
    let currUserId = req.session.user._id;
    let user = await Buyer.findById(currUserId);
    res.render("user/Addresses/address.ejs" , {user});
});


router.post("/", async(req, res) => {
    let currUserId = req.session.user._id;
    let user = await Buyer.findById(currUserId);
    user.addresses.push(req.body.address);
    await user.save();
    req.flash("success", "Address Successfully Added");
    console.log(user)
    return res.redirect("/api/addresses");
})

router.delete("/:id", async(req, res) => {
    let {id} = req.params;
    let currUserId = req.session.user._id;
    let user = await Buyer.findById(currUserId);
    let addressToBeDeletedIdx = user.addresses.findIndex(el => {
        return String(el._id) === String(id)
    });
    user.addresses.splice(addressToBeDeletedIdx, 1);
    req.flash("success" , "Address Deleted Successfully");
    await user.save();
    return res.redirect(`/api/addresses`)
})


module.exports = router;