#this script will call super public and send results to mongoDB
#this will not run on mac due to the date portion  
#to run on mac, specify Start and End timestamps directly
#remember to chmod +x 

##fill in info below
#earliest date for SP Data
STARTDATE="11/13/2015" 
#latest date for SP Data
ENDDATE="11/21/2015"
HASH="<INDEX_HASH>"
AUTH="<PYLON_USERNAME:PYLON_API_KEY>"
#number of records to pull each time
COUNT=25
#MONGODB INFO
MONGOAPIKEY="<MONGODB_API_KEY>"
DBNAME="<MONGO_DATABASE_NAME>"
COLLECTIONNAME="<MONGO_COLLECTION_NAME>"

STARTUNIX=$(date  --date=$STARTDATE +%s)
ENDUNIX=$(date  --date=$ENDDATE +%s)
#echo $STARTUNIX
#echo $ENDUNIX
SPSAMPLE="$(curl -s -X POST https://api.datasift.com/v1.2/pylon/sample \
-d "{\"hash\": \"$HASH\", \"count\": $COUNT, \"filter\":\"fb.content exists\", \"start\":$STARTUNIX,\"end\":$ENDUNIX}" \
-H "Content-type: application/json" \
-H "Authorization: $AUTH")"
SIZE=${#SPSAMPLE}
if [ $SIZE -lt 100 ]; then
echo $SPSAMPLE
exit 1
else
curl -i -X POST "https://api.mongolab.com/api/1/databases/$DBNAME/collections/$COLLECTIONNAME?apiKey=$MONGOAPIKEY" \
-H "Content-Type:application/json" \
-d "$SPSAMPLE"
fi
