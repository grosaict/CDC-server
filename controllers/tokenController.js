const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    return token;
};

module.exports.validation = function(req, res, next){
    const token = req.header('token');

    if(!token){
        return res.status(401).send({ status: 401, message: 'Acesso negado!' });
    }

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }catch(err){
        console.log("tokenValidation > err >>>")
        console.log(err)
        res.status(401).send({  status: 401, message: "Token inválido! Acesso negado! " });
    }
}