import { Types } from "mongoose";
export interface IEnrollCourse {
    courseId: Types.ObjectId;
    date?: Date;
}
export interface IEarnedBadge {
    badgeId: Types.ObjectId;
    name: string;
    earnedDate: Date;
    points: number;
    details?: string;
}
export interface IUser {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    bio?: string;
    avatarUrl?: string;
    dateOfBirth?: Date;
    role: string;
    provider?: string;
    earnedBadges: IEarnedBadge[];
    isActive: boolean;
    enrollCourse: IEnrollCourse[];
    lastLogin?: Date;
    createdAt?: Date;
    totalPoints: number;
    updatedAt?: Date;
}
export declare enum IRole {
    ADMIN = "ADMIN",
    USER = "USER",
    EMPLOYEE = "EMPLOYEE"
}
//# sourceMappingURL=user.interface.d.ts.map