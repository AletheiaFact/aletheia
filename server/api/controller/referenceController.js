const ReferenceRepository = require("../repository/reference");

module.exports = class ReferenceController {
    listAll() {
        try {
            return ReferenceRepository.listAll();
        } catch (error) {
            return error;
        }
    }

    create(body) {
        try {
            return ReferenceRepository.create(body);
        } catch (error) {
            return error;
        }
    }

    getReferenceId(id) {
        try {
            return ReferenceRepository.getById(id);
        } catch (error) {
            return error;
        }
    }

    async update(id, body) {
        try {
            return ReferenceRepository.update(id, body);
        } catch (error) {
            return error;
        }
    }

    async delete(id) {
        try {
            await ReferenceRepository.delete(id);
            return { message: "Reference successfully deleted" };
        } catch (error) {
            return error;
        }
    }
};
