/**
 * Created by Yeyo on 13/10/16.
 */

var User  = require('../models/user.js');
var Job  = require('../models/job.js');
var jsdom = require("jsdom").jsdom;
var doc = jsdom();
var window = doc.defaultView;
var $ = require("jquery")(window);
var async = require('async');

exports.addJob = function(username, serviceName, outputFile, status, cb) {

    async.waterfall([
        async.apply(findUser, username),
        saveJob,
        updateJoblist
    ], cb);



    function findUser(username, callback) {
        var user;

        User.find({userName: username}, function(error, query) {

            if (query.length) {

                user = query.pop();

            } else {
                user = new User ({
                    userName : username
                });

                user.save(function(err, job) {
                    if (err) console.log("Error saving user: " + err);
                });
            }

            console.log(user);

            callback(null, user);
        });
    }

    function saveJob(user, callback) {

        var job1 = new Job ({
            user              :    user._id,
            jobName           :    serviceName,
            outputFile        :    outputFile,
            status            :    status
        });

        job1.save(function(err, job) {
            if (err) console.log("Error saving job: " + err);
        });



        callback(null, user, job1);
    }

    function updateJoblist(user,job,callback){

        console.log("Updating Joblist of user: "+user.userName);

        User.findByIdAndUpdate(user._id,
            {$push: {'jobList': job._id}},
            {safe: true, upsert: false}, function (err, user){
                if (err) console.log("Error updating joblist: " + err); else console.log("Joblist updated correctly: " + user);
            });

        callback(null, job);
    }
};

exports.updateJob = function(jobID, outputFile, status) {
    Job.findByIdAndUpdate(jobID,
        {'outputFile': outputFile, 'status': status},
        {safe: true, upsert: false},
        function (err, model) {
            if (err) console.log("Error updating job: " + err); else console.log("Job updated correctly: " + model);
        });
};

exports.listJobs = function(req, res, returnData){
    var user = req.query.username;

    User.find({userName: user}, function (err, query) {
        if (query.length) {
            var user = query.pop();
            Job.find({user: user._id}, function (err, query) {
                if (query.length) {
                    res.json(query);
                }
            })

        } else {
            console.log('User doesnt exist');
            res.status(500).send('User doesnt exist');
        }
    });
};