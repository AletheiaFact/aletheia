'use strict';

const PersonalityRepository = require('../repository/personality');

// I think controllers files can be a class and not exporting functions
exports.listAll = function(req, res) {
    return new Promise((resolve, reject) => {
        PersonalityRepository.listAll()
            .then((personality) => {
                resolve(res.json(personality));
            })
            .catch((error) => {
                reject(res.send(error));
            });
    });
};

exports.create = function(req, res) {
    return new Promise((resolve, reject) => {
        PersonalityRepository.create(req.body)
            .then((personality) => {
                resolve(res.json(personality));
            })
            .catch((error) => {
                reject(res.send(error));
            });
    });
};

exports.getPersonalityId = function(req, res) {
    return new Promise((resolve, reject) => {
        PersonalityRepository.getPersonalityId(req.params.id)
            .then((personality) => {
                resolve(res.json(personality));
            })
            .catch((error) => {
                reject(res.send(error));
            });
    });
};

exports.update = function(req, res) {
    return new Promise((resolve, reject) => {
        PersonalityRepository.update(req.params.id, req.body)
            .then((personality) => {
                resolve(res.json(personality));
            })
            .catch((error) => {
                reject(res.send(error));
            });
    });
};

exports.delete = function(req, res) {
    return new Promise((resolve, reject) => {
        PersonalityRepository.delete(req.params.id)
            .then((personality) => {
                resolve(res.json({ message: 'Personality successfully deleted' }));
            })
            .catch((error) => {
                reject(res.send(error));
            });
    });
};
