"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const protect_1 = require("../../middleware/protect");
const recent_activity_controller_1 = require("./recent.activity.controller");
const RecentActivityRouter = (0, express_1.Router)();
RecentActivityRouter.get("/getAllRecentActivity", (0, protect_1.checkAuths)(), recent_activity_controller_1.getRecentActivity);
exports.default = RecentActivityRouter;
//# sourceMappingURL=recent.avtivity.router.js.map