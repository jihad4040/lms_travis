"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuths = void 0;
const AppError_1 = __importDefault(require("../utils/AppError"));
const user_model_1 = require("../module/user/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const checkAuths = (...auths) => async (req, res, next) => {
    const token = req.headers?.authorization;
    if (!token) {
        throw new AppError_1.default(400, "User not authorized!");
    }
    ;
    const validationUser = jsonwebtoken_1.default.verify(token, env_1.envVers.ACCESS_SECRATE);
    if (!validationUser) {
        throw new AppError_1.default(401, "User not valid");
    }
    ;
    const existUser = await user_model_1.User.findById(validationUser?.userId);
    if (!existUser) {
        throw new AppError_1.default(404, "User not found!");
    }
    if (auths.length && !auths.includes(validationUser.role)) {
        throw new AppError_1.default(401, "You are not permited access this route!");
    }
    ;
    req.authUser = validationUser;
    next();
};
exports.checkAuths = checkAuths;
//# sourceMappingURL=protect.js.map