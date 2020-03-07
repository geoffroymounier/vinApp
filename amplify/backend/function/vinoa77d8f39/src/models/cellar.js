const mongoose = require('mongoose'), Model = mongoose.model;
const cellar = require('../schemas/cellar.js')

module.exports = Model("Cellar", cellar)
