const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'seller', 'buyer'], required: true },
    image: {
        filename: String,
        url: String,
    }
}, { discriminatorKey: 'role', timestamps: true })

// Pre-save hook to hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();  // Only hash if password is new or modified
    const salt = await bcrypt.genSalt(12);  // 12 rounds is a solid standard
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Instance method to compare passwords during login
userSchema.methods.validatePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

const buyerSchema = new Schema({
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order"
        }
    ],
    cart: {
        type: Schema.Types.ObjectId,
        ref: "Cart"
    },
    wishlist: {
        type: Schema.Types.ObjectId,
        ref: "Wishlist"
    }

});

const Buyer = User.discriminator('buyer', buyerSchema);

const sellerSchema = new Schema({
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
});

const Seller = User.discriminator('seller', sellerSchema);


module.exports = {
    User,
    Buyer,
    Seller
};