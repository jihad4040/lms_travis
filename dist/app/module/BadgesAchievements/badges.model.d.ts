import mongoose, { Types } from "mongoose";
export interface IBadge {
    _id: Types.ObjectId;
    name: string;
    type: "Badge" | "Achievement";
    triggerEvent: string;
    conditions: string[];
    points: number;
    logo?: string;
}
export declare const Badges: mongoose.Model<IBadge, {}, {}, {}, mongoose.Document<unknown, {}, IBadge, {}, {}> & IBadge & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=badges.model.d.ts.map