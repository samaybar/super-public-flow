var fs = require('fs');
var moment = require('moment');
var settings = require('./settings.js');

//The name of data file to use -- created from getMongo.js
var sourceData = settings.rawDataFileName;

//prefix to use for output csv files
var outputFilePrefix = settings.outputFilePrefix;

//Is this an existing file you are adding to or a new file?
var useHeaders = settings.useHeaders; //true for a new file -- it will put headers in; false will supress headers
var indexTags = settings.indexTags;

//create object for data to write to files
var writeData = {content : '', topics : '', hashtags : '', links : ''};

var vedoHeader = {};
var vedoFileName = {};
//console.log(indexTags.length);
for (var z = 0; z < indexTags.length; z++){
  
  vedoHeader[indexTags[z]] = useHeaders;
  vedoFileName[indexTags[z]] = outputFilePrefix + "_super_public_" + indexTags[z] + ".csv";
  //console.log("file name:" + vedoFileName[indexTags[z]]);
  writeData[indexTags[z]] = '';
}




//the source file should be saved as a .js file and export array of Super Public objects
var data = require('./' + sourceData);


//temp variables to check for headers
var contentHeader = useHeaders, topicHeader = useHeaders, hashtagHeader = useHeaders, linkHeader = useHeaders;

var outputFileName = outputFilePrefix + "_super_public_sample.csv";
var topicFileName = outputFilePrefix + "_super_public_topics.csv";
var hashtagFileName = outputFilePrefix + "_super_public_hashtags.csv";
var linkFileName = outputFilePrefix + "_super_public_links.csv";


var sample = data;



//write content table
if(contentHeader){  
  writeData.content = 'id,date,created_at,content,media_type,subtype,language\n';
  contentHeader = false;
}

var csvSample;

//console.log(sample.length + " length");

//loop through objects in file with data from mongo (standard data file has only one)
for (var k = 0; k < sample.length; k++){ 
  //console.log("pass "+k+" on sample table");
  csvSample = jsonToCsv(sample[k]);
}  
 
//write the csv data to files 
writeToFile(csvSample.content,outputFileName);
writeToFile(csvSample.topics,topicFileName);
writeToFile(csvSample.hashtags,hashtagFileName);
writeToFile(csvSample.links,linkFileName);
for (var z = 0; z < indexTags.length; z++){
  writeToFile(csvSample[indexTags[z]],vedoFileName[indexTags[z]]); 
}
 

/**
 * jsonContentToCsv - results object to array of csv strings
 * 
 * @param obj
 * @return obj
 */
function jsonToCsv(data) {
  //console.log("items: " + data.interactions.length);

  for (var i = 0; i < data.interactions.length; i++) {
      var interactionText = data.interactions[i].interaction.content
      interactionText = interactionText.replace(/\n/g,' \\n');
      //so that CSV doesn't break with quotes in content
      interactionText = interactionText.replace(/\"/g,' \'');
      var contentDate = data.interactions[i].interaction.created_at;
      //strip off the day of the week on the date
      createdDate = contentDate.replace(/(.+?),\s/g,'');
      //version of date without time
      
      shortDate = moment.utc(contentDate).format("MM/DD/YYYY HH:mm:ss");
      writeData.content += '\"' + data.interactions[i].interaction.id + '\"';
      writeData.content += ',\"' + shortDate + '\"';
      writeData.content += ',\"' + createdDate + '\"';
      writeData.content += ',\"' + interactionText + '\"';
      writeData.content += ',\"' + data.interactions[i].interaction.media_type + '\"';
      writeData.content += ',\"' + data.interactions[i].interaction.subtype + '\"';
      writeData.content += ',\"' + data.interactions[i].fb.language + '\"\n';
      //console.log("pass "+i+" on main table");
      //console.log("pass "+i+" on main table");
      
      //write topic table
      if (data.interactions[i].fb.topics) {
        for (var j = 0; j < data.interactions[i].fb.topics.length; j++) {
          //check to see if we have written a header already
          if(topicHeader){
            writeData.topics += 'id,topic,category,category_topic\n'
            topicHeader = false;
          }
          //console.log("pass "+j+" on topic table, "+i+" on main table");
          writeData.topics += '\"' + data.interactions[i].interaction.id + '\"';
          writeData.topics += ',\"' + data.interactions[i].fb.topics[j].name + '\"';
          writeData.topics += ',\"' + data.interactions[i].fb.topics[j].category + '\"';
          writeData.topics += ',\"' + data.interactions[i].fb.topics[j].category_name + '\"\n';
        }
      }

      //write hashtag table
      if (data.interactions[i].interaction.hashtags) {
        for (var j = 0; j < data.interactions[i].interaction.hashtags.length; j++) {
          //check to see if we have written a header already
          if(hashtagHeader){
            writeData.hashtags += 'id,hashtag\n'
            hashtagHeader = false;
          }
          //console.log("pass "+j+" on hashtag table, "+i+" on main table");
          writeData.hashtags += '\"' + data.interactions[i].interaction.id + '\"';
          writeData.hashtags += ',\"' + data.interactions[i].interaction.hashtags[j] + '\"\n';
        }
      }

      //write link table
      if (data.interactions[i].links && data.interactions[i].links.url) {
        //console.log(data.interactions[i].fb.topics)
        for (var j = 0; j < data.interactions[i].links.url.length; j++) {
          //check to see if we have written a header already
          if(linkHeader){
            writeData.links += 'id,url\n'
            linkHeader = false;
          }
          //console.log("pass "+j+" on link table, "+i+" on main table");
          writeData.links += '\"' + data.interactions[i].interaction.id + '\"';
          writeData.links += ',\"' + data.interactions[i].links.url[j] + '\"\n';
        }
      }

      //write tags
      if (data.interactions[i].interaction.tag_tree){
        for (var y = 0; y < indexTags.length; y++){
          getTagData(data.interactions[i].interaction,indexTags[y]);
        }
      }
    }
  return writeData;
}

//populate data from Tag_Tree Table
function getTagData(interactionNode, nameSpace){
  var nodeNameString = "tag_tree." + nameSpace;
  var tagLevelData = ref(interactionNode, nodeNameString);
  if (interactionNode.tag_tree && tagLevelData) {
    //console.log("we have tags");
    for (var m = 0; m < tagLevelData.length; m++) {
      //check to see if we have written a header already
      if(vedoHeader[nameSpace]){
        console.log("we shoudl write header");
        writeData[nameSpace] += 'id,' + nameSpace + '\n';
        vedoHeader[nameSpace] = false;
      }
      var tagLevelDataItem = ref(interactionNode, nodeNameString)[m];
      //console.log("pass "+m+" on "+nameSpace+" table, ");
      writeData[nameSpace] += '\"' + interactionNode.id + '\"';
      writeData[nameSpace] += ',\"' + tagLevelDataItem + '\"\n';
    }
  }
}

//gets value at node of object using string with dot notation
function ref(obj, str) {
    return str.split(".").reduce(function(o, x) { return o[x] }, obj);
}

//writes data to file
function writeToFile(outputData,fileName){
  fs.appendFile(fileName, outputData, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("Saved data to: "+ fileName);
  });  
}

