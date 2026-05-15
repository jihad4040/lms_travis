"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccessTokenUseRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("./AppError"));
const user_model_1 = require("../module/user/user.model");
const generateJwt_1 = require("./generateJwt");
const createAccessTokenUseRefreshToken = async (refreshToken) => {
    const verifyToken = jsonwebtoken_1.default.verify(refreshToken, env_1.envVers.REFRESH_SECRATE);
    if (!verifyToken)
        throw new AppError_1.default(400, "Invalid Refresh Token");
    const findUser = await user_model_1.User.findOne({ _id: verifyToken.userId, role: verifyToken.role });
    if (!findUser)
        throw new AppError_1.default(400, "Invalid refresh Token");
    const tokens = await (0, generateJwt_1.generateJwt)(findUser);
    return {
        accessToken: tokens.accessToken
    };
};
exports.createAccessTokenUseRefreshToken = createAccessTokenUseRefreshToken;
//# sourceMappingURL=createAccessTokenUseRefreshToken.js.map