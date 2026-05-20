import { Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import { checkAuths } from "../../middleware/protect";
import { multerUpload } from "../../config/multer.config";
import { IRole } from "./user.interface";
import passport from "passport";
import jwt from "jsonwebtoken";
import { envVers } from "../../config/env";

const UserRouter = Router();


UserRouter.get("/microsoft",
  passport.authenticate("microsoft")
);

interface AuthenticatedUser {
  _id: string;
  role: string;
  email: string;
}

UserRouter.get(
  "/microsoft/callback",
  (req, res, next) => {
    console.log(`\n=== [OAuth Diagnostic] Microsoft Callback Hit ===`);
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`IP: ${req.ip || req.socket.remoteAddress}`);
    console.log(`Code Parameter Present: ${!!req.query.code}`);
    console.log(`================================================\n`);
    next();
  },
  passport.authenticate("microsoft", { session: false }),
  (req: Request, res: Response) => {
    const user = req.user as AuthenticatedUser | undefined;

    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User not authenticated",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      envVers.ACCESS_SECRATE,
      { expiresIn: "30d" }
    );

    // res.status(200).send({
    //   success: true,
    //   message: "Login success",
    //   token
    // });
    // Redirect back to your React frontend with the token
    let frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const host = req.headers.host || "";
    if ((host.includes("localhost") || host.includes("127.0.0.1")) && frontendUrl.includes("learning.awcompaniesinc.com")) {
      frontendUrl = "http://localhost:5173";
    }

    res.redirect(`${frontendUrl}/oauth-success?token=${token}`);
  }
);


UserRouter.post("/signIn", UserController.SingIn);
UserRouter.post("/signUp", UserController.SignUp);
UserRouter.post("/createEmployee", checkAuths(IRole.ADMIN), UserController.createEmployee);
UserRouter.post("/refreshToken", UserController.getAccessTokenUseRefreshToken)
UserRouter.get("/get/allUser", UserController.getAllUser);
UserRouter.get("/getAllEmployee", checkAuths(IRole.ADMIN), UserController.getAllEmployee);
UserRouter.get("/getMe", checkAuths(), UserController.getMe);
UserRouter.patch("/changePassword", checkAuths(), UserController.changePassword);
UserRouter.delete("/delete/:userId", checkAuths(), UserController.deleteUser);
UserRouter.patch("/update/user/Profile/:id", checkAuths(), multerUpload.single("avatarUrl"), UserController.updateUserProfile);


export default UserRouter;