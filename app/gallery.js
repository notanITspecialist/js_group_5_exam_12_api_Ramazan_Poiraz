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

router.get('/', async (req, res) => {
    const data = await GalleryItem.find().populate('author');

    res.send(data);
});

router.get('/:id', async (req, res) => {
   const data = await GalleryItem.find({author: req.params.id}).populate('author');

   res.send({data, author: data[0].author});
});

router.post('/', [tokenCheck, upload.single('image')], async (req, res) => {
    if (req.file) {
        req.body.image = 'http://localhost:8000/uploads/' + req.file.filename;
    }

    const newPhoto = {
        title: req.body.title,
        author: req.user._id,
        image: req.body.image
    };

    if(newPhoto.title.length < 3) return res.send({error: 'Field title less then 3 symbols!'});
    if(!newPhoto.image) return res.send({error: 'Field image not found!'});

    const photo = await GalleryItem.create(newPhoto);

    res.send(photo);
});

module.exports = router;