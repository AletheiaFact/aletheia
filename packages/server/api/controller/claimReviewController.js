'use strict';

const mongoose = require('mongoose');
const ClaimReview = mongoose.model('ClaimReview');

exports.listAll = function(req, res) {
    ClaimReview.find({}, (err, claimReview) => {
        if (err) { res.status(400).send(err).end(); }
        res.json(claimReview).end();
    });
};

exports.create = function(req, res) {
    const newTask = new ClaimReview(req.body);
    newTask.save((err, claimReview) => {
        if (err) { res.status(400).send(err).end(); }
        res.json(claimReview).end();
    });
};

exports.getClaimReviewId = function(req, res) {
    ClaimReview
    .findOne({ "_id": req.params.id })
    .populate('claims', '_id title')
    .exec((err, claimReview) => {
        if (err) { res.status(400).send(err).end(); }
        res.json(claimReview).end();
    });
};

exports.update = function(req, res) {
    ClaimReview.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true },
        (err, claimReview) => {
            if (err) { res.status(400).send(err).end(); }
            res.json(claimReview).end();
        });
};

exports.delete = function(req, res) {

    ClaimReview.remove({
        _id: req.params.id
    }, (err, claimReview) => {
        if (err) { res.status(400).send(err).end(); }
        res.json({ message: 'ClaimReview successfully deleted' }).end();
    });
};
