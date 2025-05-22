const express = require("express");
const route = express.Router();
const Razorpay = require("razorpay");
const dotenv = require("dotenv");

dotenv.config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});


route.post("/order/" , async (req, res) => {
    try{
        let {amount} = req.body;

    let options = {
        amount : amount * 10,
        currency : "INR",
        receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    console.log(order)
    res.json(order);
    }catch(err){
        console.log(err)
    }
})

module.exports = route;