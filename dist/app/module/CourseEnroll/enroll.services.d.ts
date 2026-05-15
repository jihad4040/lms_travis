import { Types } from "mongoose";
export declare const enrollServices: {
    enrollCourse: (data: {
        userId: Types.ObjectId;
        courseId: Types.ObjectId;
        courseName: string;
    }) => Promise<import("mongoose").Document<unknown, {}, import("./enroll.interface").IEnroll, {}, {}> & import("./enroll.interface").IEnroll & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
};
//# sourceMappingURL=enroll.services.d.ts.map