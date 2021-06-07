const Measure = require('../models/Measure');

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


/* exports.buscarItem = async (req, res) => {
    const requestURL = req.headers.referer.split('/')
    let isEdit = false;
    if(requestURL.indexOf('edit') != -1){
        isEdit = true;
    }
    const itemID = req.params.id;
    try {
        const item = await Item.findOne({_id: itemID}).exec();
        item.user = await User.findById(item.user);
        if(isEdit){
            if(item.user._id == req.user._id){
                res.status(200).json({
                    data: item,
                });
            } else {
                res.status(403).send({
                    message: 'Você não tem acesso a esse item',
                });
            }
        } else {
            res.status(200).json({
                data: item,
            });
        }
    } catch (err){
        res.status(400).send({"message": "Erro ao buscar item"});
    }
} */