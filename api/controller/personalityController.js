'use strict';

const Personality = require('../model/personalityModel');

exports.listAll = function(req, res) {
    Personality.find({}, (err, personality) => {
        if (err) { res.send(err); }
        res.json(personality);
    });
};

exports.create = function(req, res) {
    const newPersonality = new Personality(req.body);
    newPersonality.save((err, personality) => {
        if (err) { res.send(err); }
        res.json(personality);
    });
};

exports.getPersonalityId = function(req, res) {
    Personality.findById(req.params.personalityId, (err, personality) => {
        if (err) { res.send(err); }
        res.json(personality);
    });
};

exports.update = function(req, res) {
    Personality.findOneAndUpdate(
        { _id: req.params.personalityId },
        req.body,
        { new: true },
        (err, personality) => {
            if (err) { res.send(err); }
            res.json(personality);
        });
};

exports.delete = function(req, res) {

    Personality.remove({
        _id: req.params.personalityId
    }, (err, personality) => {
        if (err) { res.send(err); }
        res.json({ message: 'personality successfully deleted' });
    });
};
