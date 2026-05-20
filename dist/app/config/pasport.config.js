"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_microsoft_1 = require("passport-microsoft");
const user_model_1 = require("../module/user/user.model");
const env_1 = require("./env");
passport_1.default.use(new passport_microsoft_1.Strategy({
    clientID: env_1.envVers.MICROSOFT.CLIENT_ID,
    clientSecret: env_1.envVers.MICROSOFT.CLIENT_SECRATE,
    callbackURL: env_1.envVers.MICROSOFT.MICROSOFT_REDIRECT_URL,
    scope: ["user.read"],
    tenant: env_1.envVers.MICROSOFT.TENANT,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value ||
            profile.mail ||
            profile.userPrincipalName ||
            profile._json?.mail ||
            profile._json?.userPrincipalName;
        if (!email) {
            return done(new Error("Unable to retrieve email address from your Microsoft profile. Please make sure an email is associated with your account."), null);
        }
        let user = await user_model_1.User.findOne({ email });
        if (!user) {
            user = await user_model_1.User.create({
                name: profile.displayName ? profile.displayName : null,
                email,
                provider: "MICROSOFT",
                microsoftId: profile.id,
            });
        }
        return done(null, user);
    }
    catch (err) {
        done(err, null);
    }
}));
exports.default = passport_1.default;
//# sourceMappingURL=pasport.config.js.map