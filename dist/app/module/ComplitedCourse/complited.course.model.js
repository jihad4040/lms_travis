"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplitedCourse = void 0;
const mongoose_1 = require("mongoose");
const complitedCourseSchema = new mongoose_1.Schema({
    courseCompliteDate: {
        type: Date,
        default: Date.now()
    },
    userId: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true
    },
    badgesId: {
        type: mongoose_1.Types.ObjectId,
        ref: "Badge",
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.ComplitedCourse = (0, mongoose_1.model)("ComplitedCourse", complitedCourseSchema);
//# sourceMappingURL=complited.course.model.js.map