const Picture = require('../models/picture.js')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {

  set : (req,photo,wineId) => {
    return new Promise((resolve,reject) => {
      Picture.findOneAndUpdate({'$and' : [
        {wineId}
      ]},{photo,userId:req.decoded.userId,wineId},{new: true,upsert:true}).then((results)=>{
        console.log(results)
        resolve(results)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },
  get : (req,wineId) => {
    return new Promise((resolve,reject) => {
      Picture.find(
        {'$and' : [
          {userId : req.decoded.userId}, // userId vaut saut req.params.uid , soit token.decoded.userId
          {wineId}   // get all belongs to userId...
        ]}).then((results)=>{
          resolve(results)
        }).catch(err => reject(err))
    })
  },
  delete : (req,cellars) => {
    return new Promise((resolve,reject) => {
      Picture.deleteMany(
        {'$and' : [
          {userId : req.decoded.userId}, // userId vaut saut req.params.uid , soit token.decoded.userId
          {wineId}   // get all belongs to userId...
        ]}).then((results)=>{
          resolve(results)
        }).catch(err => reject(err))

    })
  }
}
