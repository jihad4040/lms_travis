import mongoose, { Schema } from "mongoose";
import { ICourse, ICourseStatus, ILesson, IModule } from "./course.interface";

const LessonSchema: Schema<ILesson> = new Schema(
  {
    lessonName: { type: String, required: true, trim: true },
    unzeepFile: [],
    contentUrl: { type: String, trim: true },
    article: { type: String, trim: true },
    duration: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
  },
  { _id: true }
);

const ModuleSchema: Schema<IModule> = new Schema(
  {
    moduleName: { type: String, required: true, trim: true },
    lessons: [LessonSchema],
  },
  { _id: true }
);

// Course Schema
const CourseSchema: Schema<ICourse> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    thumbnail: { type: String },
    category: { type: String, required: true },
    prices: { type: Number, required: true },
    courseTag: { type: String, required: true },
    courseStatus:
    {
      type: String,
      required: true,
      enum: ICourseStatus,
      default: ICourseStatus.Published
    },
    whatsUserLearn: { type: [String], required: true },
    instructorName: { type: String, required: true },
    instructorTitle: { type: String, required: true },
    instructorDescription: { type: String, required: true },
    instructorProfile: { type: String },
    modules: [ModuleSchema],
  },
  { timestamps: true }
);

export const Course = mongoose.model<ICourse>("Course", CourseSchema);