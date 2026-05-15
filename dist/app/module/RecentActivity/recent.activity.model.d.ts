import { Schema } from "mongoose";
export declare const RecentActivity: import("mongoose").Model<{
    description: string;
    title: string;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    description: string;
    title: string;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
    versionKey: false;
    expires: string;
}> & {
    description: string;
    title: string;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
    expires: string;
}, {
    description: string;
    title: string;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    description: string;
    title: string;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
    versionKey: false;
    expires: string;
}>> & import("mongoose").FlatRecord<{
    description: string;
    title: string;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
}>>;
//# sourceMappingURL=recent.activity.model.d.ts.map