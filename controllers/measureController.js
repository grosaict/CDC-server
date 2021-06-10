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
                weight:         index / 2,  // using index to poulate >>> default = 0,
                isSetW:         true,   // using true to populate >>> default = false,
                length:         0,
                isSetL:         false,
                head:           0,
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
/*     const body = req.body;
    const itemID = req.params.id;
    const imagens = [];
    if(req.files.length){
        req.files.map((file, index) => {
            imagens.push(`${process.env.HOST}:${process.env.PORT}/files/${file.filename}`)
        });
        body.imagens = imagens;
    }
    const filter = { _id: itemID };
    try {
        if(req.files === undefined){
            body.imagens = [];
        }
        await Item.findOneAndUpdate(filter, body);
        res.status(200).json({"message": "Item Atualizado com sucesso"});
    } catch (err){
        res.status(400).send({"message": "Erro ao atualizar item"});
    } */
}