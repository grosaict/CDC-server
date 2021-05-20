const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden')();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        hide: true
    },
    createAt: {
        type: Date,
        default: Date.now,
        hide: true
    },
    isVerify: {
        type: Boolean,
        default: false,
        hide: true
    }
});

userSchema.plugin(mongooseHidden)

module.exports = mongoose.model('User', userSchema)