const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    stock: {
        type: Number,
    },
    image: [
        {
            filename: { type: String, required: true }, // Needed for deletion & control
            url: { type: String, required: true },     // Used to display image
            _id: false,
        }
    ],
    category: {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const Product = model("Product", productSchema);

module.exports = Product;