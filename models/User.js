const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden')();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        hide: true
    },
    password: {
        type: String,
        required: true,
        hide: true
    },
/*     phone: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true
    },
 */
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