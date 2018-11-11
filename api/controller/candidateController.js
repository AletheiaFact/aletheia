'use strict';

const mongoose = require('mongoose');

const Candidate = mongoose.model('Candidate');

exports.listAll = function(req, res) {
    Candidate.find({}, (err, task) => {
        if (err) { res.send(err); }
        res.json(task);
    });
};

exports.create = function(req, res) {
    const newTask = new Candidate(req.body);
    newTask.save((err, task) => {
        if (err) { res.send(err); }
        res.json(task);
    });
};

exports.getCandidateId = function(req, res) {
    Candidate.findById(req.params.taskId, (err, task) => {
        if (err) { res.send(err); }
        res.json(task);
    });
};

exports.update = function(req, res) {
    Candidate.findOneAndUpdate({ _id: req.params.taskId }, req.body, { new: true }, (err, task) => {
        if (err) { res.send(err); }
        res.json(task);
    });
};

exports.delete = function(req, res) {

    Candidate.remove({
        _id: req.params.taskId
    }, (err, task) => {
        if (err) { res.send(err); }
        res.json({ message: 'Task successfully deleted' });
    });
};
