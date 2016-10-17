var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

var jobsCtrl = require('./controllers/jobs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8081;

var jobs = express.Router();
jobs.route('/addJob')
    .post(jobsCtrl.addJob);

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