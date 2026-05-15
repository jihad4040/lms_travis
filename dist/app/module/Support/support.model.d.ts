import { Schema } from "mongoose";
export declare const Support: import("mongoose").Model<{
    userEmail: string;
    problemDescription: string;
    solveStatus: "Pending" | "Resolve";
    phone?: string | null;
    replay?: string | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    userEmail: string;
    problemDescription: string;
    solveStatus: "Pending" | "Resolve";
    phone?: string | null;
    replay?: string | null;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
    versionKey: false;
}> & {
    userEmail: string;
    problemDescription: string;
    solveStatus: "Pending" | "Resolve";
    phone?: string | null;
    replay?: string | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    userEmail: string;
    problemDescription: string;
    solveStatus: "Pending" | "Resolve";
    phone?: string | null;
    replay?: string | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    userEmail: string;
    problemDescription: string;
    solveStatus: "Pending" | "Resolve";
    phone?: string | null;
    replay?: string | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
    versionKey: false;
}>> & import("mongoose").FlatRecord<{
    userEmail: string;
    problemDescription: string;
    solveStatus: "Pending" | "Resolve";
    phone?: string | null;
    replay?: string | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
}>>;
//# sourceMappingURL=support.model.d.ts.map