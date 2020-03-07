/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authVinoff0142d2UserPoolId = process.env.AUTH_VINOFF0142D2_USERPOOLID

Amplify Params - DO NOT EDIT */
const {wine}=require('./core');
const mongoose = require('mongoose')
var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

const port = '3000'
const secretKey = 'abcdefghijklmnopqrstuvwxyz'
const dbUser =   "mymac"
const dbPass = "weiH8ahb"
const dbCluster = "cluster0-4wcde"
const mongoose = require('mongoose')
const connnectString =  "mongodb+srv://"+dbUser+":"+dbPass+"@"+dbCluster+".mongodb.net/test"
let cachedDb = null;

function connectToDatabase () {
  return new Promise((resolve,reject) => {
    console.log('=> connect to database');
    if (cachedDb) {
      console.log('=> using cached database instance');
      resolve(cachedDb);
    }
    mongoose.connect(connnectString,{ useNewUrlParser: true })
    .then((db)=>{
      cachedDb = db;
      resolve(db)
    }).catch((e)=>{
      console.log(e)
      reject(e)
    });
  })
}



/**********************
 * Example get method *
 **********************/

 app.get('/wines', async (req,res) => {
   const connection = await connectToDatabase();
   wine.get(req,null)
   .then((response)=>{
     res.status(200).send(response)
   })
   .catch((err)=>{
     console.log(err)
     res.status(500).send("There was a problem finding the wine , code : " + err)
   })
 })

/****************************
* Example post method *
****************************/

app.post('/api', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.post('/api/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
* Example put method *
****************************/

app.put('/api', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/api/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/api', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/api/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
