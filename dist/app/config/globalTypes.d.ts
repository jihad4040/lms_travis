import { JwtPayload } from "jsonwebtoken";
declare global {
    namespace Express {
        interface Request {
            authUser: JwtPayload;
        }
    }
}
//# sourceMappingURL=globalTypes.d.ts.map