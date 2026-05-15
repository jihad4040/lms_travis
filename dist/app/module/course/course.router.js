"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const course_controller_1 = require("./course.controller");
const multer_config_1 = require("../../config/multer.config");
const protect_1 = require("../../middleware/protect");
const user_interface_1 = require("../user/user.interface");
const CourseRouter = (0, express_1.Router)();
CourseRouter.post("/create", (0, protect_1.checkAuths)(user_interface_1.IRole.ADMIN), multer_config_1.multerUpload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "instructorProfile", maxCount: 1 }]), course_controller_1.courseController.createCourse);
CourseRouter.get("/allCourse", (0, protect_1.checkAuths)(), course_controller_1.courseController.getAllCourse);
CourseRouter.patch("/update/course", (0, protect_1.checkAuths)(user_interface_1.IRole.ADMIN), multer_config_1.multerUpload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "instructorProfile", maxCount: 1 }]), course_controller_1.courseController.updateCourseInformation);
CourseRouter.get("/getRecomandationCourse", course_controller_1.courseController.recomandationCourse);
CourseRouter.get("/course/:courseId", (0, protect_1.checkAuths)(), course_controller_1.courseController.getCourseWithProgress);
CourseRouter.delete("/delete/:courseId", (0, protect_1.checkAuths)(user_interface_1.IRole.ADMIN), course_controller_1.courseController.deleteCourse);
CourseRouter.get("/get/coursebasicInfo/:courseId", course_controller_1.courseController.getSingleCourse);
exports.default = CourseRouter;
//# sourceMappingURL=course.router.js.map