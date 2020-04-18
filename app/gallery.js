const express = require('express');
const multer = require('multer');
const {nanoid} = require('nanoid');
const path = require('path');
const GalleryItem = require('../models/GalleryItem');

const config = require('../config');
const tokenCheck = require('../middlewerase/tokenCheck');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, config.uploads)
    },
    filename: (req, file, cd) => {
        cd(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

router.post('/', [tokenCheck, upload.single('image')], async (req, res) => {
    if (req.file) {
        req.body.avatar = 'http://localhost:8000/uploads/' + req.file.filename;
    }
    console.log(req.body)
});

module.exports = router;