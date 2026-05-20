import { Types } from "mongoose";
export declare enum ICourseStatus {
    Published = "Published",
    Draft = "Draft"
}
export interface ILesson {
    _id?: Types.ObjectId;
    lessonName: string;
    contentType?: string;
    unzeepFile?: any[];
    contentUrl?: string;
    article?: string;
    duration?: number;
    isCompleted?: boolean;
}
export interface IModule {
    _id?: Types.ObjectId;
    moduleName: string;
    lessons: ILesson[];
}
export interface ICourse {
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
    modules: IModule[];
}
export interface IUpCourse {
    _id: Types.ObjectId;
    title: string;
    description: string;
    thumbnail: string;
    category: string;
    prices: number;
    courseTag: string;
    courseStatus: string;
    whatsUserLearn: string[];
    instructorName?: string;
    instructorTitle?: string;
    instructorDescription?: string;
    instructorProfile?: string;
    modules?: IModule[];
}
//# sourceMappingURL=course.interface.d.ts.map