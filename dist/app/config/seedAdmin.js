"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = void 0;
const user_interface_1 = require("../module/user/user.interface");
const user_model_1 = require("../module/user/user.model");
const env_1 = require("./env");
const bcrypt_1 = __importDefault(require("bcrypt"));
const seedAdmin = async () => {
    const findAdmin = await user_model_1.User.findOne({ email: env_1.envVers.ADMIN.ADMIN_EMAIL });
    const hashPassword = await bcrypt_1.default.hash(env_1.envVers.ADMIN.ADMIN_PASSWORD, 10);
    if (!findAdmin) {
        await user_model_1.User.create({
            fullName: "Admin Hasan",
            email: env_1.envVers.ADMIN.ADMIN_EMAIL,
            password: hashPassword,
            role: user_interface_1.IRole.ADMIN
        });
        console.log("Admin created successfully");
    }
    ;
    console.log("Admin already exist");
};
exports.seedAdmin = seedAdmin;
//# sourceMappingURL=seedAdmin.js.map