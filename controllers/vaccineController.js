const Kid       = require('../models/Kid');
const Vaccine   = require('../models/Vaccine');

exports.loadAllVaccines = async (req) => {
    let response = {
        vaccines :  null,
        err:        null
    }
    try {
        response.vaccines = await Vaccine.find({kid: req._id}).sort({dueMonth: 'asc'}).exec();
        if (Object.keys(response.vaccines).length === 0){
            await SusVaccines(req)
            response.vaccines = await Vaccine.find({kid: req._id}).sort({dueMonth: 'asc'}).exec();
        }
        return response
    } catch (err){
        response.err        = err
        return response;
    }
}

exports.loadVaccine = async (idVaccine) => {
    let response = {
        vaccine:    null,
        err:        null
    }
    try {
        response.vaccine = await Vaccine.findOne({_id: idVaccine}).exec();
        return response
    } catch (err){
        response.err = err
        return response;
    }
}

exports.createSusVaccines = async (req) => { return SusVaccines(req) }

const SusVaccines = async (req) => {
    const {_id, birth}  = req;
    let newSUS

    for (let index = 0; index < susVaccines.length; index++) {
        newSUS = new Vaccine({
            dueMonth:       susVaccines[index].dueMonth,
            scheduleDate:   addMonths(birth, susVaccines[index].dueMonth),
            name:           susVaccines[index].name,
            description:    susVaccines[index].description,
            isSUS:          true,
            isSet:          false,
            kid:            _id
        })
        try {
            await newSUS.save()
        } catch (err){
            return err
        }
    }
}

exports.newVaccine = async (req, res) => {
    /* const { name, birth , gender } = req.body;

    const nameUpper     = name.toUpperCase()
    const genderUpper   = gender.toUpperCase()
    const birthDay      = new Date(birth).getDate()
    const birthMonth    = new Date(birth).getMonth()
    const birthYear     = new Date(birth).getFullYear()
    const birthGMT3     = new Date(birthYear, birthMonth, birthDay)

    const newKid = new Kid({
        name: nameUpper,
        birth: birthGMT3,
        gender: genderUpper,
        measures: new Array(),
        user: req.user._id
    });

    try {
        const kidExist = await Kid.findOne({name: nameUpper, user: req.user._id});
        if(kidExist) {
            return res.status(201).send({"message": "Criança já registrada"});
        }
        const savedKid  = await newKid.save();
        const errorM    = await MeasureController.createBlankMeasures(savedKid)
        if (errorM) {
            await   deleteKid(savedKid)
            return  res.status(400).json({"message": "Erro ao inicializar tabela de medidas"});
        }
        const errorV    = await VaccineController.createSusVaccines(savedKid)
        if (errorV) {
            await   deleteKid(savedKid)
            return  res.status(400).json({"message": "Erro ao inicializar o calendário de vacinas do SUS"});
        }
        res.status(200).json({"message": "Criança cadastrada com sucesso"});
    } catch (err){
        res.status(400).json({"message": "Erro ao registrar criança"});
    } */
    res.status(200).json({"message": "Vacina registrada com sucesso"});
}

exports.updateVaccine= async (req, res) => {
    const filter            = { _id: req.params.id } // vaccineId
    const userId            = req.user._id

    const dueMonth          = req.body.dueMonth
    const name              = req.body.name
    const description       = req.body.description
    const applicationDate   = new Date(req.body.applicationDate)
    const isSet             = req.body.isSet

    const isDataOk = (k) => {  // ### TO SET LIMITS BASED ON WHO DATA TABLES
        const kidBirth  = k.birth
        const today     = new Date(new Date().getFullYear(), new Date().getMonth() ,new Date().getDate())

        if (!name              || name === ''             ||
            name === undefined) {
            return false
        }

        if (dueMonth === ''    || dueMonth === undefined  ||
            dueMonth < 0 ) {
            return false
        }

        if (isSet !== true     && isSet !== false) {
            return false
        }

        if (isSet) {
            if(!applicationDate ||
                applicationDate === '' ||
                applicationDate === undefined ||
                (applicationDate.getTime() - kidBirth.getTime()) < 0 || // applicationDate  < kidBirth
                (today.getTime() - applicationDate.getTime()) < 0 ){    // today            < applicationDate
                return false
            }
        }
        return true
    }

    try {
        const v = await Vaccine.findOne(filter).exec();
        const k = await Kid.findOne({_id: v.kid}).exec();
        if (!isDataOk(k)) {
            return res.status(400).send({"message": "Alguma medida informada está acima ou abaixo do aceitável"});
        }

        const body      = {
            dueMonth:           dueMonth,
            scheduleDate:       addMonths(k.birth, dueMonth),
            name:               name,
            description:        description,
            isSet:              isSet,
        }

        isSet ? body.applicationDate = applicationDate : null

        if(userId != k.user._id){
            return res.status(403).send({ message: 'Acesso negado', });
        }
        await Vaccine.findOneAndUpdate(filter, body).exec();
        res.status(200).json({"message": "Vacina atualizada com sucesso"});
    } catch (err){
        console.log("err >>>")
        console.log(err)
        res.status(400).send({"message": "Erro ao atualizar vacina"});
    }
}

function addMonths (dateToInc, inc) {
    let day     = new Date(dateToInc).getDate()
    let month   = new Date(dateToInc).getMonth()
    let year    = new Date(dateToInc).getFullYear()

    if (inc > 0) {
        do {
            if (inc > 12) {
                inc = inc - 12
                year++
            }
        } while (inc > 12)

        month = month + inc

        if (month > 11) {
            month = month - 12
            year++
        }

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

const susVaccines = [
                        {
                            dueMonth:       0,
                            name:           "BCG (dose única)",
                            description:    "Previne contra as formas graves da tuberculose (miliar e meníngea) (bacilo de Calmette-Guérin). Deverá ser aplicada o mais precocemente possível, de preferência ainda na maternidade, em recém-nascidos com peso maior ou igual a 2.000 g."
                        },
                        {
                            dueMonth:       0,
                            name:           "Hepatite B (dose ao nascer)",
                            description:    "Previne contra hepatite B (recombinante). Aplicar a primeira dose nas primeiras 12 horas de vida"
                        },
                        {
                            dueMonth:       2,
                            name:           "Pentavalente (1ª dose)",
                            description:    "Previne contra difteria, tétano, coqueluche pertussis, hepatite B (recombinante) e Haemophilus influenzae b (conjugada)."
                        },
                        {
                            dueMonth:       2,
                            name:           "VIP (1ª dose)",
                            description:    "Vacina Inativada Poliomielite 1, 2 e 3"
                        },
                        {
                            dueMonth:       2,
                            name:           "Pneumocócica 10V (conjugada) (1ª dose)",
                            description:    "Previne contra meningite, pneumonia e otite média aguda."
                        },
                        {
                            dueMonth:       2,
                            name:           "Rotavírus Humano (atenuada) (1ª dose)",
                            description:    "Previne contra rotavírus humano G1P1"
                        },
                        {
                            dueMonth:       3,
                            name:           "Meningocócica C (conjugada) (1ª dose)",
                            description:    ""
                        },
                        {
                            dueMonth:       4,
                            name:           "Pentavalente (2ª dose)",
                            description:    "Previne contra difteria, tétano, coqueluche pertussis, hepatite B (recombinante) e Haemophilus influenzae b (conjugada)."
                        },
                        {
                            dueMonth:       4,
                            name:           "VIP (2ª dose)",
                            description:    "Vacina Inativada Poliomielite 1, 2 e 3"
                        },
                        {
                            dueMonth:       4,
                            name:           "Pneumocócica 10V (conjugada) (2ª dose)",
                            description:    "Previne contra meningite, pneumonia e otite média aguda."
                        },
                        {
                            dueMonth:       4,
                            name:           "Rotavírus Humano (atenuada) (2ª dose)",
                            description:    "Previne contra rotavírus humano G1P1"
                        },
                        {
                            dueMonth:       5,
                            name:           "Meningocócica C (conjugada) (2ª dose)",
                            description:    ""
                        },
                        {
                            dueMonth:       6,
                            name:           "Pentavalente (3ª dose)",
                            description:    "Previne contra difteria, tétano, coqueluche pertussis, hepatite B (recombinante) e Haemophilus influenzae b (conjugada)."
                        },
                        {
                            dueMonth:       6,
                            name:           "VIP (3ª dose)",
                            description:    "Vacina Inativada Poliomielite 1, 2 e 3"
                        },
                        {
                            dueMonth:       9,
                            name:           "Febre Amarela (dose única)",
                            description:    ""
                        },
                        {
                            dueMonth:       12,
                            name:           "Meningocócica C (conjugada) (reforço)",
                            description:    ""
                        },
                        {
                            dueMonth:       12,
                            name:           "Pneumocócica 10V (conjugada) (reforço)",
                            description:    "Previne contra meningite, pneumonia e otite média aguda."
                        },
                        {
                            dueMonth:       12,
                            name:           "Tríplice Viral (dose única)",
                            description:    "Previne contra sarampo, caxumba e rubéola."
                        },
                        {
                            dueMonth:       15,
                            name:           "DTP (1º reforço)",
                            description:    "Previne contra Difteria (crupe), Tétano, Pertussis (tríplice bacteriana), coqueluche, poliomelite e infecções causadas por Haemophilus influenza tipo B."
                        },
                        {
                            dueMonth:       15,
                            name:           "VOP (atenuada) (1º reforço)",
                            description:    "Vacina Oral Poliomielite, previne contra poliomelite 1 e 3."
                        },
                        {
                            dueMonth:       15,
                            name:           "Hepatite A (inativada) (dose única)",
                            description:    ""
                        },
                        {
                            dueMonth:       15,
                            name:           "Tetra Viral (atenuada) (dose única)",
                            description:    "Previne contra sarampo, caxumba, rubéola e varicela."
                        },
                        {
                            dueMonth:       24,
                            name:           "Pneumocócica 23V (conjugada)",
                            description:    "Disponível no SUS somente para POVOS INDÍGENAS. Previne contra protege contra doenças graves causadas pela bactéria pneumococo, como pneumonias, meningites e outras."
                        },
                        {
                            dueMonth:       48,
                            name:           "DTP (2º reforço)",
                            description:    "Previne contra Difteria (crupe), Tétano, Pertussis (tríplice bacteriana), coqueluche, poliomelite e infecções causadas por Haemophilus influenza tipo B."
                        },
                        {
                            dueMonth:       48,
                            name:           "VOP (atenuada) (2º reforço)",
                            description:    "Vacina Oral Poliomielite, previne contra poliomelite 1 e 3."
                        },
                        {
                            dueMonth:       48,
                            name:           "Varicela (atenuada) (dose única)",
                            description:    ""
                        },
                    ]