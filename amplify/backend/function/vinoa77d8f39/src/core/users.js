const User = require('../models/user.js')

module.exports = {
  create : (params) => {
    return new Promise((resolve,reject) => {
      User.create(JSON.parse(params),
      function (err, users) {
        if (err) return reject(err)
        // create a token
        resolve(users)
      });
    })
  },
  set : (req,userId,post) => {
    return new Promise((resolve,reject) => {
      User.findOneAndUpdate({'$and' : [
        {_id:userId}, // userId vaut saut req.params.uid , soit token.decoded.userId
        req.decoded.admin ? {} : {_id : { '$in' : req.cellars}}   // admin ou alors => doit faire partie des pairs
      ]}
      ,post
      ,{new: true,upsert:req.decoded.admin == true}).then((user)=>{
          resolve(user)
      }).catch(err => reject(err))
    })
  },
  get : (req,userId = null) => {
    return new Promise((resolve,reject) => {
      console.log(userId ? {_id:userId} : {})
      console.log(req.decoded.admin ? {} : {_id : { '$in' : req.cellars}})
      User.find({'$and' : [
        userId ? {_id:userId} : {}, // userId vaut saut req.params.uid , soit token.decoded.userId
        req.decoded.admin ? {} : {_id : { '$in' : req.cellars}}   // dans tous les cas => doit faire partie des pairs
      ]}).then((users)=>{

        resolve(users) // no need to store in a {}
      }).catch(err => reject(err))
    })
  },
  delete : (params) => {
    return new Promise((resolve,reject) => {

    })
  }
}
