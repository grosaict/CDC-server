const User = require('../models/User');
const Kid = require('../models/Kid');

exports.loadAllKids = async (req, res) => {
    try {
        let kids = await Kid.find({isActive: true, user: req.user._id}).sort({name: 'asc'}).exec();
        res.status(200).json({data: kids});
    } catch (err){
        res.status(400).send({"message": "Erro ao buscar as crianças"});
    }
}

exports.loadKid = async (req, res) => {
    const requestURL = req.headers.referer.split('/')
   /*  let isEdit = false;
    if(requestURL.indexOf('edit') != -1){
        isEdit = true;
    } */
    const kidId = req.params.id;
    try {
        const kid = await Kid.findOne({_id: kidId}).exec();
        kid.user  = await User.findById(kid.user);
        /* if(isEdit){ */
            if(kid.user._id == req.user._id){
                res.status(200).json({
                    data: kid,
                });
            } else {
                res.status(403).send({
                    message: 'Acesso negado',
                });
            }
        /* } else {
            res.status(200).json({
                data: kid,
            });
        } */
    } catch (err){
        res.status(400).send({"message": "Erro ao buscar criança"});
    }
}

exports.createKid = async (req, res) => {
    const { name, birth , gender } = req.body;

    let nameUpper       = name.toUpperCase()
    let genderUpper     = gender.toUpperCase()
    const birthDay      = new Date(birth).getDate()
    const birthMonth    = new Date(birth).getMonth()
    const birthYear     = new Date(birth).getFullYear()
    const birthGMT3     = new Date(birthYear, birthMonth, birthDay)

    function setMeasures () {
        const today = new Date()
        let blankMeasures = []
        let sDate = birthGMT3

        for (let index = 0; index <= 24; index++) {
            index > 0 ? sDate = addOneMonth(sDate) : false
            blankMeasures [index] = {
                dueMonth:       index,
                scheduleDate:   sDate,
                weight:         index, // using index to poulate >>> default = 0,
                isSetW:         true,       // using true to populate >>> default = false,
                length:         0,
                isSetL:         false,
                head:           0,
                isSetH:         false,
                lastUpdate:     today
            };
        }
        return blankMeasures;
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
                        day = 30;
                        break;
                }
            }
        }
        return new Date(year, month, day);
    }

    const newKid = new Kid({
        name: nameUpper,
        birth: birthGMT3,
        gender: genderUpper,
        measures: setMeasures (birth),
        user: req.user._id
    });

    //console.log(newKid);
    //console.log(JSON.stringify(newKid));

    try {
        
        await newKid.save();
        res.status(200).json({"message": "Criança cadastrada com sucesso"});
    } catch (err){
        res.status(400).json({"message": "Erro ao registrar criança"});
    }
}