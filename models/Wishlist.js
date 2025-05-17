const mongoose = require("mongoose");
const {Schema , model} = mongoose;

const wishlistSchema = new Schema({
    items :[
     {
        type: Schema.Types.ObjectId,
        ref: "Product"
     },
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: "Buyer"
    }
});

const Wishlist = model("Wishlist", wishlistSchema);
module.exports = Wishlist;