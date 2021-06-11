const Measure       = require('../models/Measure');

exports.loadAllMeasures = async (req) => {
    //console.log("loadAllMeasures >>>"+req)
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
        //console.log("loadAllMeasures >>>"+JSON.stringify(response))
        return response
    } catch (err){
        response.err        = err
        //console.log(err)
        return response;
    }
}

exports.loadMeasure = async (idMeasure) => {
    //console.log("loadMeasure idMeasure>>>"+idMeasure)
    let response = {
        measure:    null,
        err:        null
    }
    try {
        response.measure = await Measure.findOne({_id: idMeasure}).exec();
        //console.log("loadMeasure response.measure>>>"+response.measure)
        return response
    } catch (err){
        response.err = err
        //console.log("loadMeasure err>>>"+err)
        return response;
    }
}


exports.createBlankMeasures = async (req) => { blankMeasures(req) }


const blankMeasures = async (req) => {
    //console.log("blankMeasures >>>"+req)
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
                weight:         index * 1000,  // using index to poulate >>> default = 0,
                isSetW:         true,   // using true to populate >>> default = false,
                length:         0.1,
                isSetL:         false,
                head:           0.1,
                isSetH:         false,
                kid:            _id
            });
            await blankItem.save();
        }
     } catch (err){
        console.log(err)
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

    const measureId = req.params.id;
    const userId    = req.body.kid.user._id;

    const body      = {
        weight: req.body.weight,
        isSetW: ( req.body.weight > 0 ? true : false ),
        length: req.body.length,
        isSetL: ( req.body.length > 0 ? true : false ),
        head:   req.body.head,
        isSetH: ( req.body.head > 0 ? true : false ),
    }

    const isFieldsOk = () => {  // ### TO SET LIMITS BASED IN WHO DATA

        if (!body.weight                || body.weight === ''   ||
            body.weight === undefined   || body.weight < 0      || body.weight > 3000) {
            return false
        }

        if (!body.length                || body.length === ''   ||
            body.length === undefined   || body.length < 0      || body.length > 100) {
            
            return false
        }

        if (!body.head                  || body.head === ''     ||
            body.head === undefined     || body.head < 0        || body.head > 100) {
            return false
        }

        return true
    }

    try {
        if (isFieldsOk()) {
            console.log(isFieldsOk)
            if(userId == req.user._id){
                await Measure.findOneAndUpdate(measureId, body);
                res.status(200).json({"message": "Medias atualizadas com sucesso"});
            } else {
                res.status(403).send({ message: 'Acesso negado', });
            }
        } else {
            res.status(400).send({"message": "Alguma medida está acima ou abaixo do aceitável"});
        }
    } catch (err){
        res.status(400).send({"message": "Erro ao atualizar medidas"});
    }

/*     
    const itemID = req.params.id;

    const filter = { _id: itemID };
    try {

        await Item.findOneAndUpdate(filter, body);
        res.status(200).json({"message": "Item Atualizado com sucesso"});
    } catch (err){
        res.status(400).send({"message": "Erro ao atualizar item"});
    } */

    /* 
    try {
        const m   = await MeasureController.loadMeasure(measureId)
        const kid       = await Kid.findOne({_id: m.measure.kid}).exec();
        kid.user        = await User.findById(kid.user);
        if(kid.user._id == req.user._id){
            const measures = await MeasureController.loadAllMeasures(kid)
            if (!measures.err) {
                kid.measures = measures.measures
                res.status(200).json({
                    data: {
                        measure:    m.measure,
                        kid:        kid
                    }
                });
            } else {
                res.status(400).send({ message: 'Problema ao obter medidas',});
            }
        } else {
            res.status(403).send({ message: 'Acesso negado', });
        }

    } catch (err){
        res.status(400).send({"message": "Erro ao buscar criança"});
    } */
}