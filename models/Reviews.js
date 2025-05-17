const mongoose = require("mongoose");
const {Schema , model} = mongoose;

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required:true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
});

const Review = model("Review", reviewSchema);
module.exports = Review;