import { Types } from "mongoose";
export declare const analyticsServices: {
    adminAnalytics: () => Promise<{
        totalUser: number;
        totalActiveCourse: number;
        totalCourse: number;
        activeLerner: number;
        revenue: any;
        weeklyAnalytics: {
            weekLabel: string;
            users: any;
            enrollments: any;
        }[];
        courseCategoryData: any;
        topSellingCourses: any[];
    }>;
    userAnalyticsData: (userId: Types.ObjectId) => Promise<{
        completedCount: number;
        inProgressCount: number;
        totalPurchasedCourses: number;
        completedCourses: {
            courseId: string;
            title: string;
            thumbnail: string | null;
            totalLessons: number;
            completedLessons: number;
            totalDuration: number;
            progress: number;
        }[];
        inProgressCourses: {
            courseId: string;
            title: string;
            thumbnail: string | null;
            totalLessons: number;
            completedLessons: number;
            totalDuration: number;
            progress: number;
        }[];
    }>;
};
//# sourceMappingURL=analytics.services.d.ts.map