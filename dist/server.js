"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./app/config/env");
const app_1 = require("./app");
const seedAdmin_1 = require("./app/config/seedAdmin");
require("dotenv/config");
let server;
const boostServer = async () => {
    try {
        await mongoose_1.default.connect(env_1.envVers.MONGO_URI);
        console.log("MongoDb Connected Successfully");
        await (0, seedAdmin_1.seedAdmin)();
        server = app_1.app.listen(Number(env_1.envVers.PORT), "0.0.0.0", () => {
            console.log("Server runing successfully");
            console.log(`http://localhost:${env_1.envVers.PORT}`);
        });
    }
    catch (error) {
        console.log("Mongoose Connection Error", error.message);
    }
};
(async () => {
    await boostServer();
})();
process.on("SIGTERM", () => {
    console.log("Sigterm singnal detected... Server shuting down.");
    if (server) {
        server.close(() => {
            process.exit(0);
        });
    }
    process.exit(0);
});
process.on("SIGINT", () => {
    console.log("Sigint signal detected... Server shuting doen.");
    if (server) {
        server.close(() => {
            process.exit(0);
        });
    }
    process.exit(0);
});
process.on("uncaughtException", () => {
    console.log("UncaughtException detected... Server shuting doen.");
    if (server) {
        server.close(() => {
            process.exit(0);
        });
    }
    process.exit(0);
});
process.on("unhandledRejection", () => {
    console.log("UnhandledRejection detected... Server shuting doen.");
    if (server) {
        server.close(() => {
            process.exit(0);
        });
    }
    process.exit(0);
});
//# sourceMappingURL=server.js.map