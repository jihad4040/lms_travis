import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { ILissonContentType } from "../courseLesson/courseLesson.interface";
import AppError from "../../utils/AppError";
import { sendResponse } from "../../utils/sendResponse";
import { ILesson, IModule } from "../course/course.interface";
import { Course } from "../course/course.model";
import { Types } from "mongoose";
import { processScormZip } from "../../utils/scormUnzip";

// const createMilestone = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

//     // TypeScript fix: force type cast as object with File[] values
//     const files = req.files as { [fieldname: string]: Express.Multer.File[] };

//     const scormUrl = files?.scorm?.[0]?.path || "";
//     const videoUrl = files?.video?.[0]?.path || "";
//     const audioUrl = files?.audio?.[0]?.path || "";
//     const pdfUrl = files?.pdf?.[0]?.path || "";
//     const image = files?.image?.[0]?.path || "";

//     sendResponse(res, {
//         success: true,
//         statusCode: 200,
//         message: "Module Created Success",
//         data: {
//             scormUrl,
//             videoUrl,
//             audioUrl,
//             pdfUrl,
//             image
//         }
//     });

// });

// const createMilestone = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const files = req.files as { [fieldname: string]: Express.Multer.File[] };

//     if (!req.body.data) {
//       throw new AppError(400, "Missing form data.");
//     }

//     const parsedData = JSON.parse(req.body.data);
//     const { courseId, moduleName, lessonName, article } = parsedData;

//     if (!courseId || !moduleName || !lessonName) {
//       throw new AppError(400, "courseId, moduleName, lessonName are required");
//     }

//     // ✅ Enum mapping ব্যবহার করো
//     const contentTypeMap: Record<string, ILissonContentType> = {
//       video: ILissonContentType.Video,
//       image: ILissonContentType.Image,
//       audio: ILissonContentType.Audio,
//       pdf: ILissonContentType.PDF,
//       scorm: ILissonContentType.SCORM,
//     };

//     let detectedType: string | null = null;
//     let contentUrl = "";

//     for (const field in contentTypeMap) {
//       if (files?.[field]?.[0]?.path) {
//         detectedType = field;
//         contentUrl = files[field][0].path;
//         break;
//       }
//     }

//     if (!detectedType) {
//       throw new AppError(400, "No valid content file uploaded.");
//     }

//     // ✅ Lesson object তৈরি করো enum value দিয়ে
//     const newLesson: ILesson = {
//       lessonName,
//       contentUrl,
//       article,
//       duration: 0,
//       isCompleted: false,
//     };

//     const course = await Course.findById(courseId);
//     if (!course) {
//       throw new AppError(404, "Course not found");
//     }

//     // ✅ নতুন module তৈরি করো
//     const newModule: IModule = {
//       moduleName,
//       lessons: [newLesson], // subdocument হিসেবে lesson যাবে
//     };

//     course.modules.push(newModule);
//     await course.save();

//     console.log("content Url", contentUrl);

//     sendResponse(res, {
//       success: true,
//       statusCode: 200,
//       message: "New module created with one lesson!",
//       data: course,
//     });
//   },
// );

const createMilestone = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("📥 Request received");
      console.log("📦 Body:", req.body);
      console.log("📁 Files:", req.files);

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (!req.body.data) {
        throw new AppError(400, "Missing form data.");
      }

      let parsedData;
      try {
        parsedData = JSON.parse(req.body.data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new AppError(400, "Invalid JSON in data field");
      }

      const { courseId, moduleName, lessonName, article } = parsedData;

      if (!courseId || !moduleName || !lessonName) {
        throw new AppError(
          400,
          "courseId, moduleName, lessonName are required",
        );
      }

      // Content type mapping
      const contentTypeMap: Record<string, ILissonContentType> = {
        video: ILissonContentType.Video,
        image: ILissonContentType.Image,
        audio: ILissonContentType.Audio,
        pdf: ILissonContentType.PDF,
        scorm: ILissonContentType.SCORM,
      };

      let detectedType: string | null = null;
      let contentUrl = "";
      let uploadedFile: Express.Multer.File | null = null;

      // Check which file was uploaded
      for (const field in contentTypeMap) {
        if (files?.[field]?.[0]) {
          detectedType = field;
          uploadedFile = files[field][0];
          contentUrl = uploadedFile.path;

          console.log(`✅ ${field} file detected:`);
          console.log("   Name:", uploadedFile.originalname);
          console.log(
            "   Size:",
            (uploadedFile.size / 1024 / 1024).toFixed(2),
            "MB",
          );
          console.log("   Type:", uploadedFile.mimetype);
          console.log("   URL:", contentUrl);

          break;
        }
      }

      if (!detectedType || !contentUrl) {
        console.log("❌ No valid file uploaded");
        console.log("Files received:", JSON.stringify(files, null, 2));
        throw new AppError(400, "No valid content file uploaded.");
      }

      // Verify SCORM URL
      let unzeepFile: any = [];
      const isZip = uploadedFile?.originalname.toLowerCase().endsWith(".zip") || detectedType === "scorm";

      if (isZip) {
        console.log("📦 ZIP/SCORM file detected, processing...");
        unzeepFile = await processScormZip(contentUrl);
      }

      // Create lesson
      const newLesson: any = {
        lessonName,
        contentType: contentTypeMap[detectedType],
        contentUrl,
        unzeepFile,
        article: article || "",
        duration: 0,
        isCompleted: false,
      };

      console.log("🔍 Finding course with ID:", courseId);

      const course = await Course.findById(courseId);
      if (!course) {
        throw new AppError(404, "Course not found");
      }

      console.log("✅ Course found:", course.title);

      // Create new module
      const newModule: IModule = {
        moduleName,
        lessons: [newLesson],
      };

      course.modules.push(newModule);

      console.log("💾 Saving course...");
      await course.save();
      console.log("✅ Course saved successfully");

      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: `New module created with ${detectedType} lesson!`,
        data: {
          course,
          uploadedContent: {
            type: detectedType,
            url: contentUrl,
            size: uploadedFile?.size,
            name: uploadedFile?.originalname,
          },
        },
      });
    } catch (error: any) {
      console.error("❌ Error in createMilestone:", error);
      console.error("Error stack:", error.stack);

      // Pass error to Express error handler
      next(error);
    }
  },
);

const updateModuleName = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, moduleId, moduleName } = req.body;

    if (!courseId || !moduleId || !moduleName) {
      throw new AppError(400, "courseId, moduleId and moduleName are required");
    }

    if (
      !Types.ObjectId.isValid(courseId) ||
      !Types.ObjectId.isValid(moduleId)
    ) {
      throw new AppError(400, "Invalid courseId or moduleId");
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

    module.moduleName = moduleName;

    await course.save();

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Module Name Updated",
      data: module,
    });
  },
);

const deleteModule = catchAsync(async (req: Request, res: Response) => {
  const { courseId, moduleId } = req.body;

  // Validation
  if (!courseId || !moduleId) {
    throw new AppError(400, "courseId and moduleId are required");
  }

  if (!Types.ObjectId.isValid(courseId) || !Types.ObjectId.isValid(moduleId)) {
    throw new AppError(400, "Invalid courseId or moduleId");
  }

  // Find course
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError(404, "Course not found");
  }

  // Find module index
  const moduleIndex = course.modules.findIndex(
    (m) => m._id && m._id.toString() === moduleId,
  );

  if (moduleIndex === -1) {
    throw new AppError(404, "Module not found");
  }

  // ✅ Delete module
  course.modules.splice(moduleIndex, 1);

  await course.save();

  res.status(200).json({
    success: true,
    message: "Module deleted successfully",
  });
});

export const milestoneContainer = {
  createMilestone,
  updateModuleName,
  deleteModule,
};
