"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentActivity = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const recent_activity_model_1 = require("./recent.activity.model");
const sendResponse_1 = require("../../utils/sendResponse");
exports.getRecentActivity = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await recent_activity_model_1.RecentActivity.find({}).sort("-createdAt").limit(5);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Activity Retrived Success",
        data: result
    });
});
//# sourceMappingURL=recent.activity.controller.js.map