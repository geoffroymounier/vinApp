const mongoose = require('mongoose'), Model = mongoose.model;
const picture = require('../schemas/picture.js')

module.exports = Model("Picture", picture)
