import SourceRepository from "../repository/source";

module.exports = class SourceController {
    create(body) {
        try {
            return SourceRepository.create(body);
        } catch (error) {
            return error;
        }
    }

    getSourceId(id) {
        try {
            return SourceRepository.getById(id);
        } catch (error) {
            return error;
        }
    }

    async update(id, body) {
        try {
            return SourceRepository.update(id, body);
        } catch (error) {
            return error;
        }
    }

    async delete(id) {
        try {
            await SourceRepository.delete(id);
            return { message: "Source successfully deleted" };
        } catch (error) {
            return error;
        }
    }
};
