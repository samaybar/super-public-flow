//rename me settings.js
var settings = {
	"url" : 'mongodb://<USERNAME>:<PASSWORD>@XXXXXXXX.mongolab.com:XXXXX/<DATABASENAME>',//mongodb credentials
	"rawDataFileName" : 'superPublicData.js',//name of file to write data from mongodb
	"collectionName" : '<COLLECTION_NAME>',//name of collection in mongodb with super public data
	"collectFrom" : 1448316000,//time at which earliest interactions were put into mongodb
	"outputFilePrefix" : 'sp-flow',//for csv output files
	"useHeaders" : true //true for a new file -- it will put headers in; false will supress headers
};
module.exports = settings;