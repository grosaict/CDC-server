const   mongoose    = require('mongoose');
var     Schema      = mongoose.Schema;

const VaccineSchema = new Schema({
    dueMonth: {
        type: Number,
        required: true
    },
    scheduleDate: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    nameLower: {        // TO FACILITATE THE USE IN CASE INSENSITIVE QUERIES
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    applicationDate: {
        type: Date,
        required: false
    },
    isSUS: {
        type: Boolean,
        required: true
    },
    isSet: {
        type: Boolean,
        required: true
    },
    lastUpdate: {
        type: Date,
        default: Date.now,
        required: true
    },
    kid: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Kid'
    }
});

VaccineSchema.index({'$**': 'text'});

module.exports = mongoose.model('Vaccine', VaccineSchema)