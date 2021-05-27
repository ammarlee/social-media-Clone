const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: 'ammarleejot', 
    api_key: '898697172461775', 
    api_secret: 'xVPvW1xPnou2py68mrTPqbiJ3zg' 

})

module.exports = {cloudinary}