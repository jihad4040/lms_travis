"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const protect_1 = require("../../middleware/protect");
const badges_controller_1 = require("./badges.controller");
const user_interface_1 = require("../user/user.interface");
const multer_config_1 = require("../../config/multer.config");
const badgesRouter = (0, express_1.Router)();
badgesRouter.get("/getAllBadgesByUser", (0, protect_1.checkAuths)(), badges_controller_1.badgesController.getUserBadges);
badgesRouter.get("/getAllBadgesByAdmin", (0, protect_1.checkAuths)(user_interface_1.IRole.ADMIN), badges_controller_1.badgesController.getAllBadgesByAdmin);
badgesRouter.get("/getTotalBadgesByUser", (0, protect_1.checkAuths)(), badges_controller_1.badgesController.getUserBadgesAndLockedBadges);
badgesRouter.patch("/updateBadges/:id", (0, protect_1.checkAuths)(user_interface_1.IRole.ADMIN), multer_config_1.multerUpload.single("logo"), badges_controller_1.badgesController.updatebadges);
exports.default = badgesRouter;
//# sourceMappingURL=badges.router.js.map