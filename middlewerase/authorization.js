const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = async (req, res , next) => {
    const user = await User.findOne({username: req.body.username});

    if(!user) res.status(400).send({error: 'Username or password in incorrect'});

    const match = await bcrypt.compare(req.body.password, user.password);

    if(!match) res.status(400).send({error: 'Username or password in incorrect'});

    req.user = user;
    next()
};