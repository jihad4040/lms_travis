import { NextFunction, Request, Response } from "express";
export declare const LessionController: {
    createLesson: (req: Request, res: Response, next: NextFunction) => void;
    updateLessonContent: (req: Request, res: Response, next: NextFunction) => void;
    deleteLesson: (req: Request, res: Response, next: NextFunction) => void;
    updateLessonContentVideo: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=courseLesson.controller.d.ts.map