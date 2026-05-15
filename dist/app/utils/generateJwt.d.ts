import { IUser } from "../module/user/user.interface";
export declare const generateJwt: (data: Partial<IUser>) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
//# sourceMappingURL=generateJwt.d.ts.map