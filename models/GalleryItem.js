const mongoose = require('mongoose');

const GalleryItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }
});

const GalleryItem = mongoose.model('galleryItem', GalleryItemSchema);

module.exports = GalleryItem;