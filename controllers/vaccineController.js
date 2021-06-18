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
        response.status     = 200
        response.message    = "Sucesso"
        return response
    } catch (err){
        response.status     = 400
        response.message    = "Erro"
        response.error      = err
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
        response.status     = 200
        response.message    = "Sucesso"
        return response
    } catch (err){
        response.status     = 400
        response.message    = "Erro"
        response.error      = err
        response.err        = err
        return response;
    }
}

exports.createSusVaccines = async (req) => { return SusVaccines(req) }

const SusVaccines = async (req) => {
    const {_id, birth}  = req;
    let newSUS

    let response = {
        vaccine:    null,
        err:        null
    }

    try {
        for (let index = 0; index < susVaccines.length; index++) {
            newSUS = new Vaccine({
                dueMonth:       susVaccines[index].dueMonth,
                scheduleDate:   addMonths(birth, susVaccines[index].dueMonth),
                name:           susVaccines[index].name,
                nameLower:      susVaccines[index].name.toLowerCase(),
                description:    susVaccines[index].description,
                isSUS:          true,
                isSet:          false,
                kid:            _id
            })
            await newSUS.save()
        }
        response.status     = 200
        response.message    = "Sucesso"
        return response
    } catch (err){
        response.status     = 400
        response.message    = "Erro"
        response.error      = err
        return err
    }
}

exports.newVaccine = async (req, res) => {
    const userId            = req.user._id
    const { dueMonth, name, description , applicationDate, isSet, kid } = req.body;

    //console.log("newVaccine > req.body >>>")
    //console.log(req.body)

    const isDataOk = () => {
        const today     = new Date(new Date().getFullYear(), new Date().getMonth() ,new Date().getDate())

        if (dueMonth === ''    || dueMonth === undefined  ||
            dueMonth < 0 ) {
            return false
        }

        if (!name              || name === ''             ||
            name === undefined) {
            return false
        }

        if (isSet !== true     && isSet !== false) {
            return false
        }

        if (isSet) {
            if(!applicationDate ||
                applicationDate === '' ||
                applicationDate === undefined ||
                (applicationDate.getTime() - kid.birth.getTime()) < 0 || // applicationDate  < kid.birth
                (today.getTime() - applicationDate.getTime()) < 0 ){     // today            < applicationDate
                return false
            }
        }
        return true
    }

    try {
        const vacExist = await Vaccine.findOne({ nameLower: name.toLowerCase() , kid: kid._id }).exec();

        if(vacExist) {
            return res.status(201).json({ status: 201, message: "Vacina já registrada"});
        }

        if (!isDataOk) {
            return res.status(400).json({ status: 400, message: "Problema com os dados digitados"});
        }

        const newVac = new Vaccine({
            dueMonth:           dueMonth,
            scheduleDate:       addMonths(kid.birth, dueMonth),
            name:               name,
            nameLower:          name.toLowerCase(),
            description:        description,
            applicationDate:    isSet ? applicationDate : null,
            isSUS:              false,
            isSet:              isSet,
            kid:                kid._id,
        });

        console.log("newVaccine > newVac >>>")
        console.log(newVac)

        await newVac.save();
        
        res.status(200).json({ status: 200, message: "Vacina cadastrada com sucesso"});
    } catch (err){
        res.status(400).json({ status: 400, message: "Erro ao cadastrar vacina", error: err });
    }
}

exports.updateVaccine= async (req, res) => {
    const filter            = { _id: req.params.id } // vaccineId
    const userId            = req.user._id
    const { dueMonth, name, description , isSet } = req.body;
    const applicationDate   = new Date(req.body.applicationDate)


    const isDataOk = (k, v) => {
        const kidBirth  = k.birth
        const today     = new Date(new Date().getFullYear(), new Date().getMonth() ,new Date().getDate())

        if (!v.isSUS) {
            if (!name              || name === ''             ||
                name === undefined) {
                return false
            }

            if (dueMonth === ''    || dueMonth === undefined  ||
                dueMonth < 0 ) {
                return false
            }
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
        if (!v) {
            return res.status(400).send({ status: 400, message: "Erro a localizar vacina"});
        }
        const k = await Kid.findOne({_id: v.kid}).exec();
        if (!k) {
            return res.status(400).send({ status: 400, message: "Erro a localizar criança"});
        }
        if (!isDataOk(k, v)) {
            return res.status(400).send({ status: 400, message: "Alguma medida informada está acima ou abaixo do aceitável"});
        }

        const body      = {
            isSet:              isSet,
            lastUpdate:         new Date(),
        }

        if (!v.isSUS) {
            body.dueMonth       = dueMonth
            body.scheduleDate   = addMonths(k.birth, dueMonth)
            body.name           = name
            body.nameLower      = name.toLowerCase()
            body.description    = description
        }

        isSet ? body.applicationDate = applicationDate : body.applicationDate = null

        if(userId != k.user._id){
            return res.status(403).send({ status: 403, message: 'Acesso negado', });
        }
        await Vaccine.findOneAndUpdate(filter, body).exec();
        res.status(200).json({ status: 200, message: "Vacina atualizada com sucesso"});
    } catch (err){
        console.log("err >>>")
        console.log(err)
        res.status(400).send({ status: 400, message: "Erro ao atualizar vacina", error: err });
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