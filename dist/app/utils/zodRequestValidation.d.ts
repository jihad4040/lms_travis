import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
export declare const validateRequest: (zodSchema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=zodRequestValidation.d.ts.map