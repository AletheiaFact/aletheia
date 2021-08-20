class Requester {
    static internalError(res, message, logger) {
        if (logger) {
            logger.log(`error/http`, message);
        }
        res.status(500).json({ message });
    }

    static authError(res, message, logger) {
        if (logger) {
            logger.log(`error/http`, message);
        }
        res.status(401).json({ message });
    }
}

module.exports = Requester;
