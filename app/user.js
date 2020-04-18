const express = require('express');

const authorization = require('../middlewerase/authorization');

const User = require('../models/User');

const router = express.Router();
const multer = require('multer');
const {nanoid} = require('nanoid');
const path = require('path');
const axios = require('axios');

const config = require('../config');
const checkToken = require('../middlewerase/tokenCheck');
const bcrypt = require("bcrypt");

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, config.uploads)
    },
    filename: (req, file, cd) => {
        cd(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

router.post('/', upload.single('avatar'), async (req, res) => {
    if (req.file) {
        req.body.avatar = 'http://localhost:8000/uploads/' + req.file.filename;
    }

    console.log(req.body.avatar, config.uploads);
    const newUser = new User(req.body);

    try {
        newUser.addToken();
        await newUser.save();

        res.send(newUser)
    } catch (e) {
        res.status(404).send({error: 'Such username already exists'})
    }
});

router.post('/sessions', authorization, async (req, res) => {
    req.user.addToken();
    req.user.save();

    res.send(req.user)
});

router.post('/change', [checkToken, upload.single('avatar')], async (req, res) => {
    if (req.file) {
        req.body.avatar = 'http://localhost:8000/uploads/' + req.file.filename;
    }

    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);

        req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const chengeInfo = {
        username: req.body.username,
        displayName: req.body.displayName,
        avatar: req.body.avatar,
        password: req.body.password,
        facebookChangeUsername: true,
    };

    let send = {};


    if (req.body.displayName.length === 0 && req.body.displayName.length < 5) delete chengeInfo.displayName;
    if (!req.body.avatar) delete chengeInfo.avatar;
    if (!req.user.facebookId) delete chengeInfo.username;
    if (req.body.username !== req.user.username && req.user.facebookChangeUsername && chengeInfo.facebookChangeUsername) {
        chengeInfo.username = req.user.username;
        send.error = 'Username пользователя уже был изменен ранее';
        send.facebookChangeUsername = 'changed';
    }
    if (chengeInfo.facebookChangeUsername === req.user.facebookChangeUsername) {
        chengeInfo.username = req.user.username;
        delete chengeInfo.facebookChangeUsername
    }
    if (req.user.facebookId) delete chengeInfo.password;

    await User.updateOne({username: req.user.username}, chengeInfo);

    const data = await User.findOne({username: chengeInfo.username});
    send.user = data;

    res.send(send)

});

router.post('/facebook', async (req, res) => {
    const inputToken = req.body.accessToken;
    const accessToken = config.facebook.appId + '|' + config.facebook.appSecret;

    const url = `https://graph.facebook.com/debug_token?input_token=${inputToken}&access_token=${accessToken}`;

    const response = await axios.get(url);
    const facebookData = response.data.data;

    if (facebookData.error) return res.status(401).send({error: 'Facebook token is incorrect'});

    if (req.body.id !== facebookData.user_id) return res.status(401).send({error: 'User id is incorrect'});

    let user = await User.findOne({facebookId: req.body.id});

    if (!user) {
        user = new User({
            username: req.body.id,
            password: nanoid(),
            facebookId: req.body.id,
            displayName: req.body.name,
            avatar: req.body.picture.data.url
        })
    }

    user.addToken();
    await user.save();

    return res.send(user);
});

router.delete('/sessions', async (req, res) => {
    const success = {message: "success"};
    try {
        const token = req.get('Authorization').split(' ')[1];

        if (!token) return res.send(success);

        const user = await User.findOne({token});

        if (!user) return res.send(success);

        user.addToken();
        await user.save();

        return res.send(success);

    } catch (e) {
        res.send(success)
    }

});

module.exports = router;