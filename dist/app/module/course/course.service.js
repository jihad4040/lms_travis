"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseServices = void 0;
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const course_model_1 = require("./course.model");
const createCourse = async (payload) => {
    const requiredFields = [
        "title",
        "description",
        "thumbnail",
        "category",
        "prices",
        "courseTag",
        "whatsUserLearn",
        "instructorName",
        "instructorTitle",
        "instructorDescription",
        "instructorProfile",
    ];
    for (const field of requiredFields) {
        if (!payload[field]) {
            throw new AppError_1.default(400, `Field "${field}" is required`);
        }
    }
    const course = await course_model_1.Course.create(payload);
    return course;
};
const updateCourse = async (courseId, payload) => {
    const updatedCourse = await course_model_1.Course.findByIdAndUpdate(courseId, { $set: payload }, { new: true, runValidators: true });
    return updatedCourse;
};
const getCourseBasicInfoById = async (courseId) => {
    if (!mongoose_1.Types.ObjectId.isValid(courseId)) {
        throw new Error("Invalid course ID");
    }
    const course = await course_model_1.Course.findById(courseId);
    if (!course)
        return null;
    // total modules
    const totalModules = course.modules?.length || 0;
    // total lessons and total duration
    let totalLessons = 0;
    let totalDuration = 0;
    if (course.modules && course.modules.length > 0) {
        course.modules.forEach(module => {
            if (module.lessons && module.lessons.length > 0) {
                totalLessons += module.lessons.length;
                totalDuration += module.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
            }
        });
    }
    ;
    return {
        ...course.toObject(), // database থেকে আসা সব info 그대로
        totalModules,
        totalLessons,
        totalDuration
    };
};
exports.courseServices = {
    createCourse,
    updateCourse,
    getCourseBasicInfoById
};
//# sourceMappingURL=course.service.js.map