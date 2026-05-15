"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const support_controller_1 = require("./support.controller");
const protect_1 = require("../../middleware/protect");
const user_interface_1 = require("../user/user.interface");
const supportRouter = (0, express_1.Router)();
supportRouter.post("/create", (0, protect_1.checkAuths)(), support_controller_1.supportController.createSupport);
supportRouter.get("/getAllSupport", (0, protect_1.checkAuths)(user_interface_1.IRole.ADMIN), support_controller_1.supportController.getAllSupport);
supportRouter.patch("/update/:supportId", (0, protect_1.checkAuths)(user_interface_1.IRole.ADMIN), support_controller_1.supportController.updateSupportStatus);
exports.default = supportRouter;
//# sourceMappingURL=support.router.js.map