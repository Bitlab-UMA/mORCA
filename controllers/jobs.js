/**
 * Created by Yeyo on 13/10/16.
 */

var User  = require('../models/user.js');
var Job  = require('../models/job.js');

exports.addJob = function(req, res) {

        var user = new User({
            _id               :   0,
            userName          :   'guest'
        });

        user.save(function (err) {
            if (err) return handleError(err);
        });

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

}