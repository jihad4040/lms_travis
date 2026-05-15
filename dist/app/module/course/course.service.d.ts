import { Types } from "mongoose";
import { ICourse, IUpCourse } from "./course.interface";
export declare const courseServices: {
    createCourse: (payload: ICourse) => Promise<import("mongoose").Document<unknown, {}, ICourse, {}, {}> & ICourse & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateCourse: (courseId: Types.ObjectId, payload: Partial<IUpCourse>) => Promise<(import("mongoose").Document<unknown, {}, ICourse, {}, {}> & ICourse & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    getCourseBasicInfoById: (courseId: string) => Promise<{
        totalModules: number;
        totalLessons: number;
        totalDuration: number;
        _id: Types.ObjectId;
        title: string;
        description: string;
        thumbnail: string;
        category: string;
        prices: number;
        courseTag: string;
        courseStatus: string;
        whatsUserLearn: string[];
        instructorName: string;
        instructorTitle: string;
        instructorDescription: string;
        instructorProfile: string;
        modules: import("./course.interface").IModule[];
        __v: number;
    } | null>;
};
//# sourceMappingURL=course.service.d.ts.map