import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/AppError";
import { sendResponse } from "../../utils/sendResponse";
import { ILesson } from "../course/course.interface";
import { Course } from "../course/course.model";
import { ILissonContentType } from "./courseLesson.interface";
import { Types } from "mongoose";

const createLesson = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!req.body.data) {
    throw new AppError(400, "Missing form data.");
  }

  const parsedData = JSON.parse(req.body.data);
  const { courseId, moduleId, lessonName, article, duration } = parsedData;

  if (!courseId || !moduleId || !lessonName) {
    throw new AppError(400, "courseId, moduleId, lessonName are required");
  }

  // ✅ Enum mapping ব্যবহার করো
  const contentTypeMap: Record<string, ILissonContentType> = {
    video: ILissonContentType.Video,
    image: ILissonContentType.Image,
    audio: ILissonContentType.Audio,
    pdf: ILissonContentType.PDF,
    scorm: ILissonContentType.SCORM,
  };

  let detectedType: string | null = null;
  let contentUrl = "";

  for (const field in contentTypeMap) {
    if (files?.[field]?.[0]?.path) {
      detectedType = field;
      contentUrl = files[field][0].path;
      break;
    }
  }

  if (!detectedType) {
    throw new AppError(400, "No valid content file uploaded.");
  }

  const newLesson: ILesson = {
    lessonName,
    contentUrl,
    article,
    duration,
    isCompleted: false,
  };

  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError(404, "Course not found");
  }

  // ✅ Safe find module (find ব্যবহার করো)
  const module = course.modules.find(
    (m: any) => m._id?.toString() === moduleId,
  );

  if (!module) {
    throw new AppError(404, "Module not found");
  }

  // ✅ Lesson push করো
  module.lessons.push(newLesson);

  await course.save();

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Lesson created and added to module successfully.",
    data: course,
  });
});

const updateLessonContent = catchAsync(async (req: Request, res: Response) => {
  const { lessonName, article, duration, courseId, moduleId, lessonId } =
    req.body;

  if (!courseId || !moduleId || !lessonId) {
    throw new AppError(400, "courseId, moduleId and lessonId are required");
  }

  if (
    !Types.ObjectId.isValid(courseId) ||
    !Types.ObjectId.isValid(moduleId) ||
    !Types.ObjectId.isValid(lessonId)
  ) {
    throw new AppError(400, "Invalid courseId, moduleId or lessonId");
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError(404, "Course not found");
  }

  const module = course.modules.find(
    (m) => m._id && m._id.toString() === moduleId,
  );
  if (!module) {
    throw new AppError(404, "Module not found");
  }

  const lesson = module.lessons.find(
    (l) => l._id && l._id.toString() === lessonId,
  );
  if (!lesson) {
    throw new AppError(404, "Lesson not found");
  }

  if (lessonName !== undefined && lessonName !== "") {
    lesson.lessonName = lessonName;
  }

  if (article !== undefined && article !== "") {
    lesson.article = article;
  }

  if (duration !== undefined && duration !== null) {
    lesson.duration = duration;
  }

  await course.save();

  res.status(200).json({
    success: true,
    message: "Lesson updated successfully",
    data: lesson,
  });
});

const deleteLesson = catchAsync(async (req: Request, res: Response) => {
  const { courseId, moduleId, lessonId } = req.body;

  if (!courseId || !moduleId || !lessonId) {
    throw new AppError(400, "courseId, moduleId and lessonId are required");
  }

  if (
    !Types.ObjectId.isValid(courseId) ||
    !Types.ObjectId.isValid(moduleId) ||
    !Types.ObjectId.isValid(lessonId)
  ) {
    throw new AppError(400, "Invalid courseId, moduleId or lessonId");
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError(404, "Course not found");
  }

  const module = course.modules.find(
    (m) => m._id && m._id.toString() === moduleId,
  );
  if (!module) {
    throw new AppError(404, "Module not found");
  }

  const lessonIndex = module.lessons.findIndex(
    (l) => l._id && l._id.toString() === lessonId,
  );

  if (lessonIndex === -1) {
    throw new AppError(404, "Lesson not found");
  }

  module.lessons.splice(lessonIndex, 1);

  await course.save();

  res.status(200).json({
    success: true,
    message: "Lesson deleted successfully",
  });
});

const updateLessonContentVideo = async (req: Request, res: Response) => {
  try {
    const { courseId, moduleId, lessonId } = req.params;

    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const files = req.files as Record<string, Express.Multer.File[]>;

    const file =
      files.video?.[0] ||
      files.audio?.[0] ||
      files.pdf?.[0] ||
      files.scorm?.[0] ||
      files.image?.[0];

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type",
      });
    }

    // ✅ multer-storage-cloudinary auto upload করেছে
    const contentUrl = (file as any).path; // 👈 Cloudinary URL

    const updatedCourse = await Course.findOneAndUpdate(
      {
        _id: courseId,
        "modules._id": moduleId,
        "modules.lessons._id": lessonId,
      },
      {
        $set: {
          "modules.$[m].lessons.$[l].contentUrl": contentUrl,
        },
      },
      {
        arrayFilters: [{ "m._id": moduleId }, { "l._id": lessonId }],
        new: true,
      },
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lesson content updated successfully",
      contentUrl,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const LessionController = {
  createLesson,
  updateLessonContent,
  deleteLesson,
  updateLessonContentVideo,
};
