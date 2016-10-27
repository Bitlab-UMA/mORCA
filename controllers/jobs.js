/**
 * Created by Yeyo on 13/10/16.
 */

var User  = require('../models/user.js');
var Job  = require('../models/job.js');
var jsdom = require("jsdom").jsdom;
var doc = jsdom();
var window = doc.defaultView;
var $ = require("jquery")(window);

exports.addJob = function(user, serviceName, outputFile, status) {

    var findUser = User.find({userName: user}, function (err, query) {
        if (query.length) {
            console.log('Name exists already');
            console.log(query);

            var user = query.pop();

            console.log("User found: "+user);

            var job1 = new Job ({
                user              :    user._id,
                jobName           :    serviceName,
                outputFile        :    outputFile,
                status            :    status
            });

            var saveJob = job1.save(function(err, job) {
                if(err){
                    console.log("Error saving job: "+err);
                    return false;
                }
            });

            saveJob.then(function(job){
                console.log("Job created: "+job1._id);
                return job1._id;
            });

            User.findByIdAndUpdate(user._id,
                {$push: {'jobList': job1._id}},
                {safe: true, upsert: false},
                function(err, model) {
                    console.log(err);
                    console.log(model);
                }
            );

        } else {
            console.log("User doesn't exist");

            var user = new User({
                userName: 'guest'
            });

            user.save(function (err) {
                if (err) console.log(err);
            });

            console.log("User saved: "+user);

            var job1 = new Job ({
                user              :    user._id,
                jobName           :    serviceName,
                outputFile        :    outputFile,
                status            :    status
            });

            job1.save(function(err, job) {
                if(err){
                    console.log("Error saving job: "+err);
                    return false;
                }
            });

            User.findByIdAndUpdate(user._id,
                {$push: {'jobList': job1._id}},
                {safe: true, upsert: false},
                function(err, model) {
                    if(err) console.log("Error updating user: "+err); else console.log("Job added to user: "+model);
                });

            var jobID = job1._id;
            console.log("JobID2: ")
            console.log(jobID);
            return jobID
        }
    });

    findUser.then(function (doc) {
        console.log("Now: ");
        console.log(doc);
    });
};

exports.updateJob = function(jobID, outputFile, status) {

    console.log("jobID: "+jobID+ " / outputFile: "+outputFile+" / status: "+status);

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
            console.log('Name exists already');
            console.log(query);

            var user = query.pop();

            Job.find({user:user._id}, function(err, jobs){
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(jobs));
            });

        } else {
            console.log('User doesnt exist')
            res.setHeader('Content-Type', 'application/json');
            res.send("No");
        }
    });
};