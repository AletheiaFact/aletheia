const ReferenceRespository = require("../repository/reference");

module.exports = class ReferenceController {
    listAll() {
        try {
            return ReferenceRespository.listAll();
        } catch (error) {
            return error;
        }
    }

    create(body) {
        try {
            return ReferenceRespository.create(body);
        } catch (error) {
            return error;
        }
    }

    getReferenceId(id) {
        try {
            return ReferenceRespository.getById(id);
        } catch (error) {
            return error;
        }
    }

    async update(id, body) {
        try {
            return ReferenceRespository.update(id, body);
        } catch (error) {
            return error;
        }
    }

    async delete(id) {
        try {
            await ReferenceRespository.delete(id);
            return { message: "Reference successfully deleted" };
        } catch (error) {
            return error;
        }
    }
};
