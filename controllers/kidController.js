

const User              = require('../models/User');
const Kid               = require('../models/Kid');
const Measure           = require('../models/Measure');
const Vaccine           = require('../models/Vaccine');
const MeasureController = require('../controllers/measureController');
const VaccineController = require('../controllers/vaccineController');

exports.loadAllKids = async (req, res) => {
    try {
        let kids = await Kid.find({isActive: true, user: req.user._id}).sort({name: 'asc'}).exec();
        res.status(200).json({ status: 200, data: kids});
    } catch (err){
        console.log("loadAllKids > err >>>")
        console.log(err)
        res.status(400).send({ status: 400, message: "Erro ao buscar as crianças"});
    }
}

exports.loadKid = async (req, res) => {
    const kidId = req.params.id;
    try {
        const kid = await Kid.findOne({_id: kidId}).exec();
        kid.user  = await User.findById(kid.user);
        if(kid.user._id == req.user._id){
            const resMeasures = await MeasureController.loadAllMeasures(kid)
            if (resMeasures.status === 400) {
                res.status(400).send({ status: 400, message: 'Problema ao obter medidas',});
            } else {
                kid.measures = resMeasures.measures
                const resVaccines = await VaccineController.loadAllVaccines(kid)
                if (resVaccines.status === 400) {
                    res.status(400).send({ status: 400, message: 'Problema ao obter vacinas',});
                } else {
                    kid.vaccines = resVaccines.vaccines
                    res.status(200).json({ status: 200, message: "Sucesso", data: kid });
                }
            }
        } else {
            res.status(403).send({ status: 403, message: 'Acesso negado', });
        }
    } catch (err){
        console.log("loadKid > err >>>")
        console.log(err)
        res.status(400).send({ status: 400, message: "Erro ao buscar criança" });
    }
}

exports.loadKidByMeasure = async (req, res) => {
    const measureId = req.params.id;
    try {
        const m         = await MeasureController.loadMeasure(measureId)
        const kid       = await Kid.findOne({_id: m.measure.kid}).exec();
        kid.user        = await User.findById(kid.user);
        if(kid.user._id == req.user._id){
            res.status(200).json({ 
                status:     200,
                message:    "Sucesso",
                measure:    m.measure,
                kid:        kid
            });
        } else {
            res.status(403).send({ status: 403, message: 'Acesso negado', });
        }

    } catch (err){
        console.log("loadKidByMeasure > err >>>")
        console.log(err)
        res.status(400).send({ status: 400, message: "Erro ao buscar criança"});
    }
}

exports.loadKidByVaccine = async (req, res) => {
    const vaccineId = req.params.id;
    try {
        const v         = await VaccineController.loadVaccine(vaccineId)
        const kid       = await Kid.findOne({_id: v.vaccine.kid}).exec();
        kid.user        = await User.findById(kid.user);
        if(kid.user._id == req.user._id){
            res.status(200).json({
                status:     200,
                message:    "Sucesso",
                vaccine:    v.vaccine,
                kid:        kid
            });
        } else {
            res.status(403).send({ status: 403, message: 'Acesso negado', });
        }
    } catch (err){
        console.log("loadKidByVaccine > err >>>")
        console.log(err)
        res.status(400).send({ status: 400, message: "Erro ao buscar criança"});
    }
}

exports.createKid = async (req, res) => {
    const { name, birth , gender } = req.body;

    const nameUpper     = name.toUpperCase()
    const genderUpper   = gender.toUpperCase()
    const birthDay      = new Date(birth).getDate()
    const birthMonth    = new Date(birth).getMonth()
    const birthYear     = new Date(birth).getFullYear()
    const birthGMT3     = new Date(birthYear, birthMonth, birthDay, 0, 0, 0,)
    const newBirth      = new Date(birth)
 

    console.log("createKid > birth >>>")
    console.log(birth)
    console.log("createKid > birthDay >>>")
    console.log(birthDay)
    console.log("createKid > birthMonth >>>")
    console.log(birthMonth)
    console.log("createKid > birthYear >>>")
    console.log(birthYear)
    console.log("createKid > birthGMT3 >>>")
    console.log(birthGMT3)
    console.log("createKid > birthGMT3.toLocaleDateString() >>>")
    console.log(birthGMT3.toLocaleDateString())
    console.log("createKid > newBirth.toGMTString() >>>")
    console.log(newBirth.toGMTString())

    const nDate1 = new Date(birth).toLocaleString('en-US', {
        timeZone: 'Asia/Calcutta'
      });
    console.log("createKid > nDate1 > timeZone: 'Asia/Calcutta'");
    console.log(nDate1);

    const nDate2 = new Date(birth).toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo'
      });
    console.log("createKid > nDate2 > timeZone: 'America/Sao_Paulo'");
    console.log(nDate2);


    try {
        const userExist = await User.findOne({_id: req.user._id});
        if(!userExist) {
            return res.status(401).send({ status: 401, message: "Usuário não encontrado"});
        }

        const kidExist = await Kid.findOne({name: nameUpper, user: req.user._id});
        if(kidExist) {
            return res.status(406).send({ status: 406, message: "Criança já registrada"});
        }

        const newKid = new Kid({
            name:       nameUpper,
            birth:      birthGMT3, //birth,
            gender:     genderUpper,
            measures:   new Array(),
            user:       req.user._id
        });

        const savedKid  = await newKid.save();

        const errorM    = await MeasureController.createBlankMeasures(savedKid)
        if (errorM.status !== 200) {
            await   deleteKid(savedKid)
            return  res.status(400).send({ status: 400, message: "Erro ao inicializar tabela de medidas"});
        }

        const errorV    = await VaccineController.createSusVaccines(savedKid)
        if (errorV.status !== 200) {
            await   deleteKid(savedKid)
            return  res.status(400).send({ status: 400, message: "Erro ao inicializar o calendário de vacinas do SUS"});
        }
        res.status(200).json({ status: 200, message: "Criança cadastrada com sucesso"});
    } catch (err){
        //await deleteKid(newKid)
        console.log("createKid > err >>>")
        console.log(err)
        res.status(400).send({ status: 400, message: "Erro ao registrar criança", error: err });
    }
}

const deleteKid = async (kidToDelete) => {
    let response = {}
    try {
        await kidToDelete.deleteOne()
        await Measure.deleteMany({kid: kidToDelete._id}).exec();
        await Vaccine.deleteMany({kid: kidToDelete._id}).exec();
        response.status     = 200
        response.message    = "Sucesso"
        return response
    } catch (err){
        response.status     = 400
        response.message    = "Erro"
        response.error      = err
        console.log("deleteKid > err >>>")
        console.log(err)
          return response;
    }
}