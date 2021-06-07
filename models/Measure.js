const   mongoose    = require('mongoose');
var     Schema      = mongoose.Schema;

const MeasureSchema = new Schema({
    dueMonth: {
        type: Number,
        required: true
    },
    scheduleDate: {
        type: Date,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    head: {
        type: Number,
        required: true
    },
    isSetW: {
        type: Boolean,
        required: true
    },
    isSetL: {
        type: Boolean,
        required: true
    },
    isSetH: {
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

MeasureSchema.index({'$**': 'text'});

module.exports = mongoose.model('Measure', MeasureSchema)