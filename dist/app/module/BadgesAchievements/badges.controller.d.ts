import { NextFunction, Request, Response } from "express";
export declare const badgesController: {
    getUserBadges: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getAllBadgesByAdmin: (req: Request, res: Response, next: NextFunction) => void;
    updatebadges: (req: Request, res: Response, next: NextFunction) => void;
    getUserBadgesAndLockedBadges: (req: Request, res: Response, next: NextFunction) => void;
};
//# sourceMappingURL=badges.controller.d.ts.map