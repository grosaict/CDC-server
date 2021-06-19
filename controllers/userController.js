const { registerValidation } = require('../validations');
const tokenController = require('../controllers/tokenController');

const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
    
    const data = req.body;
    
    const {error} = registerValidation(data);
    if(error){
        return res.status(404).send(error.details[0].message);
    }

    if(data.password !== data.confirmPassword){
        res.status(406).json({ status: 406, message: "Senhas não conferem"});
    }

    const emailLowerCase = data.email.toLowerCase();

    const emailExist = await User.findOne({email: emailLowerCase});
    if(emailExist) {
        return res.status(406).send({ status: 406, message: "Email já registrado"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(data.password, salt);

    const user = new User({
        name:       data.name,
        email:      emailLowerCase,
        password:   hashPassword,
    });

    try {
        const savedUser = await user.save();
        const token     = tokenController.generateToken(savedUser);
        res.status(200).json({"token": token});
    } catch (err){
        console.log("createUser > err >>>")
        console.log(err)
        res.status(400).send({ status: 400, message: "Erro ao registrar usuário"});
    }
}