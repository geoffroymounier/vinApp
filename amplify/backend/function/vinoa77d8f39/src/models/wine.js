const mongoose = require('mongoose'), Model = mongoose.model;
let wine = require('../schemas/wine.js')
const Cellar = require('./cellar.js')

wine.post('save', async function() {

  let {stock,cellarId} = this
  console.log(stock)
  await Cellar.findOneAndUpdate({
    _id : cellarId
  },{"$inc" : {"stock":1*(stock||0)}})
  .then((done)=>console.log('done'))
  .catch((err)=>console.log(err))
})


module.exports = Model("Wine",wine)
