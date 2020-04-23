const SupportReferenceRespository = require("../repository/supportReference");

module.exports = class SupportReferenceController {
    listAll() {
        try {
            return SupportReferenceRespository.listAll();
        } catch (error) {
            return error;
        }
    }

    create(body) {
        try {
            return SupportReferenceRespository.create(body);
        } catch (error) {
            return error;
        }
    }

    getSupportReferenceId(id) {
        try {
            return SupportReferenceRespository.getById(id);
        } catch (error) {
            return error;
        }
    }

    async update(id, body) {
        try {
            return SupportReferenceRespository.update(id, body);
        } catch (error) {
            return error;
        }
    }

    async delete(id) {
        try {
            await SupportReferenceRespository.delete(id);
            return { message: "SupportReference successfully deleted" };
        } catch (error) {
            return error;
        }
    }
};
