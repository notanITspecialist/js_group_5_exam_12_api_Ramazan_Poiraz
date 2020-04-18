const path = require('path');
const rootPath = __dirname;

module.exports = {
    rootPath,
    uploads: path.join(rootPath, 'public', 'uploads'),
    baseUrl: 'mongodb://localhost/gallery',
    baseConfig: {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true},
    facebook: {
        appId: '2815399871870371',
        appSecret: '7db2d933189ee6585f67bafc0d164725'
    }
};