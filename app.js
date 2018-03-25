// added Application Insights to send events, traces and catch exception logs
const appInsights = require("applicationinsights");
appInsights.setup("53191698-6269-4b46-b617-9d9624b6726d")
  .setAutoCollectConsole(true)
  .setAutoDependencyCorrelation(false)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .start();
var client = appInsights.defaultClient;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var azure = require('azure-storage');
var logger = require('morgan');
var fs = require('fs');
var bodyParser = require('body-parser');
const uuidv1 = require('uuid/v1');
var dateFormat = require('dateformat');
var now = new Date();
var stringifiedJson = fs.readFileSync('../getValues.json', 'utf8');
var jsonSecrets = JSON.parse(stringifiedJson);

var accessKey = jsonSecrets.storageAccountKey; // '5cBnLmOhF5AA/RC2y2TRYjfATfj+GOUOMT4hsAlM+CMDQaLDMrrY7GOLgdEA0/wSJeGVEOCtwcmU2U3iCBotXg==';
var storageAccount = jsonSecrets.storageAccountName; //'hitrefreshstorage'
var tableService = azure.createTableService(storageAccount, accessKey);


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/events', (req, res, err) => {
  tableService.createTableIfNotExists('garageeventsforfeedback', function (error, result, response) {
    if (!error) {
      // table exists or created
      // result contains true if created; false if already exists
      if (result.created) {
        
        console.log("new table is created !");
      }
      else {
        // console.log(dateFormat(now.getTime()+2  * 86400000, "dd-mmm-yy"));
        // var dateToday = dateFormat(now.getUTCMilliseconds() - (3600000*5.5), "dd-mmm-yy");
        // obtain local UTC offset and convert to msec
        // var localOffset = now.getTimezoneOffset() * 60000;
        // var ist = now.getTime() - localOffset;
        // ist = ist + (3600000*5.5);

        // var nowDate = new Date(ist);
        // console.log(Date.parse('3/26/2018  12:00:00 AM GMT+0530'));
        // console.log(nowDate);
        // console.log(now);
        // console.log(now.toString());
        // console.log("table already existed!")
        var query = new azure.TableQuery().where( 'StartDate le ?', now, ' and EndDate ge ?', now  );
        tableService.queryEntities('garageeventsforfeedback',query, null, function(error, result, response) {
          if(!error) {
            res.send(result.entries);
          }
        });

      }
    }
  })
});



app.use('/questions', (req, res, err) => {
  tableService.createTableIfNotExists('garageeventsforfeedback', function (error, result, response) {
    if (!error) {
      // table exists or created. Result contains true if created; false if already exists
      if (result.created) {
        console.log("new table is created !");
      }
      else {
        // if(req.query.event==-1)
        // req.query.event = "Garage General Feedback";
        var query = new azure.TableQuery().select('EventCategory').where( 'EventName eq ?', req.query.event );
        tableService.queryEntities('garageeventsforfeedback',query, null, function(error, result, response) {
          if(!error) {
            var eventCategory = result.entries[0].EventCategory['_'];
            var query = new azure.TableQuery().where( 'PartitionKey eq ?', eventCategory);
            tableService.queryEntities('feedbackquestionnaire',query, null, function(error, result, response) {
              if(!error) {
                res.send(result.entries);
              }
            });
          }
        });
      }
    }
  });
});



app.use('/submit', function (req, res) {
  var responses=req.body; 
  tableService.createTableIfNotExists('feedbackresponses', function (error, result, response) {
    if (!error) {
      // console.log("submit ");
      // table exists or created. Result contains true if created; false if already exists
      if (result.created) {
        // throw "New Table Got Created!";
        console.log("new table is created !");
      }
      else {
        // var task = {
        //   PartitionKey: {'_':'hometasks'},
        //   RowKey: {'_': '1'},
        //   description: {'_':'take out the trash'},
        //   dueDate: {'_':new Date(2015, 6, 20), '$':'Edm.DateTime'}
        // };
        var batch = new azure.TableBatch();
        // var now = ;
        for(var i = 0; i < responses.length;i++){
          responses[i]['RowKey']['_'] = uuidv1(new Date().getTime());
          if(!responses[i]['Answer'] || responses[i]['Answer'] == undefined || responses[i]['Answer']['_'] == "" )
          {
            continue;
          }
          else
          {
            batch.insertEntity(responses[i], {echoContent: false});
          }                   
        }
        client.trackEvent("Number of questions answered by ",responses[0]['EmployeeId'], " for event",responses[0]['Event'],  " :batch.size()");
        if(batch.hasOperations()){
          tableService.executeBatch('feedbackresponses',batch, function (error, result, response) {
            if(!error) {
              // console.log(result);
              res.status(200).json({"msg":"Your Response is Recorded. Thanks!"}).end()
            }
            else{
              client.trackException(new Error("Error Occurred while trying to insert the batched entity:"+error));
              res.status(500).json({"msg":"Error! Please Try Again!"}).end();
              
              // console.log(error);
            }
          });
        }
        else{
          client.trackEvent(new Error ("No feedback is provided by " + responses[0]['EmployeeId']));
          res.status(404).json({"msg":"Please Fill a Response..."}).end();
        }
      }
    }
  })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
