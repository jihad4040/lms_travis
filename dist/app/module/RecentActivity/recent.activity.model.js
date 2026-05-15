"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecentActivity = void 0;
const mongoose_1 = require("mongoose");
const recentSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false,
    expires: "7d"
});
exports.RecentActivity = (0, mongoose_1.model)("RecentActivity", recentSchema);
//# sourceMappingURL=recent.activity.model.js.map