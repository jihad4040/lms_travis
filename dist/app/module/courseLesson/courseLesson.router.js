"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courseLesson_controller_1 = require("./courseLesson.controller");
const multer_config_1 = require("../../config/multer.config");
const protect_1 = require("../../middleware/protect");
const user_interface_1 = require("../user/user.interface");
const LessionRouter = (0, express_1.Router)();
LessionRouter.post("/create", (0, protect_1.checkAuths)(user_interface_1.IRole.ADMIN), multer_config_1.multerUpload.fields([
    { name: 'scorm', maxCount: 1 }, // SCORM .zip ফাইলের জন্য
    { name: 'video', maxCount: 1 }, // ভিডিও ফাইলের জন্য
    { name: 'audio', maxCount: 1 }, // অডিও ফাইলের জন্য
    { name: 'pdf', maxCount: 1 }, // PDF ফাইলের জন্য
    { name: 'image', maxCount: 1 }, // চিত্র ফাইলের জন্য
]), courseLesson_controller_1.LessionController.createLesson);
LessionRouter.patch("/update/lession/info", (0, protect_1.checkAuths)(user_interface_1.IRole.ADMIN), (0, protect_1.checkAuths)(), courseLesson_controller_1.LessionController.updateLessonContent);
LessionRouter.patch("/delete/lession", (0, protect_1.checkAuths)(user_interface_1.IRole.ADMIN), (0, protect_1.checkAuths)(), courseLesson_controller_1.LessionController.deleteLesson);
LessionRouter.patch("/:courseId/:moduleId/:lessonId/content", (0, protect_1.checkAuths)(), multer_config_1.multerUpload.fields([
    { name: 'scorm', maxCount: 1 }, // SCORM .zip ফাইলের জন্য
    { name: 'video', maxCount: 1 }, // ভিডিও ফাইলের জন্য
    { name: 'audio', maxCount: 1 }, // অডিও ফাইলের জন্য
    { name: 'pdf', maxCount: 1 }, // PDF ফাইলের জন্য
    { name: 'image', maxCount: 1 }, // চিত্র ফাইলের জন্য
]), courseLesson_controller_1.LessionController.updateLessonContentVideo);
exports.default = LessionRouter;
//# sourceMappingURL=courseLesson.router.js.map