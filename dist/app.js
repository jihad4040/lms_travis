"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const notFoundRoute_1 = require("./app/utils/notFoundRoute");
const route_1 = require("./app/route/route");
const global_error_handler_1 = require("./app/middleware/global.error.handler");
const pasport_config_1 = __importDefault(require("./app/config/pasport.config"));
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://travisjerovetz-frontend.vercel.app",
        "http://20.236.245.21:3000",
        "http://20.236.245.21",
        "http://learning.awcompaniesinc.com",
        "*",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
exports.app.use(express_1.default.json({ limit: "100mb" }));
exports.app.use(express_1.default.urlencoded({ limit: "100mb", extended: true }));
exports.app.use(pasport_config_1.default.initialize());
exports.app.use((0, cookie_parser_1.default)());
// Module Route
route_1.moduleRoute.forEach((item) => exports.app.use(`/v1${item.path}`, item.routes));
exports.app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server runing success",
    });
});
exports.app.use(global_error_handler_1.globalErrorhandler);
exports.app.use(notFoundRoute_1.notFound);
//# sourceMappingURL=app.js.map