'use strict';

const mongoose = require('mongoose');

const Personality = mongoose.model('Personality');

exports.listAll = function(req, res) {
    Personality.find({}, (err, task) => {
        if (err) { res.send(err); }
        res.json(task);
    });
};

exports.create = function(req, res) {
    const newTask = new Personality(req.body);
    newTask.save((err, task) => {
        if (err) { res.send(err); }
        res.json(task);
    });
};

exports.getPersonalityId = function(req, res) {
    Personality.findById(req.params.taskId, (err, task) => {
        if (err) { res.send(err); }
        res.json(task);
    });
};

exports.update = function(req, res) {
    Personality.findOneAndUpdate({ _id: req.params.taskId }, req.body, { new: true }, (err, task) => {
        if (err) { res.send(err); }
        res.json(task);
    });
};

exports.delete = function(req, res) {

    Personality.remove({
        _id: req.params.taskId
    }, (err, task) => {
        if (err) { res.send(err); }
        res.json({ message: 'Task successfully deleted' });
    });
};
