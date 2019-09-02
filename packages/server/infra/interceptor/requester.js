'use strict';

class Requester {
    static internalError(res, message) {
        res.status(500);
        res.json({ message });
    }
}

module.exports = Requester;
