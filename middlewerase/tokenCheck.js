const User = require('../models/User');

module.exports = async (req, res, next) => {
    const reqToken = await req.get('Authorization');
    const [type, token] = reqToken.split(' ');

    const user = await User.findOne({token});

    if(type !== 'Token' || !user) return res.status(401).send({error: 'Unauthorized'});
    req.user = user;
    next();
};