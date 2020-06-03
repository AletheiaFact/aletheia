class Requester {
    static internalError(res, message, logger) {
        if (logger) {
            logger.log(`error/http`, message);
        }
        res.status(500).json({ message });
    }
}

module.exports = Requester;
