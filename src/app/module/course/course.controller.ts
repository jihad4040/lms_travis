import { NextFunction, Request, Response, Router } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { courseServices } from "./course.service";
import AppError from "../../utils/AppError";
import { Course } from "./course.model";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { UserCourseProgress } from "../userCourseProgress/UserCourseProgress.model";
import { IUpCourse } from "./course.interface";
import { Types } from "mongoose";
import { RecentActivity } from "../RecentActivity/recent.activity.model";
import { processScormZip } from "../../utils/scormUnzip";


const createCourse = catchAsync(async (req, res, next: NextFunction) => {

    const bodyData = req.body.data ? JSON.parse(req.body.data) : {};

    const files = req.files as {
        thumbnail?: Express.Multer.File[];
        instructorProfile?: Express.Multer.File[];
    };

    const payload = {
        ...bodyData,
        thumbnail: files?.thumbnail?.[0]?.path || "",
        instructorProfile: files?.instructorProfile?.[0]?.path || "",
    };

    const result = await courseServices.createCourse(payload);


    await RecentActivity.create({
        title: "Lounched New Course",
        description: `${result.title} Lounched the platform`
    })

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Course created successfully",
        data: result,
    });
});

const getCourseWithProgress = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { courseId } = req.params;
    const userId = req.authUser?.userId;
    if (!userId || !courseId) {
        throw new AppError(400, "userId & courseId are required");
    }

    const course = await Course.findById(courseId);
    if (!course) throw new AppError(404, "Course not found");

    const progress = await UserCourseProgress.findOne({ userId, courseId });
    if (!progress) throw new AppError(404, "User progress not found");

    // Make completed lesson IDs string array
    progress.modules.forEach(m => {
        m.completedLessons = m.completedLessons.map(l => l.toString()) as any;
    });

    // ----------------------------
    // MODULE WISE PROGRESS
    // ----------------------------

    const modules = course.modules
        .filter((module) => module && module._id)
        .map((module) => {
            const moduleId = module._id!.toString();

            const userModule = progress.modules.find(
                (m) => m.moduleId.toString() === moduleId
            );

            const totalLessons = module.lessons?.length || 0;
            const completedLessons = userModule?.completedLessons.length || 0;
            const pendingLessons = totalLessons - completedLessons;

            const moduleProgress =
                totalLessons > 0
                    ? Math.round((completedLessons / totalLessons) * 100)
                    : 0;

            // MODULE DURATION
            const moduleDuration = module.lessons.reduce(
                (acc, lesson) => acc + (lesson.duration || 0),
                0
            );

            // LESSON COMPLETION FLAG
            const lessonsWithStatus = module.lessons.map((lesson) => {
                const lessonId = lesson._id?.toString() || "";

                const lessonObj =
                    typeof (lesson as any).toObject === "function"
                        ? (lesson as any).toObject()
                        : (lesson as any)._doc;

                // Convert completed lessons to string array
                const completedLessonIds = (userModule?.completedLessons || []).map(
                    (id) => id.toString()
                );

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

    const totalLessonsInCourse = modules.reduce(
        (acc, m) => acc + m.totalLessons,
        0
    );

    const completedLessonsInCourse = modules.reduce(
        (acc, m) => acc + m.completedLessons,
        0
    );

    const pendingLessonsInCourse = totalLessonsInCourse - completedLessonsInCourse;

    const courseProgress =
        totalLessonsInCourse > 0
            ? Math.round((completedLessonsInCourse / totalLessonsInCourse) * 100)
            : 0;

    // CALCULATE TOTAL COURSE DURATION
    const totalCourseDuration = modules.reduce(
        (acc, m) => acc + (m.duration || 0),
        0
    );

    sendResponse(res, {
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
    })
});

const getAllCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Start query with only Published courses
    const baseQuery = Course.find({});

    // 2. Create QueryBuilder instance
    const queryBuilder = new QueryBuilder(baseQuery, req.query as Record<string, string>);

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
    sendResponse(res, {
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



const updateCourseInformation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // ✅ SAFE access
    const rawData = req.body?.data;
    if (!rawData) {
        throw new AppError(
            400,
            "Form-data 'data' field is required (JSON string)"
        );
    }

    let parsedData: any;

    try {
        parsedData = JSON.parse(rawData);
    } catch {
        throw new AppError(400, "Invalid JSON format in data field");
    }

    const { courseId, ...rest } = parsedData;

    if (!courseId) {
        throw new AppError(400, "Course id must be required");
    }

    const payload: Partial<IUpCourse> = {};

    // ✅ ignore null / undefined / ""
    Object.entries(rest).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;

        if (key === "prices") {
            payload.prices = Number(value);
            return;
        }

        if (key === "whatsUserLearn") {
            if (Array.isArray(value)) {
                payload.whatsUserLearn = value as string[];
            } else if (typeof value === "string") {
                payload.whatsUserLearn = JSON.parse(value) as string[];
            }
            return;
        }

        if (key === "modules" && Array.isArray(value)) {
            // Processing ZIP files if they are in the modules payload
            (payload as any)[key] = value;
            return;
        }

        (payload as any)[key] = value;
    });

    // After populating payload, if modules are present, process them for ZIPs
    if (payload.modules && Array.isArray(payload.modules)) {
        for (const module of payload.modules) {
            if (module.lessons && Array.isArray(module.lessons)) {
                for (const lesson of module.lessons) {
                    const isZip = lesson.contentUrl?.toLowerCase().endsWith(".zip");
                    const hasNoUnzip = !lesson.unzeepFile || lesson.unzeepFile.length === 0;
                    if (isZip && hasNoUnzip) {
                        try {
                            lesson.unzeepFile = await processScormZip(lesson.contentUrl);
                        } catch (err) {
                            console.error(`Failed to process ZIP for lesson ${lesson.lessonName}:`, err);
                        }
                    }
                }
            }
        }
    }
    // ✅ optional images
    if (req.files) {
        const files = req.files as Record<string, Express.Multer.File[]>;

        if (files.thumbnail?.[0]) {
            payload.thumbnail = (files.thumbnail[0] as any).path;
        }

        if (files.instructorProfile?.[0]) {
            payload.instructorProfile = (files.instructorProfile[0] as any).path;
        }
    }

    if (Object.keys(payload).length === 0) {
        throw new AppError(400, "No valid fields provided to update");
    }

    const result = await courseServices.updateCourse(
        new Types.ObjectId(courseId),
        payload
    );

    if (!result) {
        throw new AppError(404, "Course not found");
    }

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Course updated successfully",
        data: result,
    });
}
);

const getSingleCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.courseId;

    const result = await courseServices.getCourseBasicInfoById(courseId as string);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Course Retrived successfully",
        data: result
    })


})


const deleteCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.courseId;

    const result = await Course.findByIdAndDelete(courseId);

    if (!result) throw new AppError(404, "Course Not Found");

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Course Deleted successfully",
        data: null
    })

});


const recomandationCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const categories = await Course.distinct("category");

        // 2. Prottek category theke latest 2 course fetch koro
        const coursesArray = await Promise.all(
            categories.map(async (category) => {
                const courses = await Course.find({ category })
                    .sort({ createdAt: -1 }) // Latest first
                    .limit(2); // Only latest 2
                return courses;
            })
        );

        // 3. Nested array ke flatten koro
        const allCourses = coursesArray.flat();

        return res.status(200).json({
            success: true,
            data: allCourses,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch latest courses by category"
        });
    }
};


export const courseController = {
    createCourse,
    getCourseWithProgress,
    getAllCourse,
    updateCourseInformation,
    getSingleCourse,
    deleteCourse,
    recomandationCourse
}