import mongoose from "mongoose";
export declare const UserCourseProgress: mongoose.Model<{
    courseId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    courseProgress: number;
    modules: mongoose.Types.DocumentArray<{
        moduleId: mongoose.Types.ObjectId;
        progress: number;
        completedLessons: mongoose.Types.ObjectId[];
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        moduleId: mongoose.Types.ObjectId;
        progress: number;
        completedLessons: mongoose.Types.ObjectId[];
    }> & {
        moduleId: mongoose.Types.ObjectId;
        progress: number;
        completedLessons: mongoose.Types.ObjectId[];
    }>;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    courseId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    courseProgress: number;
    modules: mongoose.Types.DocumentArray<{
        moduleId: mongoose.Types.ObjectId;
        progress: number;
        completedLessons: mongoose.Types.ObjectId[];
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        moduleId: mongoose.Types.ObjectId;
        progress: number;
        completedLessons: mongoose.Types.ObjectId[];
    }> & {
        moduleId: mongoose.Types.ObjectId;
        progress: number;
        completedLessons: mongoose.Types.ObjectId[];
    }>;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    courseId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    courseProgress: number;
    modules: mongoose.Types.DocumentArray<{
        moduleId: mongoose.Types.ObjectId;
        progress: number;
        completedLessons: mongoose.Types.ObjectId[];
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        moduleId: mongoose.Types.ObjectId;
        progress: number;
        completedLessons: mongoose.Types.ObjectId[];
    }> & {
        moduleId: mongoose.Types.ObjectId;
        progress: number;
        completedLessons: mongoose.Types.ObjectId[];
    }>;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    courseId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    courseProgress: number;
    modules: mongoose.Types.DocumentArray<{
        moduleId: mongoose.Types.ObjectId;
        progress: number;
        completedLessons: mongoose.Types.ObjectId[];
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        moduleId: mongoose.Types.ObjectId;
        progress: number;
        completedLessons: mongoose.Types.ObjectId[];
    }> & {
        moduleId: mongoose.Types.ObjectId;
        progress: number;
        completedLessons: mongoose.Types.ObjectId[];
    }>;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    courseId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    courseProgress: number;
    modules: mongoose.Types.DocumentArray<{
        moduleId: mongoose.Types.ObjectId;
        progress: number;
        completedLessons: mongoose.Types.ObjectId[];
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        moduleId: mongoose.Types.ObjectId;
        progress: number;
        completedLessons: mongoose.Types.ObjectId[];
    }> & {
        moduleId: mongoose.Types.ObjectId;
        progress: number;
        completedLessons: mongoose.Types.ObjectId[];
    }>;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    courseId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    courseProgress: number;
    modules: mongoose.Types.DocumentArray<{
        moduleId: mongoose.Types.ObjectId;
        progress: number;
        completedLessons: mongoose.Types.ObjectId[];
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        moduleId: mongoose.Types.ObjectId;
        progress: number;
        completedLessons: mongoose.Types.ObjectId[];
    }> & {
        moduleId: mongoose.Types.ObjectId;
        progress: number;
        completedLessons: mongoose.Types.ObjectId[];
    }>;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=UserCourseProgress.model.d.ts.map