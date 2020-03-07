const Wine = require('../models/wine.js')
const Cellar = require('../models/cellar.js')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  textSearch : (req,search) => {
    return new Promise((resolve,reject) => {

      let and = [
        {cellarId : {'$in' : req.cellars}}, // userId vaut saut req.params.uid , soit token.decoded.userId
        {'$or' : [
          {domain : new RegExp(search, "gi")},
          {region : new RegExp(search, "gi")},
          {appelation : new RegExp(search, "gi")} ,
          {country : new RegExp(search, "gi")}
        ]}
      ]
      Wine.find(
        {'$and' : and }).then((results)=>{

          resolve(results)
        }).catch(err => reject(err))
    })
  },
  get : (req,_id) => {
    return new Promise((resolve,reject) => {
      console.log(_id)
      console.log(req.query)
      let {keyOrder,order,limit,minYear,minPrice,maxPrice, maxYear,minApogee,maxApogee,color,cuisine_monde,favorite,stock,nez,legumes,viandes,poissons,desserts,aperitif,fromages,bouche,appelation,domain,region,country,pastilles} = req.query
      let and = [
        _id ?  {_id} : {},
        {cellarId : {'$in' : req.cellars}}, // userId vaut saut req.params.uid , soit token.decoded.userId
        minYear ? {annee : {'$gte' : parseInt(minYear)}} : {},
        maxYear ? {annee : {'$lte' : parseInt(maxYear)}} : {},
        minPrice ? {price : {'$gte' : parseInt(minPrice)}} : {},
        maxPrice ? {price : {'$lte' : parseInt(maxPrice)}} : {},
        minApogee ? {apogee : {'$gte' : parseInt(minApogee)}} : {},
        maxApogee ? {apogee : {'$lte' : parseInt(maxApogee)}} : {},
        favorite ? {favorite} : {},
        stock ? {stock : {'$gte' : 0}} : {},
        color ? {color : {'$in' : color.split(',')}} : {},
        domain ? {domain : new RegExp(domain, "gi")} : {},
        region ? {region : new RegExp(region, "gi")} : {},
        country ? {country : new RegExp(country, "gi")} : {},
        appelation ? {appelation : new RegExp(appelation, "gi")} : {},
        cuisine_monde ? {cuisine_monde : {'$in' : cuisine_monde.split(',')}} : {},
        viandes ? {viandes : {'$in' : viandes.split(',')}} : {},
        poissons ? {poissons : {'$in' : poissons.split(',')}} : {},
        desserts ? {desserts : {'$in' : desserts.split(',')}} : {},
        fromages ? {fromages : {'$in' : fromages.split(',')}} : {},
        aperitif ? {aperitif : {'$in' : aperitif.split(',')}} : {}
      ]
      let lim = !isNaN(limit) ? parseInt(limit) : 10
      let sort = { [keyOrder||'region']: order || 1 }

      Wine.find(
        {'$and' : and }).sort( { [keyOrder||'region']: parseInt(order) || 1 } ).limit(lim).then((results)=>{

          resolve(results)
        }).catch(err => reject(err))
    })
  },
  set : (req,wine,wineId=new ObjectId()) => {
    return new Promise((resolve,reject) => {
      console.log(req.cellars)
      Wine.findOne({'$and' : [
        {cellarId : {'$in' : req.cellars}},
        {_id:wineId}
      ]}).then(async (doc)=>{
        if (!doc) {
          console.log(wine)
          Wine.create(wine).then((results)=>{
            resolve(results)
          }).catch((err)=>{
            console.log(err)
            reject(err)
          })
        } else {
          Cellar.findOneAndUpdate({
              _id : doc.cellarId
            },{"$inc" : {"stock":-1*(doc.stock||0)}}).then(()=>{
              doc = Object.assign(doc,wine)
              doc.save().then(results =>{
                resolve(results)
              })
            }).catch((err)=>{
              console.log(err)
              reject(err)
          })
        }
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },
  delete : (req,wines) => {
    return new Promise((resolve,reject) => {
      let query = {}
      if (req.query.allSelect == 'true' && req.cellars.findIndex(cellar => req.query.cellarId.toString() == cellar) > -1 ){
        query = {cellarId : req.query.cellarId}
      } else {
        query = {'$and' : [
          {cellarId : {'$in' : req.cellars}},
          {_id:{'$in' : wines}}
        ]}
      }
      Wine.deleteMany(query).then((results)=>{
        resolve(results)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },
  move : (req,wines) => {
    return new Promise((resolve,reject) => {
      let query = {}
      if (req.query.allSelect == 'true' && req.cellars.findIndex(cellar => req.query.cellarId.toString() == cellar) > -1 ){
        query = {cellarId : req.query.cellarId}
      } else {
        query = {'$and' : [
          {cellarId : {'$in' : req.cellars}},
          {_id:{'$in' : wines}}
        ]}
      }
      Wine.updateMany(query,{cellarId:req.query.newCellarId}).then((results)=>{
        resolve(results)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  }
}
