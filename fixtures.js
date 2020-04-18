const mongoose = require('mongoose');
const config = require('./config');

const User = require('./models/User');
const GalleryItem = require('./models/GalleryItem');

const init = async () => {
    await mongoose.connect(config.baseUrl, config.baseConfig);

    const [valera, steve] = await User.create({
        username: 'valera',
        displayName: 'Валера',
        password: '12345',
        token: '12345',
        avatar: '0eNl99hOmzMb5Ts71WnZu.jpg',
    }, {
        username: 'steve',
        displayName: 'Steve',
        password: '12345',
        token: '12345',
        avatar: 'zRJLDKXliRpvOiis3fO2d.jpg',
    });

    await GalleryItem.create({
        title: 'Field',
        author: valera,
        image: '0mLODLcg2kKHGDBc0qQAD.jpg'
    }, {
        title: 'Яга',
        author: valera,
        image: 'l4V5yFhiQALVekoVjNH7O.jpg'
    }, {
        title: 'Trip',
        author: steve,
        image: 'TexywgXCn_yCKqYzjhvcf.jpg'
    })

};

init().catch(e => {
    throw e
});