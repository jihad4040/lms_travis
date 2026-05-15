import { NextFunction, Request, Response } from "express";
export declare const UserController: {
    SignUp: (req: Request, res: Response, next: NextFunction) => void;
    SingIn: (req: Request, res: Response, next: NextFunction) => void;
    updateUserProfile: (req: Request, res: Response, next: NextFunction) => void;
    getAccessTokenUseRefreshToken: (req: Request, res: Response, next: NextFunction) => void;
    getAllUser: (req: Request, res: Response, next: NextFunction) => void;
    getMe: (req: Request, res: Response, next: NextFunction) => void;
    deleteUser: (req: Request, res: Response, next: NextFunction) => void;
    changePassword: (req: Request, res: Response, next: NextFunction) => void;
    getAllEmployee: (req: Request, res: Response, next: NextFunction) => void;
    createEmployee: (req: Request, res: Response, next: NextFunction) => void;
};
//# sourceMappingURL=user.controller.d.ts.map