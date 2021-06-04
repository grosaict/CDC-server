/* const User = require('../models/User');
const Item = require('../models/Item');


exports.cadastrarItem = async (req, res) => {
    const { dataAchadoPerdido, titulo, categoria, descricao, tipo } = req.body;
    const imagens = [];
    req.files.map((file, index) => {
        imagens.push(`${process.env.HOST}:${process.env.PORT}/files/${file.filename}`)
    })
    const newItem = new Item({
        titulo: titulo,
        tipo: tipo,
        categoria: categoria,
        descricao: descricao,
        dataAchadoPerdido: dataAchadoPerdido,
        imagens: imagens, 
        user: req.user._id
    });
    try {
        await newItem.save();
        res.status(200).json({"message": "Item cadastrado com sucesso"});
    } catch (err){
        res.status(400).json({"message": "Erro ao registrar item"});
    }
}

exports.buscarTodosItens = async (req, res) => {
    try {
        let itens = await Item.find({isAtivo: true}).sort({createAt: 'desc'}).exec();
        for (const [idx, item] of itens.entries()) {
            const user = await User.findById(item.user);
            item.user = user;
            if(req.user._id == user._id){
                item.owner = true;
            }
        }
        res.status(200).json({data: itens});
    } catch (err){
        res.status(400).send({"message": "Erro ao buscar itens"});
    }
}

exports.buscarItem = async (req, res) => {
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

exports.atualizarItem = async (req, res) => {
    const body = req.body;
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
    }
}

exports.desativarItem = async (req, res) => {
    const itemID = req.params.id;
    const filter = { _id: itemID };
    try {
        await Item.findOneAndUpdate(filter, {isAtivo: false});
        res.status(200).json({"message": "Item desativado com sucesso"});
    } catch (err){
        res.status(400).send({"message": "Erro ao desativar item"});
    }
} */


