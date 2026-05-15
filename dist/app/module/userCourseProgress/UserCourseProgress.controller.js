"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userCourseProgresssController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const UserCourseProgress_services_1 = require("./UserCourseProgress.services");
const sendResponse_1 = require("../../utils/sendResponse");
const createProgress = (0, catchAsync_1.default)(async (req, res, next) => {
    const { courseId, userId } = req.body;
    // const userId = req.authUser._id;
    const data = await UserCourseProgress_services_1.UserCourseProgressServices.createProgressForUser(userId, courseId);
    res.json({
        success: true,
        message: "Progress initialized",
        data
    });
});
const getProgressSingleCourse = (0, catchAsync_1.default)(async (req, res, next) => {
    const { courseId, userId } = req.params;
    // const userId = req.authUser._id;
    const data = await UserCourseProgress_services_1.UserCourseProgressServices.getProgressSingleCourse(userId, courseId);
    res.json({
        success: true,
        message: "Lesson completed",
        data
    });
});
const compliteLession = (0, catchAsync_1.default)(async (req, res, next) => {
    // const userId = req.authUser._id;
    const { courseId, lessonId, userId } = req.params;
    const result = await UserCourseProgress_services_1.UserCourseProgressServices.completeLesson(userId, courseId, lessonId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Lession Complited",
        data: result
    });
});
exports.userCourseProgresssController = {
    createProgress,
    getProgressSingleCourse,
    compliteLession
};
//# sourceMappingURL=UserCourseProgress.controller.js.map