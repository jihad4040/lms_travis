"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const course_service_1 = require("./course.service");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const course_model_1 = require("./course.model");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const UserCourseProgress_model_1 = require("../userCourseProgress/UserCourseProgress.model");
const mongoose_1 = require("mongoose");
const recent_activity_model_1 = require("../RecentActivity/recent.activity.model");
const createCourse = (0, catchAsync_1.default)(async (req, res, next) => {
    const bodyData = req.body.data ? JSON.parse(req.body.data) : {};
    const files = req.files;
    const payload = {
        ...bodyData,
        thumbnail: files?.thumbnail?.[0]?.path || "",
        instructorProfile: files?.instructorProfile?.[0]?.path || "",
    };
    const result = await course_service_1.courseServices.createCourse(payload);
    await recent_activity_model_1.RecentActivity.create({
        title: "Lounched New Course",
        description: `${result.title} Lounched the platform`
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Course created successfully",
        data: result,
    });
});
const getCourseWithProgress = (0, catchAsync_1.default)(async (req, res, next) => {
    const { courseId } = req.params;
    const userId = req.authUser?.userId;
    if (!userId || !courseId) {
        throw new AppError_1.default(400, "userId & courseId are required");
    }
    const course = await course_model_1.Course.findById(courseId);
    if (!course)
        throw new AppError_1.default(404, "Course not found");
    const progress = await UserCourseProgress_model_1.UserCourseProgress.findOne({ userId, courseId });
    if (!progress)
        throw new AppError_1.default(404, "User progress not found");
    // Make completed lesson IDs string array
    progress.modules.forEach(m => {
        m.completedLessons = m.completedLessons.map(l => l.toString());
    });
    // ----------------------------
    // MODULE WISE PROGRESS
    // ----------------------------
    const modules = course.modules
        .filter((module) => module && module._id)
        .map((module) => {
        const moduleId = module._id.toString();
        const userModule = progress.modules.find((m) => m.moduleId.toString() === moduleId);
        const totalLessons = module.lessons?.length || 0;
        const completedLessons = userModule?.completedLessons.length || 0;
        const pendingLessons = totalLessons - completedLessons;
        const moduleProgress = totalLessons > 0
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0;
        // MODULE DURATION
        const moduleDuration = module.lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0);
        // LESSON COMPLETION FLAG
        const lessonsWithStatus = module.lessons.map((lesson) => {
            const lessonId = lesson._id?.toString() || "";
            const lessonObj = typeof lesson.toObject === "function"
                ? lesson.toObject()
                : lesson._doc;
            // Convert completed lessons to string array
            const completedLessonIds = (userModule?.completedLessons || []).map((id) => id.toString());
            return {
                ...lessonObj,
                completedLesson: completedLessonIds.includes(lessonId),
            };
        });
        return {
            moduleId: module._id,
            moduleName: module.moduleName,
            totalLessons,
            completedLessons,
            pendingLessons,
            progress: moduleProgress,
            duration: moduleDuration, // <-- add module duration
            lessons: lessonsWithStatus,
        };
    });
    // ----------------------------
    // COURSE SUMMARY PROGRESS
    // ----------------------------
    const totalLessonsInCourse = modules.reduce((acc, m) => acc + m.totalLessons, 0);
    const completedLessonsInCourse = modules.reduce((acc, m) => acc + m.completedLessons, 0);
    const pendingLessonsInCourse = totalLessonsInCourse - completedLessonsInCourse;
    const courseProgress = totalLessonsInCourse > 0
        ? Math.round((completedLessonsInCourse / totalLessonsInCourse) * 100)
        : 0;
    // CALCULATE TOTAL COURSE DURATION
    const totalCourseDuration = modules.reduce((acc, m) => acc + (m.duration || 0), 0);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Course finded success",
        data: {
            courseInfo: {
                ...course.toObject(),
                modules,
                totalDuration: totalCourseDuration // <-- add total course duration
            },
            courseSummary: {
                totalLessons: totalLessonsInCourse,
                completedLessons: completedLessonsInCourse,
                pendingLessons: pendingLessonsInCourse,
                progress: courseProgress,
                totalDuration: totalCourseDuration // <-- add total duration summary
            },
        }
    });
});
const getAllCourse = (0, catchAsync_1.default)(async (req, res, next) => {
    // 1. Start query with only Published courses
    const baseQuery = course_model_1.Course.find({});
    // 2. Create QueryBuilder instance
    const queryBuilder = new QueryBuilder_1.QueryBuilder(baseQuery, req.query);
    // 3. Apply filter, search, sort, select, paginate
    const coursesQuery = queryBuilder
        .filter()
        .search(["title", "description", "category"])
        .sort()
        .select()
        .paginate();
    // 4. Execute query
    const courses = await coursesQuery.build();
    // 5. Get pagination/meta info based on filtered & searched query
    const meta = await queryBuilder.getMeta();
    // 6. Send response
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Courses fetched successfully",
        data: courses,
        meta,
    });
});
// const getAllCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const { searchTerm, page, limit, category } = req.query as {
//       searchTerm?: string;
//       page?: string;
//       limit?: string;
//       category?: string;
//     };
//     // Default pagination values
//     const pageNum = parseInt(page || "1");
//     const limitNum = parseInt(limit || "10");
//     // Base query
//     let query: any = {};
//     // Search by title or description
//     if (searchTerm) {
//       query.$or = [
//         { title: { $regex: searchTerm, $options: "i" } },
//         { description: { $regex: searchTerm, $options: "i" } },
//       ];
//     }
//     // Filter by category (if not 'all')
//     if (category && category.toLowerCase() !== "all") {
//       query.category = category;
//     }
//     // Only published courses
//     query.courseStatus = "Published";
//     // Count total results
//     const total = await Course.countDocuments(query);
//     // Pagination & sorting (latest first by default)
//     const courses = await Course.find(query)
//       .sort("-createdAt") // latest created first
//       .skip((pageNum - 1) * limitNum)
//       .limit(limitNum);
//     res.status(200).json({
//       success: true,
//       page: pageNum,
//       limit: limitNum,
//       total,
//       totalPages: Math.ceil(total / limitNum),
//       data: courses,
//     });
//   }
// );
const updateCourseInformation = (0, catchAsync_1.default)(async (req, res, next) => {
    // ✅ SAFE access
    const rawData = req.body?.data;
    if (!rawData) {
        throw new AppError_1.default(400, "Form-data 'data' field is required (JSON string)");
    }
    let parsedData;
    try {
        parsedData = JSON.parse(rawData);
    }
    catch {
        throw new AppError_1.default(400, "Invalid JSON format in data field");
    }
    const { courseId, ...rest } = parsedData;
    if (!courseId) {
        throw new AppError_1.default(400, "Course id must be required");
    }
    const payload = {};
    // ✅ ignore null / undefined / ""
    Object.entries(rest).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "")
            return;
        if (key === "prices") {
            payload.prices = Number(value);
            return;
        }
        if (key === "whatsUserLearn") {
            if (Array.isArray(value)) {
                payload.whatsUserLearn = value;
            }
            else if (typeof value === "string") {
                payload.whatsUserLearn = JSON.parse(value);
            }
            return;
        }
        payload[key] = value;
    });
    // ✅ optional images
    if (req.files) {
        const files = req.files;
        if (files.thumbnail?.[0]) {
            payload.thumbnail = files.thumbnail[0].path;
        }
        if (files.instructorProfile?.[0]) {
            payload.instructorProfile = files.instructorProfile[0].path;
        }
    }
    if (Object.keys(payload).length === 0) {
        throw new AppError_1.default(400, "No valid fields provided to update");
    }
    const result = await course_service_1.courseServices.updateCourse(new mongoose_1.Types.ObjectId(courseId), payload);
    if (!result) {
        throw new AppError_1.default(404, "Course not found");
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Course updated successfully",
        data: result,
    });
});
const getSingleCourse = (0, catchAsync_1.default)(async (req, res, next) => {
    const courseId = req.params.courseId;
    const result = await course_service_1.courseServices.getCourseBasicInfoById(courseId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Course Retrived successfully",
        data: result
    });
});
const deleteCourse = (0, catchAsync_1.default)(async (req, res, next) => {
    const courseId = req.params.courseId;
    const result = await course_model_1.Course.findByIdAndDelete(courseId);
    if (!result)
        throw new AppError_1.default(404, "Course Not Found");
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Course Deleted successfully",
        data: null
    });
});
const recomandationCourse = async (req, res, next) => {
    try {
        const categories = await course_model_1.Course.distinct("category");
        // 2. Prottek category theke latest 2 course fetch koro
        const coursesArray = await Promise.all(categories.map(async (category) => {
            const courses = await course_model_1.Course.find({ category })
                .sort({ createdAt: -1 }) // Latest first
                .limit(2); // Only latest 2
            return courses;
        }));
        // 3. Nested array ke flatten koro
        const allCourses = coursesArray.flat();
        return res.status(200).json({
            success: true,
            data: allCourses,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch latest courses by category"
        });
    }
};
exports.courseController = {
    createCourse,
    getCourseWithProgress,
    getAllCourse,
    updateCourseInformation,
    getSingleCourse,
    deleteCourse,
    recomandationCourse
};
//# sourceMappingURL=course.controller.js.map