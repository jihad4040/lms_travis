"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const analytics_services_1 = require("./analytics.services");
const sendResponse_1 = require("../../utils/sendResponse");
const mongoose_1 = require("mongoose");
const complited_course_model_1 = require("../ComplitedCourse/complited.course.model");
const adminAnalytics = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await analytics_services_1.analyticsServices.adminAnalytics();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Admin Dashboard analyticl data retrived successfully",
        data: result
    });
});
const userAnalyticsData = (0, catchAsync_1.default)(async (req, res, next) => {
    const userId = req.authUser?.userId;
    // const userId = req.params?.userId
    const result = await analytics_services_1.analyticsServices.userAnalyticsData(new mongoose_1.Types.ObjectId(userId));
    if (result.completedCount >= 1) {
        const isExist = await complited_course_model_1.ComplitedCourse.findOne({ userId: userId, badgesId: "69428349a94e80064d0e3232" });
        if (!isExist) {
            await complited_course_model_1.ComplitedCourse.create({
                userId: userId,
                badgesId: "69428349a94e80064d0e3232"
            });
        }
    }
    ;
    if (result.completedCount >= 3) {
        const isExist = await complited_course_model_1.ComplitedCourse.findOne({ userId: userId, badgesId: "69428349a94e80064d0e3235" });
        if (!isExist) {
            await complited_course_model_1.ComplitedCourse.create({
                userId: userId,
                badgesId: "69428349a94e80064d0e3235"
            });
        }
    }
    ;
    const task1 = ["* A.W. Companies Confidentiality", "AI Acceptable Use Policy", "Annual Information, Security and Technology", "HIPAA", "Harassment Training"];
    if (result.completedCourses.length) {
        const isTaskComplite = task1.every((task) => result.completedCourses.some((course) => course.title === task));
        if (isTaskComplite) {
            const isExist = complited_course_model_1.ComplitedCourse.findOne({ userId: userId, badgesId: "69428349a94e80064d0e322d" });
            if (!isExist) {
                await complited_course_model_1.ComplitedCourse.create({
                    userId: userId,
                    badgesId: "69428349a94e80064d0e322d"
                });
            }
        }
    }
    ;
    const task2 = ["Coaching Strategies 101", "Coaching Strategies 102"];
    if (result.completedCourses.length) {
        const isTaskComplite = task2.every((task) => result.completedCourses.some((course) => course.title === task));
        if (isTaskComplite) {
            const isExist = complited_course_model_1.ComplitedCourse.findOne({ userId: userId, badgesId: "69428349a94e80064d0e322e" });
            if (!isExist) {
                await complited_course_model_1.ComplitedCourse.create({
                    userId: userId,
                    badgesId: "69428349a94e80064d0e322e"
                });
            }
        }
    }
    ;
    const task3 = ["Emotional Intelligence"];
    if (result.completedCourses.length) {
        const isTaskComplite = task3.every((task) => result.completedCourses.some((course) => course.title === task));
        if (isTaskComplite) {
            const isExist = complited_course_model_1.ComplitedCourse.findOne({ userId: userId, badgesId: "69428349a94e80064d0e322f" });
            if (!isExist) {
                await complited_course_model_1.ComplitedCourse.create({
                    userId: userId,
                    badgesId: "69428349a94e80064d0e322f"
                });
            }
        }
    }
    ;
    const task4 = ["Conflict Management"];
    if (result.completedCourses.length) {
        const isTaskComplite = task4.every((task) => result.completedCourses.some((course) => course.title === task));
        if (isTaskComplite) {
            const isExist = complited_course_model_1.ComplitedCourse.findOne({ userId: userId, badgesId: "69428349a94e80064d0e3231" });
            if (!isExist) {
                await complited_course_model_1.ComplitedCourse.create({
                    userId: userId,
                    badgesId: "69428349a94e80064d0e3231"
                });
            }
        }
    }
    ;
    const task5 = ["Store Certification"];
    if (result.completedCourses.length) {
        const isTaskComplite = task5.every((task) => result.completedCourses.some((course) => course.title === task));
        if (isTaskComplite) {
            const isExist = complited_course_model_1.ComplitedCourse.findOne({ userId: userId, badgesId: "69428349a94e80064d0e3236" });
            if (!isExist) {
                await complited_course_model_1.ComplitedCourse.create({
                    userId: userId,
                    badgesId: "69428349a94e80064d0e3236"
                });
            }
        }
    }
    ;
    const task6 = ["Online Shopping Certification"];
    if (result.completedCourses.length) {
        const isTaskComplite = task6.every((task) => result.completedCourses.some((course) => course.title === task));
        if (isTaskComplite) {
            const isExist = complited_course_model_1.ComplitedCourse.findOne({ userId: userId, badgesId: "69428349a94e80064d0e3238" });
            if (!isExist) {
                await complited_course_model_1.ComplitedCourse.create({
                    userId: userId,
                    badgesId: "69428349a94e80064d0e3238"
                });
            }
        }
    }
    ;
    const task7 = [
        "Store Certification",
        "mPerks Certification",
        "Online Shopping Certification"
    ];
    if (result.completedCourses.length) {
        const isTaskComplite = task7.every((task) => result.completedCourses.some((course) => course.title === task));
        if (isTaskComplite) {
            const isExist = complited_course_model_1.ComplitedCourse.findOne({ userId: userId, badgesId: "69428349a94e80064d0e3239" });
            if (!isExist) {
                await complited_course_model_1.ComplitedCourse.create({
                    userId: userId,
                    badgesId: "69428349a94e80064d0e3239"
                });
            }
        }
    }
    ;
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "User analytics data retrived successfully",
        data: result
    });
});
exports.analyticsController = {
    adminAnalytics,
    userAnalyticsData
};
//# sourceMappingURL=analytics.controller.js.map