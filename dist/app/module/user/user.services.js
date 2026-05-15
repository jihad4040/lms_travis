"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const AppError_1 = __importDefault(require("../../utils/AppError"));
const generateJwt_1 = require("../../utils/generateJwt");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const signUp = async (data) => {
    if (!data.email || !data.password || !data.fullName) {
        throw new AppError_1.default(400, "fullName, email & password are required");
    }
    // allowed domains
    const allowedDomains = ["@gmail.com"];
    const isValidDomain = allowedDomains.some((domain) => data.email.toLowerCase().endsWith(domain));
    if (!isValidDomain) {
        throw new AppError_1.default(400, "Invalid email domain. Please use a valid email address.");
    }
    const existUser = await user_model_1.User.findOne({ email: data.email });
    if (existUser) {
        throw new AppError_1.default(400, `${data.email} already exists`);
    }
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    const newUser = await user_model_1.User.create({
        fullName: data.fullName,
        email: data.email,
        provider: "CREADIENTIAL",
        password: hashedPassword,
        phone: data.phone,
    });
    // remove password
    const { password, ...rest } = newUser.toObject();
    return rest;
};
const createEmployee = async (data) => {
    if (!data.email || !data.password || !data.fullName) {
        throw new AppError_1.default(400, "fullName, email & password are required");
    }
    const existUser = await user_model_1.User.findOne({ email: data.email });
    if (existUser) {
        throw new AppError_1.default(400, `${data.email} already exists`);
    }
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    const newUser = await user_model_1.User.create({
        fullName: data.fullName,
        email: data.email,
        password: hashedPassword,
        provider: "CREADIENTIAL",
        phone: data.phone,
        role: user_interface_1.IRole.EMPLOYEE,
    });
    // remove password
    const { password, ...rest } = newUser.toObject();
    return rest;
};
const signIn = async (data) => {
    const { email, password } = data;
    if (!email || !password) {
        throw new AppError_1.default(400, "Email and password must be required");
    }
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(400, "Invalid email");
    }
    if (user.provider === "MICROSOFT")
        throw new AppError_1.default(400, "Please login with microsoft. You are not creadiential user");
    const isPasswordMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(400, "Invalid password");
    }
    const tokens = await (0, generateJwt_1.generateJwt)(user);
    user.lastLogin = new Date();
    await user.save();
    const { password: pass, ...rest } = user.toObject();
    return {
        tokens: tokens,
        user: rest,
    };
};
const getAllUser = async (query) => {
    // base query
    const userQuery = user_model_1.User.find();
    // QueryBuilder use
    const queryBuilder = new QueryBuilder_1.QueryBuilder(userQuery, query)
        .filter() // filter
        .search(["phone", "email", "fullName"]) // searchable fields
        .sort() // sort
        .paginate(); // pagination
    // final data
    const result = await queryBuilder.build();
    // meta data (pagination info)
    const meta = await queryBuilder.getMeta();
    return {
        meta,
        data: result,
    };
};
const getAllEmployee = async (query) => {
    // base query
    const userQuery = user_model_1.User.find({ role: "EMPLOYEE" });
    // QueryBuilder use
    const queryBuilder = new QueryBuilder_1.QueryBuilder(userQuery, query)
        .filter() // filter
        .search(["phone", "email", "fullName"]) // searchable fields
        .sort() // sort
        .paginate(); // pagination
    // final data
    const result = await queryBuilder.build();
    // meta data (pagination info)
    const meta = await queryBuilder.getMeta();
    return {
        meta,
        data: result,
    };
};
exports.UserServices = {
    signUp,
    signIn,
    getAllUser,
    getAllEmployee,
    createEmployee,
};
//# sourceMappingURL=user.services.js.map