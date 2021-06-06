const MeasuresSchema = new Object({
    lastUpdate:     { type: Date },
    table:          { type: Array }
})

const MeasureItem = {
    scheduleDate:   { type: Date },
    weight:         { type: Number },
    isSetW:         { type: Boolean },
    length:         { type: Number },
    isSetL:         { type: Boolean },
    head:           { type: Number },
    isSetH:         { type: Boolean }
}

module.exports = { MeasuresSchema, MeasureItem }