#Introduction
These tools are to help manage Super Public Data for PYLON.

There are three primary tools here:
* 1) A bash script to be run as a cron job that will collect super public data from a PYLON index and send it to a mongoDB database
* 2) a node.js script to grab Super Public data stored in a mongoDB and write it to a local file
* 3) a node.js script to take the Super Public data from the file and write it to four CSV tables for use in Tableau.

This workflow has been created to work in conjunction with a MongoDB instance set up at www.mongolab.com, but it could easily be modified to work with other instances of a mongodb.

#Overview
The goal is to be able to pull up to 100 super public items every hour and send them to a database.

They are created to work in conjunction with a MongoDB instance set up at 
www.mongolab.com.

##1. Create cron job to retrieve Super Public Data and send to mongoDB
* Step 1: create a mongodb @ mongolab.com and create a database with a collection
* Step 2: get your API key from mongolab.com
* Step 3: edit sp_to_mongo.sh to include your mongo info above as well as your pylon API username, key, and index hash
* Step 4: set up sp_to_mongo.sh to run as a cron job on a linux server. I have the script run every 5 minutes and pull 25 items each time. You could choose differently. As written, this script will not run on a Mac due to the date handling. To run on a mac, simply explicitly input the epoch time window instead. Your Super Public data should now be accumulating in your mongoDB.

##2. Retrieve data from mongoDB and create CSV files for use in Tableau
* Step 5: configure the settings_default.js file (and rename as settings.js)
* Step 6: node getMongo.js --> this will grab the data from the mongoDB and write it to a file, named as specified in the settings.js -- rawDataFileName
* Step 7: node exportToCSV.js --> this will take the data in the file just created and parse it into 4 csv tables
	-- sp-flow_super_public_sample.csv --> contains the text and other main level data
	-- sp-flow_super_public_topics.csv --> contains the topics associated with each post
	-- sp-flow_super_public_hashtags.csv --> contains the hashtags associated with each post
	-- sp-flow_super_public_links.csv --> contains the links associated with each post
