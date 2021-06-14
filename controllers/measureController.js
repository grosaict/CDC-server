const Kid       = require('../models/Kid');
const Measure   = require('../models/Measure');

exports.loadAllMeasures = async (req) => {
    let response = {
        measures :  null,
        err:        null
    }
    try {
        response.measures = await Measure.find({kid: req._id}).sort({dueMonth: 'asc'}).exec();
        if (Object.keys(response.measures).length === 0){
            await blankMeasures(req)
            response.measures = await Measure.find({kid: req._id}).sort({dueMonth: 'asc'}).exec();
        }
        return response
    } catch (err){
        response.err        = err
        return response;
    }
}

exports.loadMeasure = async (idMeasure) => {
    let response = {
        measure:    null,
        err:        null
    }
    try {
        response.measure = await Measure.findOne({_id: idMeasure}).exec();
        return response
    } catch (err){
        response.err = err
        return response;
    }
}

exports.createBlankMeasures = async (req) => { return blankMeasures(req) }

const blankMeasures = async (req) => {
    const {_id, birth}  = req;
    const birthDay      = new Date(birth).getDate()

    try {
        let sDate       = birth
        let blankItem

        for (let index = 0; index <= 24; index++) {
            index > 0 ? sDate = addOneMonth(sDate) : false
            blankItem = new Measure({
                dueMonth:       index,
                scheduleDate:   sDate,
                weight:         0 ,
                isSetW:         false,
                length:         0,
                isSetL:         false,
                head:           0,
                isSetH:         false,
                kid:            _id
            });
            await blankItem.save();
        }
     } catch (err){
        return err;
    }

    function addOneMonth (d) {
        let day = birthDay
        let month = d.getMonth() + 1
        let year = d.getFullYear()

        if (month > 11) {
            month = 0
            year++
        } else {
            if (day > 28) {
                switch (month) {
                    case 1:
                        day = 28;
                        break;
                    case 3:
                    case 5:
                    case 8:
                    case 10:
                        if (day > 30) { day = 30 }
                        break;
                }
            }
        }
        return new Date(year, month, day);
    }
}

exports.updateMeasure = async (req, res) => {
    const filter = { _id: req.params.id }; // measureId
    const userId    = req.user._id;

    const body      = {
        weight: req.body.weight,
        isSetW: ( req.body.weight > 0 ? true : false ),
        length: req.body.length,
        isSetL: ( req.body.length > 0 ? true : false ),
        head:   req.body.head,
        isSetH: ( req.body.head > 0 ? true : false ),
    }

    const isDataOk = () => {  // ### TO SET LIMITS BASED ON WHO DATA TABLES

        if (body.weight === ''   ||
            body.weight === undefined   || body.weight < 0      || body.weight > 25000) {
            return false
        }

        if (!body.length                || body.length === ''   ||
            body.length === undefined   || body.length < 0      || body.length > 150) {
            return false
        }

        if (!body.head                  || body.head === ''     ||
            body.head === undefined     || body.head < 0        || body.head > 70) {
            return false
        }
        return true
    }

    try {
        if (!isDataOk()) {
            return res.status(400).send({"message": "Alguma medida informada está acima ou abaixo do aceitável"});
        }
        const m = await Measure.findOne(filter).exec();
        const k = await Kid.findOne({_id: m.kid}).exec();
        if(userId != k.user._id){
            return res.status(403).send({ message: 'Acesso negado', });
        }
        await Measure.findOneAndUpdate(filter, body).exec();
        res.status(200).json({"message": "Medidas atualizadas com sucesso"});
    } catch (err){
        res.status(400).send({"message": "Erro ao atualizar medidas"});
    }
}