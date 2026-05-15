"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const protect_1 = require("../../middleware/protect");
const multer_config_1 = require("../../config/multer.config");
const user_interface_1 = require("./user.interface");
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const UserRouter = (0, express_1.Router)();
UserRouter.get("/microsoft", passport_1.default.authenticate("microsoft"));
UserRouter.get("/microsoft/callback", passport_1.default.authenticate("microsoft", { session: false }), (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).send({
            success: false,
            message: "User not authenticated",
        });
    }
    const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role, email: user.email }, env_1.envVers.ACCESS_SECRATE, { expiresIn: "30d" });
    // res.status(200).send({
    //   success: true,
    //   message: "Login success",
    //   token
    // });
    // Redirect back to your React frontend with the token
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
});
UserRouter.post("/signIn", user_controller_1.UserController.SingIn);
UserRouter.post("/signUp", user_controller_1.UserController.SignUp);
UserRouter.post("/createEmployee", (0, protect_1.checkAuths)(user_interface_1.IRole.ADMIN), user_controller_1.UserController.createEmployee);
UserRouter.post("/refreshToken", user_controller_1.UserController.getAccessTokenUseRefreshToken);
UserRouter.get("/get/allUser", user_controller_1.UserController.getAllUser);
UserRouter.get("/getAllEmployee", (0, protect_1.checkAuths)(user_interface_1.IRole.ADMIN), user_controller_1.UserController.getAllEmployee);
UserRouter.get("/getMe", (0, protect_1.checkAuths)(), user_controller_1.UserController.getMe);
UserRouter.patch("/changePassword", (0, protect_1.checkAuths)(), user_controller_1.UserController.changePassword);
UserRouter.delete("/delete/:userId", (0, protect_1.checkAuths)(), user_controller_1.UserController.deleteUser);
UserRouter.patch("/update/user/Profile/:id", (0, protect_1.checkAuths)(), multer_config_1.multerUpload.single("avatarUrl"), user_controller_1.UserController.updateUserProfile);
exports.default = UserRouter;
//# sourceMappingURL=user.router.js.map