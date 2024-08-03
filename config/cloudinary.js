// config/cloudinary.js
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({ 
    cloud_name: 'dempyh9cj', 
    api_key: '764382244829955', 
    api_secret: 'EyjZTFtFquWvRsBdo_DEUhlzb40' // Click 'View Credentials' below to copy your API secret
});


module.exports = cloudinary;
