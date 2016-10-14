/**
 * Created by Yeyo on 13/10/16.
 */

var User  = require('../models/user.js');
var Job  = require('../models/job.js');

exports.addJob = function(req, res) {

    User.find({userName: 'guest'}, function (err, query) {
        if (query.length) {
            console.log('Name exists already');
            console.log(query);

            var user = query.pop();

            var job1 = new Job ({
                username          :    user._id,
                jobName           :   'jobname',
                outputFile        :   'myfile',
                status            :   'finished'
            });

            job1.save(function(err, job) {
                if(err) return res.status(500).send( err.message);
            });

            User.findByIdAndUpdate(user._id,
                {$push: {'jobList': job1._id}},
                {safe: true, upsert: false},
                function(err, model) {
                    console.log(err);
                    console.log(model);
                }
            );

            res.send({response:'ok'});
        } else {
            console.log("User doesn't exist");

            var user = new User({
                userName: 'guest'
            });

            user.save(function (err) {
                if (err) console.log(err);
            });

            console.log("User saved");

            var job1 = new Job ({
                username          :    user._id,
                jobName           :   'jobname',
                outputFile        :   'myfile',
                status            :   'finished'
            });

            job1.save(function(err, job) {
                if(err) return res.status(500).send( err.message);
                res.send(JSON.stringify(job));
            });

            console.log("Job created");
            console.log(job1._id);
            console.log(user._id);

            User.findByIdAndUpdate(user._id,
                {$push: {'jobList': job1._id}},
                {safe: true, upsert: false},
                function(err, model) {
                    console.log(err);
                    console.log(model);
                }
            );
        }
    });

}