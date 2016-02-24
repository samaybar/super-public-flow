//This will get data from a mongoDB and write it to a local file
//which can be processed into CSV for use in Tableau
var i = 0;

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var fs = require('fs');
var settings = require('./settings.js');


//specify the URL for the mongodb that has the data
//var url = 'mongodb://<USERNAME>:<PASSWORD>@XXXXXXXX.mongolab.com:XXXXX/<DATABASENAME>';
var url = settings.url;

//var outputFileName = '<FILENAME>.js';
var outputFileName = settings.rawDataFileName;

//var collectionName = '<COLLECTION_NAME>';
var collectionName = settings.collectionName;

//retrieve data collected after this time
//var collectFrom = 1448238540;
var collectFrom = settings.collectFrom;

var superPublicData = [];

var findSuperPublic = function(db, callback) {
   var cursor =db.collection(collectionName).find({
    "interactions.fb": {
        "$exists": true
        },
    "reset_at": {
        "$gte": collectFrom
      }
    });
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
        i += 1;
        console.log("Contact..." + i);
         superPublicData.push(doc);
      } else {
         callback();
      }
   });
};

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  findSuperPublic(db, function() {
      //console.log(JSON.stringify(superPublicData));
      writeData(superPublicData,outputFileName);
      db.close();
  });
});

function writeData(outputData,fileName){
  writeString = "var spData = " + JSON.stringify(outputData) + ";";
  writeString += "\nmodule.exports = spData;";
  fs.appendFile(fileName, writeString, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("Saved data to: "+ fileName);
});  
}


