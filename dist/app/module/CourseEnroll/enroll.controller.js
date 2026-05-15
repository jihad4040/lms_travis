"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const enroll_services_1 = require("./enroll.services");
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const sendResponse_1 = require("../../utils/sendResponse");
const user_model_1 = require("../user/user.model");
const recent_activity_model_1 = require("../RecentActivity/recent.activity.model");
const enrollCourse = (0, catchAsync_1.default)(async (req, res, next) => {
    const { userId, courseId, courseName } = req.body;
    if (!userId || !courseId || !courseName) {
        throw new AppError_1.default(400, "UserId , CourseID & CourseName must be required");
    }
    const findUser = await user_model_1.User.findOne({ _id: new mongoose_1.Types.ObjectId(userId) });
    if (!findUser)
        throw new AppError_1.default(404, "User not found");
    const result = await enroll_services_1.enrollServices.enrollCourse({
        userId: new mongoose_1.Types.ObjectId(userId),
        courseId: new mongoose_1.Types.ObjectId(courseId),
        courseName: courseName
    });
    await recent_activity_model_1.RecentActivity.create({
        title: "Course Enrolment",
        description: `${findUser?.fullName} enrolled in ${courseName}`
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: `${courseName} enrollment successfully`,
        data: result
    });
});
exports.enrollController = {
    enrollCourse
};
//# sourceMappingURL=enroll.controller.js.map