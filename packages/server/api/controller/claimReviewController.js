'use strict';

const mongoose = require('mongoose');
const Personality = mongoose.model('Personality');

exports.listAll = function(req, res) {
    Personality.find({}, (err, personality) => {
        if (err) { res.send(err); }
        res.json(personality);
    });
};

exports.create = function(req, res) {
    const newTask = new Personality(req.body);
    newTask.save((err, personality) => {
        if (err) { res.send(err); }
        res.json(personality);
    });
};

exports.getPersonalityId = function(req, res) {
    Personality
    .findOne({ "_id": req.params.id })
    .populate('claims', '_id title')
    .exec((err, personality) => {
        if (err) { res.send(err); }
        res.json(personality);
    });
};

exports.update = function(req, res) {
    Personality.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true },
        (err, personality) => {
            if (err) { res.send(err); }
            res.json(personality);
        });
};

exports.delete = function(req, res) {

    Personality.remove({
        _id: req.params.id
    }, (err, personality) => {
        if (err) { res.send(err); }
        res.json({ message: 'Personality successfully deleted' });
    });
};
