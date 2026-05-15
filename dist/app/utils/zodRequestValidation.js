"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (zodSchema) => async (req, res, next) => {
    try {
        if (req.body.data) {
            try {
                req.body = JSON.parse(req.body.data);
            }
            catch (error) {
                return res.status(400).json({ success: false, message: "Invalid Form-data formate" });
            }
        }
        req.body = await zodSchema.parseAsync(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=zodRequestValidation.js.map