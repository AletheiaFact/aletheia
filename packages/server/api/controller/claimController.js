'use strict';

const mongoose = require('mongoose');
const Parser = require('../../lib/parser');
const Claim = mongoose.model('Claim');
const Personality = mongoose.model('Personality');

exports.listAll = function(req, res) {
    Claim.find({}, (err, claim) => {
        if (err) { res.send(err); }
        res.json(claim);
    });
};

exports.create = function(req, res) {
    const p = new Parser(req.body.html);
    req.body.content = p.parse();
    const newClaim = new Claim(req.body);

    newClaim.save((err, claim) => {
        if (err) { res.send(err); }
        Personality.findOneAndUpdate(
            { _id: req.body.personality },
            { "$push": { claims: claim } },
            { new: true },
            (err, personality) => {
                if (err) { res.send(err); }
            });
        res.json(claim);
    });
};

exports.getclaimId = function(req, res) {
    Claim.findById(req.params.id, (err, claim) => {
        if (err) { res.send(err); }
        res.json(claim);
    });
};

exports.update = function(req, res) {
    Claim.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, claim) => {
        if (err) { res.send(err); }
        res.json(claim);
    });
};

exports.delete = function(req, res) {

    Claim.remove({
        _id: req.params.id
    }, (err, claim) => {
        if (err) { res.send(err); }
        res.json({ message: 'claim successfully deleted' });
    });
};
