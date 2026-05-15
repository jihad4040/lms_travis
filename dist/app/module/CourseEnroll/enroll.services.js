"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollServices = void 0;
const enroll_model_1 = require("./enroll.model");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const user_model_1 = require("../user/user.model");
const UserCourseProgress_services_1 = require("../userCourseProgress/UserCourseProgress.services");
const enrollCourse = async (data) => {
    const findUser = await user_model_1.User.findById(data.userId);
    if (!findUser)
        throw new AppError_1.default(400, "User not found");
    const checkCourse = findUser?.enrollCourse?.some((course) => course?.courseId.toString() === data.courseId.toString());
    if (checkCourse)
        throw new AppError_1.default(400, "Already this course enroll");
    const enroll = await enroll_model_1.Enroll.create({
        userId: data.userId,
        courseId: data.courseId,
        courseName: data.courseName
    });
    if (!enroll)
        throw new AppError_1.default(400, "Enroll faild");
    findUser?.enrollCourse?.push({
        courseId: data.courseId
    });
    findUser.save();
    await UserCourseProgress_services_1.UserCourseProgressServices.createProgressForUser(String(data.userId), String(data.courseId));
    return enroll;
};
exports.enrollServices = {
    enrollCourse
};
//# sourceMappingURL=enroll.services.js.map