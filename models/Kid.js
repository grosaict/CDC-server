const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const KidSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    birth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    measure: {
        type: [],
    },
    vacine: {
        type: [],
    },
    pediatric: {
        type: [],
    },
    isAtivo: {
        type: Boolean,
        default: true,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

KidSchema.index({'$**': 'text'});

module.exports = mongoose.model('Kid', KidSchema)