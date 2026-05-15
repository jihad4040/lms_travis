import { Response } from "express";
interface TMeta {
    total?: number;
    page?: number;
    limit?: number;
    totalPage?: number;
}
interface TResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
    meta?: TMeta;
}
export declare const sendResponse: <T>(res: Response, data: TResponse<T>) => void;
export {};
//# sourceMappingURL=sendResponse.d.ts.map