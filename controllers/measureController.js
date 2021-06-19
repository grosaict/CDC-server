const Kid       = require('../models/Kid');
const Measure   = require('../models/Measure');

exports.loadAllMeasures = async (req) => {
    let response = {
        measures :  null
    }
    try {
        response.measures = await Measure.find({kid: req._id}).sort({dueMonth: 'asc'}).exec();
        if (Object.keys(response.measures).length === 0){
            await blankMeasures(req)
            response.measures = await Measure.find({kid: req._id}).sort({dueMonth: 'asc'}).exec();
        }
        response.status     = 200
        response.message    = "Sucesso"
        return response
    } catch (err){
        console.log("loadAllMeasures > err >>>")
        console.log(err)
        response.status     = 400
        response.message    = "Erro"
        response.error      = err
        return response;
    }
}

exports.loadMeasure = async (idMeasure) => {
    let response = {
        measure:    null
    }
    try {
        response.measure    = await Measure.findOne({_id: idMeasure}).exec();
        response.status     = 200
        response.message    = "Sucesso"
        return response
    } catch (err){
        console.log("loadMeasure > err >>>")
        console.log(err)
        response.status     = 400
        response.message    = "Erro"
        response.error      = err
        return response;
    }
}

exports.createBlankMeasures = async (req) => { return blankMeasures(req) }

const blankMeasures = async (req) => {
    const {_id, name, birth}  = req;
    const birthDay      = new Date(birth).getDate()

    try {
        let sDate       = birth
        let newMeasure
        let response = {}

        for (let index = 0; index <= 24; index++) {
            index > 0 ? sDate = addOneMonth(sDate) : false
            newMeasure = new Measure({
                dueMonth:       index,
                scheduleDate:   sDate,
                weight:         (name === "AYLA" && index < 11 ) ? Ayla[index][0] : 0,
                isSetW:         (name === "AYLA" && index < 11 ) ? true : false,
                length:         (name === "AYLA" && index < 11 ) ? Ayla[index][1] : 0,
                isSetL:         (name === "AYLA" && index < 11 ) ? true : false,
                head:           (name === "AYLA" && index < 11 ) ? Ayla[index][2] : 0,
                isSetH:         (name === "AYLA" && index < 11 ) ? true : false,
                kid:            _id
            });
            await newMeasure.save();
        }

        response.status     = 200
        response.message    = "Sucesso"
        return response
     } catch (err){
        console.log("blankMeasures > err >>>")
        console.log(err)
        response.status     = 400
        response.message    = "Erro"
        response.error      = err
        return response;
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
        weight:     req.body.weight,
        isSetW:     ( req.body.weight > 0 ? true : false ),
        length:     req.body.length,
        isSetL:     ( req.body.length > 0 ? true : false ),
        head:       req.body.head,
        isSetH:     ( req.body.head > 0 ? true : false ),
        lastUpdate: new Date(),
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
            return res.status(400).send({status: 400, message: "Alguma medida informada está acima ou abaixo do aceitável"});
        }
        const m = await Measure.findOne(filter).exec();
        const k = await Kid.findOne({_id: m.kid}).exec();
        if(userId != k.user._id){
            return res.status(403).send({ status: 403, message: 'Acesso negado' });
        }
        await Measure.findOneAndUpdate(filter, body).exec();
        res.status(200).json({ status: 200, message: "Medidas atualizadas com sucesso" });
    } catch (err){
        console.log("updateMeasure > err >>>")
        console.log(err)
        res.status(400).send({ status: 400, message: "Erro ao atualizar medidas", error: err });
    }
}

const Ayla = [
    [ 3470, 49, 31,5 ],
    [ 3845, 53.5, 35 ],
    [ 4495, 55.5, 37 ],
    [ 4978, 58.5, 38 ],
    [ 5460, 61.5, 39 ],
    [ 5960, 63, 40 ],
    [ 6335, 64.5, 41 ],
    [ 6665, 67, 41,5 ],
    [ 6860, 69.5, 42 ],
    [ 7520, 70, 42,5 ],
    [ 8250, 71, 43 ],
]