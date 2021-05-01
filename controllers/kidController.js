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
    let isEdit = false;
    if(requestURL.indexOf('edit') != -1){
        isEdit = true;
    }
    const kidId = req.params.id;
    try {
        const kid = await Kid.findOne({_id: kidId}).exec();
        kid.user  = await User.findById(kid.user);
        if(isEdit){
            if(kid.user._id == req.user._id){
                res.status(200).json({
                    data: kid,
                });
            } else {
                res.status(403).send({
                    message: 'Acesso negado',
                });
            }
        } else {
            res.status(200).json({
                data: kid,
            });
        }
    } catch (err){
        res.status(400).send({"message": "Erro ao buscar criança"});
    }
}

exports.createKid = async (req, res) => {
    const { name, birth, gender } = req.body;

    let nameUpper   = name.toUpperCase()
    let genderUpper = gender.toUpperCase()

    const newKid = new Kid({
        name: nameUpper,
        birth: birth,
        gender: genderUpper,
        user: req.user._id
    });

    /* console.log(JSON.stringify(newKid)); */

    try {
        await newKid.save();
        res.status(200).json({"message": "Criança cadastrada com sucesso"});
    } catch (err){
        res.status(400).json({"message": "Erro ao registrar criança"});
    }
}