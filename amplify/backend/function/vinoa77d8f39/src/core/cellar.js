const Cellar = require('../models/cellar.js')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {

  set : (req,cellar,cellarId=new ObjectId()) => {
    return new Promise((resolve,reject) => {
      Cellar.findOneAndUpdate({'$and' : [
        {_id : cellarId},
        {userId : req.decoded.userId}
      ]},{...cellar,userId:req.decoded.userId},{new: true,upsert:true}).then((results)=>{
        console.log(results)
        resolve(results)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },
  get : (req,cellarId) => {
    return new Promise((resolve,reject) => {
      Cellar.find(
        {'$and' : [
          {userId : req.decoded.userId}, // userId vaut saut req.params.uid , soit token.decoded.userId
          cellarId ? {_id:cellarId} : {_id : { '$in' : req.cellars}}   // get all belongs to userId...
        ]}).then((results)=>{
          resolve(results)
        }).catch(err => reject(err))
    })
  },
  delete : (req,cellars) => {
    return new Promise((resolve,reject) => {
      Cellar.deleteMany(
        {'$and' : [
          {userId : req.decoded.userId}, // userId vaut saut req.params.uid , soit token.decoded.userId
          {_id:{ '$in' : cellars}}   // get all belongs to userId...
        ]}).then((results)=>{
          resolve(results)
        }).catch(err => reject(err))

    })
  }
}
