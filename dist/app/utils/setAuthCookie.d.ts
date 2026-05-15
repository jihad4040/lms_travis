import { Response } from "express";
interface authToken {
    refreshToken?: string;
    accessToken?: string;
}
export declare const setAuthCookie: (res: Response, tokenInfo: authToken) => void;
export {};
//# sourceMappingURL=setAuthCookie.d.ts.map