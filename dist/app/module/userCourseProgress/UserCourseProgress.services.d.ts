export declare const UserCourseProgressServices: {
    createProgressForUser: (userId: string, courseId: string) => Promise<import("mongoose").Document<unknown, {}, {
        courseId: import("mongoose").Types.ObjectId;
        userId: import("mongoose").Types.ObjectId;
        courseProgress: number;
        modules: import("mongoose").Types.DocumentArray<{
            moduleId: import("mongoose").Types.ObjectId;
            progress: number;
            completedLessons: import("mongoose").Types.ObjectId[];
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            moduleId: import("mongoose").Types.ObjectId;
            progress: number;
            completedLessons: import("mongoose").Types.ObjectId[];
        }> & {
            moduleId: import("mongoose").Types.ObjectId;
            progress: number;
            completedLessons: import("mongoose").Types.ObjectId[];
        }>;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        courseId: import("mongoose").Types.ObjectId;
        userId: import("mongoose").Types.ObjectId;
        courseProgress: number;
        modules: import("mongoose").Types.DocumentArray<{
            moduleId: import("mongoose").Types.ObjectId;
            progress: number;
            completedLessons: import("mongoose").Types.ObjectId[];
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            moduleId: import("mongoose").Types.ObjectId;
            progress: number;
            completedLessons: import("mongoose").Types.ObjectId[];
        }> & {
            moduleId: import("mongoose").Types.ObjectId;
            progress: number;
            completedLessons: import("mongoose").Types.ObjectId[];
        }>;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getProgressSingleCourse: (userId: string, courseId: string) => Promise<{
        modulesProgress: {
            moduleId: import("mongoose").Types.ObjectId | undefined;
            moduleName: string;
            totalLessons: number;
            completedLessons: number;
            pendingLessons: number;
            progress: number;
        }[];
        courseSummary: {
            totalLessons: number;
            completedLessons: number;
            pendingLessons: number;
            progress: number;
        };
    }>;
    completeLesson: (userId: string, courseId: string, lessonId: string) => Promise<import("mongoose").Document<unknown, {}, {
        courseId: import("mongoose").Types.ObjectId;
        userId: import("mongoose").Types.ObjectId;
        courseProgress: number;
        modules: import("mongoose").Types.DocumentArray<{
            moduleId: import("mongoose").Types.ObjectId;
            progress: number;
            completedLessons: import("mongoose").Types.ObjectId[];
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            moduleId: import("mongoose").Types.ObjectId;
            progress: number;
            completedLessons: import("mongoose").Types.ObjectId[];
        }> & {
            moduleId: import("mongoose").Types.ObjectId;
            progress: number;
            completedLessons: import("mongoose").Types.ObjectId[];
        }>;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        courseId: import("mongoose").Types.ObjectId;
        userId: import("mongoose").Types.ObjectId;
        courseProgress: number;
        modules: import("mongoose").Types.DocumentArray<{
            moduleId: import("mongoose").Types.ObjectId;
            progress: number;
            completedLessons: import("mongoose").Types.ObjectId[];
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            moduleId: import("mongoose").Types.ObjectId;
            progress: number;
            completedLessons: import("mongoose").Types.ObjectId[];
        }> & {
            moduleId: import("mongoose").Types.ObjectId;
            progress: number;
            completedLessons: import("mongoose").Types.ObjectId[];
        }>;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
};
//# sourceMappingURL=UserCourseProgress.services.d.ts.map