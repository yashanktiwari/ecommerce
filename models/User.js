const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    role: String,
    cart: [
        {
            productImg: String,
            productName: String,
            price: Number,
            quantity: {
                type: Number,
                default: 0
            }
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User',UserSchema);

module.exports = User;