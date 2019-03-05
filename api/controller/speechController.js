'use strict';

const mongoose = require('mongoose');
const Parser = require('../../lib/parser');

const Speech = mongoose.model('Speech');

exports.listAll = function(req, res) {
    Speech.find({}, (err, speech) => {
        if (err) { res.send(err); }
        res.json(speech);
    });
};

exports.create = function(req, res) {
    console.log(req.body.html);
    const p = new Parser(req.body.html);
    req.body.content = p.parse();
    const newSpeech = new Speech(req.body);

    newSpeech.save((err, speech) => {
        if (err) { res.send(err); }
        res.json(speech);
    });
};

exports.getSpeechId = function(req, res) {
    Speech.findById(req.params.id, (err, speech) => {
        if (err) { res.send(err); }
        res.json(speech);
    });
};

exports.update = function(req, res) {
    Speech.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, speech) => {
        if (err) { res.send(err); }
        res.json(speech);
    });
};

exports.delete = function(req, res) {

    Speech.remove({
        _id: req.params.id
    }, (err, speech) => {
        if (err) { res.send(err); }
        res.json({ message: 'speech successfully deleted' });
    });
};
