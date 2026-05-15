"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const user_services_1 = require("./user.services");
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("./user.model");
const createAccessTokenUseRefreshToken_1 = require("../../utils/createAccessTokenUseRefreshToken");
const recent_activity_model_1 = require("../RecentActivity/recent.activity.model");
const sendEmail_1 = require("../../config/sendEmail");
const SignUp = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await user_services_1.UserServices.signUp(req.body);
    await recent_activity_model_1.RecentActivity.create({
        title: "New User Registration",
        description: `${result?.fullName} joined the platform`
    });
    await (0, sendEmail_1.sendEmail)({
        to: result.email,
        subject: "Welcome to LMS",
        templateName: "welcome", // welcome.ejs
        templateData: {
            appName: "LMS",
            name: result.fullName,
            email: result.email,
            password: req.body.password,
            loginUrl: process.env.FRONTEND_URL || "https://learning.awcompaniesinc.com"
        }
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: `Well done, ${result.fullName}! Your registration was successful.`,
        data: result
    });
});
const SingIn = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await user_services_1.UserServices.signIn(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: `Wellcome back, ${result.user.fullName}! You have successfully signed in.`,
        data: result
    });
});
// const updateUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.params.id;
//     if (!userId) {
//         return next(new AppError(400, "User ID is required"));
//     }
//     const payload = req.body;
//     const updateData: Record<string, any> = {};
//     // Only valid value update
//     for (const key in payload) {
//         const value = payload[key];
//         if (value !== null && value !== undefined) {
//             if (typeof value === "string" && value.trim() === "") continue;
//             updateData[key] = value;
//         }
//     }
//     // Never update these
//     delete updateData.password;
//     delete updateData.lastLogin;
//     if (Object.keys(updateData).length === 0) {
//         return next(new AppError(400, "No valid fields to update"));
//     }
//     const updatedUser = await User.findByIdAndUpdate(
//         userId,
//         { $set: updateData },
//         { new: true, runValidators: true }
//     ).select("-password -lastLogin");
//     if (!updatedUser) {
//         return next(new AppError(404, "User not found"));
//     }
//     res.status(200).json({
//         status: "success",
//         data: updatedUser,
//     });
// }
// );
const updateUserProfile = (0, catchAsync_1.default)(async (req, res, next) => {
    const userId = req.params.id;
    if (!userId) {
        return next(new AppError_1.default(400, "User ID is required"));
    }
    const payload = req.body;
    const file = req.file; // 🔥 multer file
    const updateData = {};
    // ✅ body থেকে valid field নাও
    for (const key in payload) {
        const value = payload[key];
        if (value !== null && value !== undefined) {
            if (typeof value === "string" && value.trim() === "")
                continue;
            updateData[key] = value;
        }
    }
    // ✅ avatarUrl file থাকলে সেট করো
    if (file) {
        // যদি local upload
        updateData.avatarUrl = file.path;
        // যদি cloudinary / s3 হলে
        // updateData.avatarUrl = file.location;
    }
    // ❌ sensitive field remove
    delete updateData.password;
    delete updateData.lastLogin;
    delete updateData.totalPoints;
    if (Object.keys(updateData).length === 0) {
        return next(new AppError_1.default(400, "No valid fields to update"));
    }
    const updatedUser = await user_model_1.User.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true }).select("-password -lastLogin");
    if (!updatedUser) {
        return next(new AppError_1.default(404, "User not found"));
    }
    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
    });
});
const getAllUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const query = req.query;
    const result = await user_services_1.UserServices.getAllUser(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "All User Retrived Successfully",
        data: result.data,
        meta: result.meta
    });
});
const getAllEmployee = (0, catchAsync_1.default)(async (req, res, next) => {
    const query = req.query;
    const result = await user_services_1.UserServices.getAllEmployee(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "All User Retrived Successfully",
        data: result.data,
        meta: result.meta
    });
});
const getMe = (0, catchAsync_1.default)(async (req, res, next) => {
    const userId = req.authUser.userId;
    const result = await user_model_1.User.findById(userId);
    if (!result)
        throw new AppError_1.default(404, "User Not found");
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "User Profile retrived successfully",
        data: result
    });
});
const getAccessTokenUseRefreshToken = (0, catchAsync_1.default)(async (req, res, next) => {
    const refreshToken = req.body?.authorization;
    const result = await (0, createAccessTokenUseRefreshToken_1.createAccessTokenUseRefreshToken)(refreshToken);
    // sendResponse(res, {
    //     success: true,
    //     statusCode: 200,
    //     message: "Token refreshed successfully",
    //     data: result
    // })
    res.status(200).send({
        success: true,
        statusCode: 200,
        message: "Token refreshed successfully",
        accessToken: result.accessToken
    });
});
const deleteUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const userId = req.params.userId;
    const result = await user_model_1.User.findByIdAndDelete(userId);
    if (!result)
        throw new AppError_1.default(404, "User not found");
    await recent_activity_model_1.RecentActivity.create({
        title: "New User Registration",
        description: `Admin Deleted ${result?.fullName} Account`
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "User Deleted successfully",
        data: null
    });
});
const changePassword = (0, catchAsync_1.default)(async (req, res, next) => {
    const userId = req.authUser.userId; // auth middleware থেকে
    const { currentPassword, newPassword } = req.body;
    // 1️⃣ user খুঁজে বের করো
    const user = await user_model_1.User.findById(userId).select("+password");
    if (!user) {
        return next(new AppError_1.default(404, "User not found"));
    }
    // 2️⃣ current password match করো
    const isPasswordMatched = await bcrypt_1.default.compare(currentPassword, user.password);
    if (!isPasswordMatched) {
        return next(new AppError_1.default(403, "Current password is incorrect"));
    }
    // 3️⃣ নতুন password hash করো
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
    // 4️⃣ DB তে save করো
    user.password = hashedPassword;
    await user.save();
    // 5️⃣ response পাঠাও
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Password Changed Successfully",
        data: null,
    });
});
const createEmployee = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await user_services_1.UserServices.createEmployee(req.body);
    await (0, sendEmail_1.sendEmail)({
        to: result.email,
        subject: "Welcome to LMS",
        templateName: "welcome", // welcome.ejs
        templateData: {
            appName: "LMS",
            name: result.fullName,
            email: result.email,
            password: req.body.password,
            loginUrl: "https://travisjerovetz-frontend.vercel.app"
        }
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Employee Creation success",
        data: result
    });
});
exports.UserController = {
    SignUp,
    SingIn,
    updateUserProfile,
    getAccessTokenUseRefreshToken,
    getAllUser,
    getMe,
    deleteUser,
    changePassword,
    getAllEmployee,
    createEmployee
};
//# sourceMappingURL=user.controller.js.map