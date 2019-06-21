'use strict';

const mongoose = require('mongoose');
const ClaimReview = mongoose.model('ClaimReview');

exports.listAll = function(req, res) {
    ClaimReview.find({}, (err, claimReview) => {
        if (err) { res.send(err); }
        res.json(claimReview);
    });
};

exports.create = function(req, res) {
    const newTask = new ClaimReview(req.body);
    newTask.save((err, claimReview) => {
        if (err) { res.send(err); }
        res.json(claimReview);
    });
};

exports.getClaimReviewId = function(req, res) {
    ClaimReview
    .findOne({ "_id": req.params.id })
    .populate('claims', '_id title')
    .exec((err, claimReview) => {
        if (err) { res.send(err); }
        res.json(claimReview);
    });
};

exports.update = function(req, res) {
    ClaimReview.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true },
        (err, claimReview) => {
            if (err) { res.send(err); }
            res.json(claimReview);
        });
};

exports.delete = function(req, res) {

    ClaimReview.remove({
        _id: req.params.id
    }, (err, claimReview) => {
        if (err) { res.send(err); }
        res.json({ message: 'ClaimReview successfully deleted' });
    });
};
