import { IUser } from "./user.interface";
export declare const UserServices: {
    signUp: (data: Partial<IUser>) => Promise<{
        _id: import("mongoose").Types.ObjectId;
        fullName: string;
        email: string;
        phone?: string;
        bio?: string;
        avatarUrl?: string;
        dateOfBirth?: Date;
        role: string;
        provider?: string;
        earnedBadges: import("./user.interface").IEarnedBadge[];
        isActive: boolean;
        enrollCourse: import("./user.interface").IEnrollCourse[];
        lastLogin?: Date;
        createdAt?: Date;
        totalPoints: number;
        updatedAt?: Date;
        __v: number;
    }>;
    signIn: (data: {
        email: string;
        password: string;
    }) => Promise<{
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
        user: {
            _id: import("mongoose").Types.ObjectId;
            fullName: string;
            email: string;
            phone?: string;
            bio?: string;
            avatarUrl?: string;
            dateOfBirth?: Date;
            role: string;
            provider?: string;
            earnedBadges: import("./user.interface").IEarnedBadge[];
            isActive: boolean;
            enrollCourse: import("./user.interface").IEnrollCourse[];
            lastLogin?: Date;
            createdAt?: Date;
            totalPoints: number;
            updatedAt?: Date;
            __v: number;
        };
    }>;
    getAllUser: (query: Record<string, string>) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPage: number;
        };
        data: (import("mongoose").Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    getAllEmployee: (query: Record<string, string>) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPage: number;
        };
        data: (import("mongoose").Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    createEmployee: (data: Partial<IUser>) => Promise<{
        _id: import("mongoose").Types.ObjectId;
        fullName: string;
        email: string;
        phone?: string;
        bio?: string;
        avatarUrl?: string;
        dateOfBirth?: Date;
        role: string;
        provider?: string;
        earnedBadges: import("./user.interface").IEarnedBadge[];
        isActive: boolean;
        enrollCourse: import("./user.interface").IEnrollCourse[];
        lastLogin?: Date;
        createdAt?: Date;
        totalPoints: number;
        updatedAt?: Date;
        __v: number;
    }>;
};
//# sourceMappingURL=user.services.d.ts.map