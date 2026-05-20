"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessionController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const sendResponse_1 = require("../../utils/sendResponse");
const course_model_1 = require("../course/course.model");
const courseLesson_interface_1 = require("./courseLesson.interface");
const mongoose_1 = require("mongoose");
const scormUnzip_1 = require("../../utils/scormUnzip");
const createLesson = (0, catchAsync_1.default)(async (req, res) => {
    const files = req.files;
    if (!req.body.data) {
        throw new AppError_1.default(400, "Missing form data.");
    }
    const parsedData = JSON.parse(req.body.data);
    const { courseId, moduleId, lessonName, article, duration } = parsedData;
    if (!courseId || !moduleId || !lessonName) {
        throw new AppError_1.default(400, "courseId, moduleId, lessonName are required");
    }
    // ✅ Enum mapping ব্যবহার করো
    const contentTypeMap = {
        video: courseLesson_interface_1.ILissonContentType.Video,
        image: courseLesson_interface_1.ILissonContentType.Image,
        audio: courseLesson_interface_1.ILissonContentType.Audio,
        pdf: courseLesson_interface_1.ILissonContentType.PDF,
        scorm: courseLesson_interface_1.ILissonContentType.SCORM,
    };
    let detectedType = null;
    let contentUrl = "";
    for (const field in contentTypeMap) {
        if (files?.[field]?.[0]?.path) {
            detectedType = field;
            contentUrl = files[field][0].path;
            break;
        }
    }
    if (!detectedType) {
        throw new AppError_1.default(400, "No valid content file uploaded.");
    }
    let unzeepFile = [];
    const file = files?.[detectedType]?.[0];
    const isZip = file?.originalname.toLowerCase().endsWith(".zip") || detectedType === "scorm";
    if (isZip) {
        unzeepFile = await (0, scormUnzip_1.processScormZip)(contentUrl);
    }
    const newLesson = {
        lessonName,
        contentUrl,
        unzeepFile,
        article,
        duration,
        isCompleted: false,
    };
    const course = await course_model_1.Course.findById(courseId);
    if (!course) {
        throw new AppError_1.default(404, "Course not found");
    }
    // ✅ Safe find module (find ব্যবহার করো)
    const module = course.modules.find((m) => m._id?.toString() === moduleId);
    if (!module) {
        throw new AppError_1.default(404, "Module not found");
    }
    // ✅ Lesson push করো
    module.lessons.push(newLesson);
    await course.save();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Lesson created and added to module successfully.",
        data: course,
    });
});
const updateLessonContent = (0, catchAsync_1.default)(async (req, res) => {
    const { lessonName, article, duration, courseId, moduleId, lessonId } = req.body;
    if (!courseId || !moduleId || !lessonId) {
        throw new AppError_1.default(400, "courseId, moduleId and lessonId are required");
    }
    if (!mongoose_1.Types.ObjectId.isValid(courseId) ||
        !mongoose_1.Types.ObjectId.isValid(moduleId) ||
        !mongoose_1.Types.ObjectId.isValid(lessonId)) {
        throw new AppError_1.default(400, "Invalid courseId, moduleId or lessonId");
    }
    const course = await course_model_1.Course.findById(courseId);
    if (!course) {
        throw new AppError_1.default(404, "Course not found");
    }
    const module = course.modules.find((m) => m._id && m._id.toString() === moduleId);
    if (!module) {
        throw new AppError_1.default(404, "Module not found");
    }
    const lesson = module.lessons.find((l) => l._id && l._id.toString() === lessonId);
    if (!lesson) {
        throw new AppError_1.default(404, "Lesson not found");
    }
    if (lessonName !== undefined && lessonName !== "") {
        lesson.lessonName = lessonName;
    }
    if (article !== undefined && article !== "") {
        lesson.article = article;
    }
    if (duration !== undefined && duration !== null) {
        lesson.duration = duration;
    }
    await course.save();
    res.status(200).json({
        success: true,
        message: "Lesson updated successfully",
        data: lesson,
    });
});
const deleteLesson = (0, catchAsync_1.default)(async (req, res) => {
    const { courseId, moduleId, lessonId } = req.body;
    if (!courseId || !moduleId || !lessonId) {
        throw new AppError_1.default(400, "courseId, moduleId and lessonId are required");
    }
    if (!mongoose_1.Types.ObjectId.isValid(courseId) ||
        !mongoose_1.Types.ObjectId.isValid(moduleId) ||
        !mongoose_1.Types.ObjectId.isValid(lessonId)) {
        throw new AppError_1.default(400, "Invalid courseId, moduleId or lessonId");
    }
    const course = await course_model_1.Course.findById(courseId);
    if (!course) {
        throw new AppError_1.default(404, "Course not found");
    }
    const module = course.modules.find((m) => m._id && m._id.toString() === moduleId);
    if (!module) {
        throw new AppError_1.default(404, "Module not found");
    }
    const lessonIndex = module.lessons.findIndex((l) => l._id && l._id.toString() === lessonId);
    if (lessonIndex === -1) {
        throw new AppError_1.default(404, "Lesson not found");
    }
    module.lessons.splice(lessonIndex, 1);
    await course.save();
    res.status(200).json({
        success: true,
        message: "Lesson deleted successfully",
    });
});
const updateLessonContentVideo = async (req, res) => {
    try {
        const { courseId, moduleId, lessonId } = req.params;
        if (!req.files) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }
        const files = req.files;
        const file = files.video?.[0] ||
            files.audio?.[0] ||
            files.pdf?.[0] ||
            files.scorm?.[0] ||
            files.image?.[0];
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Unsupported file type",
            });
        }
        // ✅ multer-storage-cloudinary auto upload করেছে
        const contentUrl = file.path; // 👈 Cloudinary URL
        let unzeepFile = [];
        const fileExtension = file.originalname.split(".").pop()?.toLowerCase();
        if (fileExtension === "zip") {
            unzeepFile = await (0, scormUnzip_1.processScormZip)(contentUrl);
        }
        const updateQuery = {
            $set: {
                "modules.$[m].lessons.$[l].contentUrl": contentUrl,
            },
        };
        if (unzeepFile.length > 0) {
            updateQuery.$set["modules.$[m].lessons.$[l].unzeepFile"] = unzeepFile;
        }
        const updatedCourse = await course_model_1.Course.findOneAndUpdate({
            _id: courseId,
            "modules._id": moduleId,
            "modules.lessons._id": lessonId,
        }, updateQuery, {
            arrayFilters: [{ "m._id": moduleId }, { "l._id": lessonId }],
            new: true,
        });
        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Lesson content updated successfully",
            contentUrl,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.LessionController = {
    createLesson,
    updateLessonContent,
    deleteLesson,
    updateLessonContentVideo,
};
//# sourceMappingURL=courseLesson.controller.js.map