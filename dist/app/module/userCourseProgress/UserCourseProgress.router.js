"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserCourseProgress_controller_1 = require("./UserCourseProgress.controller");
const protect_1 = require("../../middleware/protect");
const userCourseProgressRouter = (0, express_1.Router)();
userCourseProgressRouter.post("/create", (0, protect_1.checkAuths)(), UserCourseProgress_controller_1.userCourseProgresssController.createProgress);
userCourseProgressRouter.get("/getCourseProgress/:courseId/:userId", (0, protect_1.checkAuths)(), UserCourseProgress_controller_1.userCourseProgresssController.getProgressSingleCourse);
userCourseProgressRouter.patch("/complite/lession/:courseId/:lessonId/:userId", (0, protect_1.checkAuths)(), UserCourseProgress_controller_1.userCourseProgresssController.compliteLession);
exports.default = userCourseProgressRouter;
//# sourceMappingURL=UserCourseProgress.router.js.map