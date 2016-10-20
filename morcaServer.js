var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
var mongoose = require('mongoose');

var jsdom = require("jsdom").jsdom;
var doc = jsdom();
var window = doc.defaultView;
var $ = require("jquery")(window);

/*app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});*/

var rawParser = bodyParser.text({ type: 'text/xml'});
var JSONParser = bodyParser.json();

var jobsCtrl = require('./controllers/jobs');
var mapiCtrl = require('./controllers/mapiMid');

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

var port = process.env.PORT || 8082;

var jobs = express.Router();
jobs.route('/addJob')
    .post(jobsCtrl.addJob);

jobs.post('/morcanode/execute', JSONParser, mapiCtrl.executeServiceJSON);

app.use(jobs);

mongoose.connect('mongodb://localhost/morca', function(err, res) {
	if(err) {
		console.log('ERROR: connecting to Database. ' + err);
	} else {
		console.log('Connected to Database');
         mongoose.Promise = global.Promise;
	}
});

app.listen(port);
console.log('Server listening at: ' + port);