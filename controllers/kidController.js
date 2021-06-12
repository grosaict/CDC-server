const User              = require('../models/User');
const Kid               = require('../models/Kid');
const MeasureController = require('../controllers/measureController');
const VaccineController = require('../controllers/vaccineController');

exports.loadAllKids = async (req, res) => {
    try {
        let kids = await Kid.find({isActive: true, user: req.user._id}).sort({name: 'asc'}).exec();
        res.status(200).json({data: kids});
    } catch (err){
        res.status(400).send({"message": "Erro ao buscar as crianças"});
    }
}

exports.loadKid = async (req, res) => {
    const kidId = req.params.id;
    try {
        const kid = await Kid.findOne({_id: kidId}).exec();
        kid.user  = await User.findById(kid.user);
        if(kid.user._id == req.user._id){
            const resMeasures = await MeasureController.loadAllMeasures(kid)
            if (!resMeasures.err) {
                kid.measures = resMeasures.measures
                res.status(200).json({
                    data: kid,
                });
            } else {
                res.status(400).send({ message: 'Problema ao obter medidas',});
            }
        } else {
            res.status(403).send({ message: 'Acesso negado', });
        }
    } catch (err){
        res.status(400).send({"message": "Erro ao buscar criança"});
    }
}

exports.loadKidByMeasure = async (req, res) => {
    const measureId = req.params.id;
    try {
        const m         = await MeasureController.loadMeasure(measureId)
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
    }
}

exports.createKid = async (req, res) => {
    const { name, birth , gender } = req.body;

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
            return res.status(400).json({"message": "Erro ao inicializar tabela de medidas"});
        }
        const errorV    = await VaccineController.createSusVaccines(savedKid)
        if (errorV) {
            return res.status(400).json({"message": "Erro ao inicializar o calendário de vacinas do SUS"});
        }
        res.status(200).json({"message": "Criança cadastrada com sucesso"});
    } catch (err){
        res.status(400).json({"message": "Erro ao registrar criança"});
    }
}