const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    isBlocked:{
        type: Boolean,
        default: false,
    },
    cart: {
        type: Array,
        default: [],
    },
    address: [{type: mongoose.Schema.ObjectId, ref: "Address"}],
    wishlist: [{type: mongoose.Schema.ObjectId, ref: "Product"}]

}, {
    timestamps:  {
        timestamps: {
            createdAt: 'created_at',  // Custom name for createdAt field
            updatedAt: 'updated_at'   // Custom name for updatedAt field
        }
    }
});

// Pre-save hook to hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.isPasswordMatched = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
// Export the model
module.exports = mongoose.model('User', userSchema);
