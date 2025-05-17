const mongoose = require("mongoose");
const {Schema , model} = mongoose;

const cartSchema = new Schema({
    items: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: "Buyer"
    }
});

const Cart = model("Cart" , cartSchema);

module.exports = Cart;