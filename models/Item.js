const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ItemSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    }, 
    tipo: {
        type: Number,
        required: true
    },
    categoria: {
        type: Number,
        required: true
    },
    descricao: {
        type: String,
        required: true
    }, 
    dataAchadoPerdido: {
        required: true,
        type: Date,
    },
    imagens: {
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
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    owner: {
        type: Boolean
    }
});

ItemSchema.index({'$**': 'text'});

module.exports = mongoose.model('Item', ItemSchema)