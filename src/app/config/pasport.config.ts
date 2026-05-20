import passport from "passport";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import { User } from "../module/user/user.model";
import { envVers } from "./env";

passport.use(
  new MicrosoftStrategy(
    {
      clientID: envVers.MICROSOFT.CLIENT_ID,
      clientSecret: envVers.MICROSOFT.CLIENT_SECRATE,
      callbackURL: envVers.MICROSOFT.MICROSOFT_REDIRECT_URL,
      scope: ["user.read"],
      tenant: envVers.MICROSOFT.TENANT,
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      try {
        const email =
          profile.emails?.[0]?.value ||
          profile.mail ||
          profile.userPrincipalName ||
          profile._json?.mail ||
          profile._json?.userPrincipalName;

        if (!email) {
          return done(new Error("Unable to retrieve email address from your Microsoft profile. Please make sure an email is associated with your account."), null);
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName ? profile.displayName : null,
            email,
            provider: "MICROSOFT",
            microsoftId: profile.id,
          });
        }

        return done(null, user);
      } catch (err) {
        done(err as Error, null);
      }
    },
  ),
);

export default passport;
