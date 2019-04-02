'use strict';

const mongoose = require('mongoose');

const Personality = mongoose.model('Personality');
// Personality.relationship({ path: 'speechs', ref: 'Speech', refPath: 'personality' });

exports.listAll = function(req, res) {
    Personality.find({}, (err, task) => {
        if (err) { res.send(err); }
        res.json(task);
    });
};

exports.create = function(req, res) {
    console.log(req.body);
    const newTask = new Personality(req.body);
    newTask.save((err, task) => {
        if (err) { res.send(err); }
        res.json(task);
    });
};

exports.getPersonalityId = function(req, res) {
    Personality
    .findOne({"_id": req.params.id})
    .populate('speechs', '_id title')
    .exec((err, personality) => {
        if (err) { res.send(err); }
        console.log(personality);
        res.json(personality);
    })
};

exports.update = function(req, res) {
    Personality.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, task) => {
        if (err) { res.send(err); }
        res.json(task);
    });
};

exports.delete = function(req, res) {

    Personality.remove({
        _id: req.params.id
    }, (err, task) => {
        if (err) { res.send(err); }
        res.json({ message: 'Task successfully deleted' });
    });
};
