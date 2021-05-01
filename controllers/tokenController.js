const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    return token;
};

module.exports.validation = function(req, res, next){
    const token = req.header('token');

    if(!token){
        return res.status(401).send('Acess Denied');
    }

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }catch(err){
        res.status(400).send("Invalid Token");
    }
}