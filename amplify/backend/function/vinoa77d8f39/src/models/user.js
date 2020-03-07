const mongoose = require('mongoose'), Model = mongoose.model;
const user = require('../schemas/user.js')


module.exports = Model("User", user)
