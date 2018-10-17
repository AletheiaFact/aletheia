'use strict';

var mongoose = require('mongoose'),
Candidate = mongoose.model('Candidate');

exports.listAll = function(req, res) {
    Candidate.find({}, function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

exports.create = function(req, res) {
    var new_task = new Candidate(req.body);
    new_task.save(function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

exports.getCandidateId = function(req, res) {
    Candidate.findById(req.params.taskId, function(err, task) {
        if (err)
        res.send(err);
        res.json(task);
    });
};

exports.update = function(req, res) {
    Candidate.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
        if (err)
        res.send(err);
        res.json(task);
    });
};

exports.delete = function(req, res) {

    Candidate.remove({
        _id: req.params.taskId
    }, function(err, task) {
        if (err)
            res.send(err);
        res.json({ message: 'Task successfully deleted' });
    });
};

// 'use strict';

// var mongoose = require('mongoose')
// const axios = require('axios')
// var CandidateModel = require('../model/candidateModel')

// class Candidate {
//     static async listAll () {
//         CandidateModel.find({}, function(err, task) {
//             if (err)
//                 res.send(err)
//             res.json(task)
//         })
//     }

// create (req, res) {
//     var new_task = new CandidateModel(req.body)
//     new_task.save(function(err, task) {
//         if (err)
//             res.send(err)
//         res.json(task)
//     })
// }

// getCandidateId (req, res) {
//     CandidateModel.findById(req.params.taskId, function(err, task) {
//         if (err)
//             res.send(err)
//         res.json(task)
//     })
// }

// update (req, res) {
//     CandidateModel.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
//         if (err)
//             res.send(err)
//         res.json(task)
//     })
// }

// delete (req, res) {
//     CandidateModel.remove({
//     _id: req.params.taskId
// }, function(err, task) {
//     if (err)
//     res.send(err)
//     res.json({ message: 'Task successfully deleted' })
// })
// }
// }
// module.exports = Candidate