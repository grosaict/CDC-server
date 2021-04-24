const User = require('../models/User');
const Kid = require('../models/Kid');

const Item = require('../models/Item'); // EXCLUIR

exports.loadAllKids = async (req, res) => {
    try {
        let kids = await Kid.find({isAtivo: true}).sort({createAt: 'desc'}).exec();
        /* for (const [idx, item] of itens.entries()) {     ### USER POPULATION NOT REQUIRED
            const user = await User.findById(item.user);
            item.user = user;
            if(req.user._id == user._id){
                item.owner = true;
            }
        } */
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
}