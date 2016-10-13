var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var job_schema = new Schema({
    user              : { type: Number, ref: 'User' },
    jobName           :   String,
    outputFile        :   String,
    status            :   String
});

module.exports = mongoose.model('Job', job_schema);