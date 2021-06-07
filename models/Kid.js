const   mongoose    = require('mongoose');
var     Schema      = mongoose.Schema;

const KidSchema = new Schema({
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
    measures: {
        type: Array,
        required: true
    },
    vaccines: {
        type: [],
    },
    pediatrics: {
        type: [],
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

KidSchema.index({'$**': 'text'});

module.exports = mongoose.model('Kid', KidSchema)