"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsServices = void 0;
const course_model_1 = require("../course/course.model");
const enroll_model_1 = require("../CourseEnroll/enroll.model");
const user_model_1 = require("../user/user.model");
const UserCourseProgress_model_1 = require("../userCourseProgress/UserCourseProgress.model");
function getISOWeek(date) {
    const tempDate = new Date(date);
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
    const week1 = new Date(tempDate.getFullYear(), 0, 4);
    return (1 +
        Math.round(((tempDate.getTime() - week1.getTime()) / 86400000 -
            3 +
            ((week1.getDay() + 6) % 7)) /
            7));
}
function getISOWeekYear(date) {
    const d = new Date(date);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    return d.getFullYear();
}
const adminAnalytics = async () => {
    const totalUser = await user_model_1.User.countDocuments();
    const totalActiveCourse = await course_model_1.Course.find({ courseStatus: "Published" }).countDocuments();
    const totalCourse = await course_model_1.Course.countDocuments();
    const activeLerner = await user_model_1.User.find({ isActive: true }).countDocuments();
    const last8WeeksDate = new Date();
    last8WeeksDate.setDate(last8WeeksDate.getDate() - 56);
    const weeklyUsers = await user_model_1.User.aggregate([
        { $match: { createdAt: { $gte: last8WeeksDate } } },
        {
            $group: {
                _id: {
                    year: { $isoWeekYear: "$createdAt" },
                    week: { $isoWeek: "$createdAt" }
                },
                users: { $sum: 1 }
            }
        }
    ]);
    const weeklyEnrollments = await enroll_model_1.Enroll.aggregate([
        { $match: { createdAt: { $gte: last8WeeksDate } } },
        {
            $group: {
                _id: {
                    year: { $isoWeekYear: "$createdAt" },
                    week: { $isoWeek: "$createdAt" }
                },
                enrollments: { $sum: 1 }
            }
        }
    ]);
    // 🟢 last 8 weeks formatted data
    const weeklyAnalytics = [];
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i * 7);
        const year = getISOWeekYear(d);
        const week = getISOWeek(d);
        const userData = weeklyUsers.find(w => w._id.year === year && w._id.week === week);
        const enrollmentData = weeklyEnrollments.find(e => e._id.year === year && e._id.week === week);
        weeklyAnalytics.push({
            weekLabel: `Week ${8 - i}`,
            users: userData ? userData.users : 0,
            enrollments: enrollmentData ? enrollmentData.enrollments : 0
        });
    }
    const result = await course_model_1.Course.aggregate([
        {
            $group: {
                _id: "$category",
                totalCourses: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: null,
                categories: {
                    $push: {
                        category: "$_id",
                        count: "$totalCourses"
                    }
                },
                grandTotal: { $sum: "$totalCourses" }
            }
        },
        {
            $project: {
                _id: 0,
                categories: {
                    $map: {
                        input: "$categories",
                        as: "cat",
                        in: {
                            category: "$$cat.category",
                            count: "$$cat.count",
                            percentage: {
                                $round: [
                                    {
                                        $multiply: [
                                            { $divide: ["$$cat.count", "$grandTotal"] },
                                            100
                                        ]
                                    },
                                    2
                                ]
                            }
                        }
                    }
                }
            }
        }
    ]);
    const courseCategoryData = result[0]?.categories || [];
    const topSellingCourses = await enroll_model_1.Enroll.aggregate([
        {
            $group: {
                _id: "$courseId",
                courseName: { $first: "$courseName" },
                totalEnrollCount: { $sum: 1 },
                totalSales: {
                    $sum: {
                        $cond: [
                            { $eq: ["$paymentStatus", "PAID"] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $sort: { totalEnrollCount: -1 }
        },
        {
            $limit: 5
        },
        {
            $project: {
                _id: 0,
                courseId: "$_id",
                courseName: 1,
                totalEnrollCount: 1,
                totalSales: 1
            }
        }
    ]);
    const results = await enroll_model_1.Enroll.aggregate([
        {
            $match: {
                paymentStatus: { $in: ["PAID", "FREE"] }
            }
        },
        {
            $group: {
                _id: null,
                totalEnrollCount: { $sum: 1 },
                totalSell: {
                    $sum: {
                        $cond: [{ $eq: ["$paymentStatus", "PAID"] }, "$amount", 0]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                totalEnrollCount: 1,
                totalSell: 1
            }
        }
    ]);
    const revenue = results[0] || { totalEnrollCount: 0, totalSell: 0 };
    return {
        totalUser,
        totalActiveCourse,
        totalCourse,
        activeLerner,
        revenue,
        weeklyAnalytics,
        courseCategoryData,
        topSellingCourses,
    };
};
const userAnalyticsData = async (userId) => {
    // 1️⃣ Find the user
    const findUser = await user_model_1.User.findById(userId);
    if (!findUser)
        throw new Error("User not found");
    // 2️⃣ Get enrolled course IDs
    const userCourseIds = findUser.enrollCourse?.map((c) => c.courseId?.toString()) || [];
    if (userCourseIds.length === 0)
        return {
            completedCourses: [],
            inProgressCourses: [],
            completedCount: 0,
            inProgressCount: 0,
            totalPurchasedCourses: 0,
        };
    // 3️⃣ Fetch all enrolled courses
    const courses = await course_model_1.Course.find({ _id: { $in: userCourseIds } });
    // 4️⃣ Fetch user progress for all courses
    const progressList = await UserCourseProgress_model_1.UserCourseProgress.find({
        userId,
        courseId: { $in: userCourseIds },
    });
    // 5️⃣ Merge progress with courses and calculate total duration
    const coursesWithProgress = courses.map((course) => {
        const progress = progressList.find((p) => p.courseId.toString() === course._id.toString());
        const totalLessons = Array.isArray(course.modules)
            ? course.modules.reduce((acc, module) => acc + (Array.isArray(module.lessons) ? module.lessons.length : 0), 0)
            : 0;
        const totalDuration = Array.isArray(course.modules)
            ? course.modules.reduce((acc, module) => acc +
                (Array.isArray(module.lessons)
                    ? module.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0)
                    : 0), 0)
            : 0;
        const completedLessons = progress && Array.isArray(progress.modules)
            ? progress.modules.reduce((acc, module) => acc +
                (Array.isArray(module.completedLessons)
                    ? module.completedLessons.length
                    : 0), 0)
            : 0;
        const courseProgress = totalLessons > 0
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0;
        return {
            courseId: course._id.toString(),
            title: course.title,
            thumbnail: course.thumbnail || null,
            totalLessons,
            completedLessons,
            totalDuration,
            progress: courseProgress,
        };
    });
    // 6️⃣ Split into completed vs in-progress
    const completedCourses = coursesWithProgress.filter((c) => c.progress === 100);
    const inProgressCourses = coursesWithProgress.filter((c) => c.progress < 100);
    // 7️⃣ Add counts
    return {
        completedCount: completedCourses.length,
        inProgressCount: inProgressCourses.length,
        totalPurchasedCourses: coursesWithProgress.length, // 🟢 মোট কতগুলো course user কিনেছে
        completedCourses,
        inProgressCourses,
    };
};
exports.analyticsServices = {
    adminAnalytics,
    userAnalyticsData
};
//# sourceMappingURL=analytics.services.js.map