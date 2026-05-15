import { NextFunction, Request, Response } from "express";
export declare const courseController: {
    createCourse: (req: Request, res: Response, next: NextFunction) => void;
    getCourseWithProgress: (req: Request, res: Response, next: NextFunction) => void;
    getAllCourse: (req: Request, res: Response, next: NextFunction) => void;
    updateCourseInformation: (req: Request, res: Response, next: NextFunction) => void;
    getSingleCourse: (req: Request, res: Response, next: NextFunction) => void;
    deleteCourse: (req: Request, res: Response, next: NextFunction) => void;
    recomandationCourse: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=course.controller.d.ts.map