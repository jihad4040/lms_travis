"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCourseProgressServices = void 0;
const AppError_1 = __importDefault(require("../../utils/AppError"));
const course_model_1 = require("../course/course.model");
const UserCourseProgress_model_1 = require("./UserCourseProgress.model");
const createProgressForUser = async (userId, courseId) => {
    const course = await course_model_1.Course.findById(courseId);
    if (!course)
        throw new AppError_1.default(404, "Course not found");
    const existing = await UserCourseProgress_model_1.UserCourseProgress.findOne({ userId, courseId });
    if (existing)
        return existing;
    const newProgress = await UserCourseProgress_model_1.UserCourseProgress.create({
        userId,
        courseId,
        courseProgress: 0,
        modules: course.modules.map((m) => ({
            moduleId: m._id,
            progress: 0,
            completedLessons: []
        }))
    });
    return newProgress;
};
const getProgressSingleCourse = async (userId, courseId) => {
    const course = await course_model_1.Course.findById(courseId);
    if (!course)
        throw new Error("Course not found");
    const progress = await UserCourseProgress_model_1.UserCourseProgress.findOne({ userId, courseId });
    if (!progress)
        throw new Error("Progress not found");
    const modulesProgress = course.modules
        .filter((module) => module._id)
        .map((module) => {
        const userModule = progress.modules.find((m) => m.moduleId.toString() === module._id.toString());
        const totalLessons = module.lessons?.length || 0;
        const completedLessons = userModule?.completedLessons.length || 0;
        const pendingLessons = totalLessons - completedLessons;
        const moduleProgress = totalLessons > 0
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0;
        return {
            moduleId: module._id,
            moduleName: module.moduleName,
            totalLessons,
            completedLessons,
            pendingLessons,
            progress: moduleProgress,
        };
    });
    const totalLessonsInCourse = course.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
    const completedLessonsInCourse = progress.modules.reduce((acc, m) => acc + (m.completedLessons?.length || 0), 0);
    const pendingLessonsInCourse = totalLessonsInCourse - completedLessonsInCourse;
    const courseProgress = totalLessonsInCourse > 0
        ? Math.round((completedLessonsInCourse / totalLessonsInCourse) * 100)
        : 0;
    return {
        modulesProgress,
        courseSummary: {
            totalLessons: totalLessonsInCourse,
            completedLessons: completedLessonsInCourse,
            pendingLessons: pendingLessonsInCourse,
            progress: courseProgress,
        },
    };
};
const completeLesson = async (userId, courseId, lessonId) => {
    const course = await course_model_1.Course.findById(courseId);
    if (!course)
        throw new Error("Course not found");
    const progress = await UserCourseProgress_model_1.UserCourseProgress.findOne({ userId, courseId });
    if (!progress)
        throw new Error("Progress not found");
    // Find module that contains the lesson
    const moduleData = course.modules.find((m) => m.lessons?.some((l) => l._id?.toString() === lessonId));
    if (!moduleData || !moduleData._id)
        throw new Error("Module not found");
    const userModule = progress.modules.find((m) => m.moduleId.toString() === moduleData._id.toString());
    if (!userModule)
        throw new Error("User module progress not found");
    // Add lesson if not already completed
    if (!userModule.completedLessons.some((id) => id.toString() === lessonId)) {
        userModule.completedLessons.push(lessonId);
    }
    // Module progress calculation
    const totalLessons = moduleData.lessons?.length || 0;
    const doneLessons = userModule.completedLessons.length;
    userModule.progress =
        totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;
    // Total course lessons
    const totalLessonsInCourse = course.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
    const completedLessonsInCourse = progress.modules.reduce((acc, m) => acc + (m.completedLessons?.length || 0), 0);
    progress.courseProgress =
        totalLessonsInCourse > 0
            ? Math.round((completedLessonsInCourse / totalLessonsInCourse) * 100)
            : 0;
    await progress.save();
    return progress;
};
exports.UserCourseProgressServices = {
    createProgressForUser,
    getProgressSingleCourse,
    completeLesson
};
//# sourceMappingURL=UserCourseProgress.services.js.map