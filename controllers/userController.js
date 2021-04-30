const { registerValidation } = require('../validations/validations');
const tokenController = require('../controllers/tokenController');

const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getUser = async (req, res) => {
    const user = 1;
    try {
        res.status(200).json({"user": user});
    } catch (err){
        res.status(201).send({"message": "Erro ao registrar usaurio"});
    }
}

exports.createUser = async (req, res) => {
    
    const data = req.body;
    
    const {error} = registerValidation(data);
    if(error){
        return res.status(404).send(error.details[0].message);
    }

    if(data.password !== data.confirmPassword){
        res.status(201).json({"message": "Senhas não conferem"});
    }

    const emailExist = await User.findOne({email: data.email});
    if(emailExist) {
        return res.status(201).send({"message": "Email já registrado"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(data.password, salt);

    const user = new User({
        name: data.name,
        email: data.email,
        password: hashPassword,
    });

    try {
        const savedUser = await user.save();
        const token = tokenController.generateToken(savedUser);
        res.status(200).json({"token": token});
    } catch (err){
        res.status(201).send({"message": "Erro ao registrar usaurio"});
    }

}