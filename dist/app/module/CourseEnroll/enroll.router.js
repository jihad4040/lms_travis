"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enroll_controller_1 = require("./enroll.controller");
const protect_1 = require("../../middleware/protect");
const enrollRouter = (0, express_1.Router)();
enrollRouter.post("/create", (0, protect_1.checkAuths)(), enroll_controller_1.enrollController.enrollCourse);
exports.default = enrollRouter;
//# sourceMappingURL=enroll.router.js.map